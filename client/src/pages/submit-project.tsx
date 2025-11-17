import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, Upload } from 'lucide-react';
import type { Organization, Region } from '@shared/schema';
import { projectCategories, projectStatuses } from '@shared/schema';

export default function SubmitProject() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');

  const { data: user } = useQuery<{ id: string; email: string }>({
    queryKey: ['/api/auth/user'],
  });

  const { data: organizations } = useQuery<Organization[]>({
    queryKey: ['/api/organizations'],
  });

  const { data: regions, isLoading: isLoadingRegions } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const projectData = {
        title: data.get('title') as string,
        description: data.get('description') as string,
        category: data.get('category') as string,
        status: data.get('status') as string,
        region: data.get('region') as string,
        organizationId: data.get('organizationId') as string,
        imageUrl: data.get('imageUrl') as string || null,
        fundingGoal: data.get('fundingGoal') ? Number(data.get('fundingGoal')) : null,
        impactMetrics: data.get('impactMetrics') as string,
        seekingInvestment: data.get('seekingInvestment') === 'true',
        sdgGoals: [],
      };

      return apiRequest('POST', '/api/projects', projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: 'Project submitted successfully',
        description: 'Your project has been created and is now visible on the platform.',
      });
      navigate('/my-projects');
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to submit project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    submitMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to submit a project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} data-testid="button-login">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeRegions = regions?.filter((region) => region.isActive) || [];

  return (
    <div className="container max-w-3xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="heading-submit-project">
          Submit a Project
        </h1>
        <p className="text-muted-foreground">
          Share your impact project with the community. All projects are publicly visible once submitted.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  placeholder="Enter project title"
                  data-testid="input-title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  placeholder="Describe your project, its goals, and expected impact"
                  data-testid="input-description"
                />
              </div>

              <div>
                <Label htmlFor="imageUrl">Cover Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="text"
                  placeholder="/attached_assets/stock_images/example.jpg or https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  data-testid="input-image-url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Enter a URL to a cover image for your project
                </p>
                {imageUrl && (
                  <div className="mt-3 rounded-md overflow-hidden border">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select name="category" required>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select name="status" required defaultValue="Planning">
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="region">Region *</Label>
                  <Select name="region" required disabled={isLoadingRegions}>
                    <SelectTrigger data-testid="select-region">
                      <SelectValue placeholder={isLoadingRegions ? "Loading..." : "Select region"} />
                    </SelectTrigger>
                    <SelectContent>
                      {activeRegions.map((region) => (
                        <SelectItem key={region.id} value={region.name}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="organizationId">Organization *</Label>
                  <Select name="organizationId" required>
                    <SelectTrigger data-testid="select-organization">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations?.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fundingGoal">Funding Goal (USD)</Label>
                  <Input
                    id="fundingGoal"
                    name="fundingGoal"
                    type="number"
                    min="0"
                    placeholder="0"
                    data-testid="input-funding-goal"
                  />
                </div>

                <div>
                  <Label htmlFor="seekingInvestment">Seeking Investment</Label>
                  <Select name="seekingInvestment" defaultValue="false">
                    <SelectTrigger data-testid="select-seeking-investment">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="impactMetrics">Impact Metrics *</Label>
                <Textarea
                  id="impactMetrics"
                  name="impactMetrics"
                  required
                  rows={3}
                  placeholder="Describe the expected or achieved impact (e.g., number of beneficiaries, environmental metrics)"
                  data-testid="input-impact-metrics"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/projects')}
                disabled={submitMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                data-testid="button-submit"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
