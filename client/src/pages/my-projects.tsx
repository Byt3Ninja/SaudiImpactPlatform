import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { Project, Organization, Region } from '@shared/schema';
import { projectCategories, projectStatuses } from '@shared/schema';
import { DEFAULT_PROJECT_IMAGE } from '@/lib/constants';

export default function MyProjects() {
  const [, navigate] = useLocation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const { data: user } = useQuery<{ id: string; email: string }>({
    queryKey: ['/api/auth/user'],
  });

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/user/projects'],
  });

  const { data: organizations } = useQuery<Organization[]>({
    queryKey: ['/api/organizations'],
  });

  const { data: regions, isLoading: isLoadingRegions } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
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

      return apiRequest('PATCH', `/api/projects/${id}`, projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/projects'] });
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      toast({ title: 'Project updated successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/projects/${id}`, null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/projects'] });
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
      toast({ title: 'Project deleted successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEditProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({ id: selectedProject.id, data: formData });
  };

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to view your projects.
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

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const activeRegions = regions?.filter((region) => region.isActive) || [];

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="heading-my-projects">
            My Projects
          </h1>
          <p className="text-muted-foreground">
            Manage your submitted projects
          </p>
        </div>
        <Button onClick={() => navigate('/submit-project')} data-testid="button-submit-project">
          <Plus className="w-4 h-4 mr-2" />
          Submit Project
        </Button>
      </div>

      {!projects || projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven't submitted any projects yet.
            </p>
            <Button onClick={() => navigate('/submit-project')} data-testid="button-submit-first">
              <Plus className="w-4 h-4 mr-2" />
              Submit Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover-elevate" data-testid={`card-project-${project.id}`}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={project.imageUrl || DEFAULT_PROJECT_IMAGE}
                      alt={project.title}
                      className="w-48 h-32 object-cover rounded-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold mb-1" data-testid={`text-title-${project.id}`}>
                          {project.title}
                        </h3>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline" data-testid={`badge-category-${project.id}`}>
                            {project.category}
                          </Badge>
                          <Badge variant="secondary" data-testid={`badge-status-${project.id}`}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline">{project.region}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsEditDialogOpen(true);
                          }}
                          data-testid={`button-edit-${project.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsDeleteDialogOpen(true);
                          }}
                          data-testid={`button-delete-${project.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Impact:</strong> {project.impactMetrics}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProjectEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditProject}
        organizations={organizations || []}
        regions={activeRegions}
        isLoading={updateMutation.isPending}
        isLoadingRegions={isLoadingRegions}
        project={selectedProject}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedProject && deleteMutation.mutate(selectedProject.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProjectEditDialog({
  open,
  onOpenChange,
  onSubmit,
  organizations,
  regions,
  isLoading,
  isLoadingRegions,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  organizations: Organization[];
  regions: Region[];
  isLoading: boolean;
  isLoadingRegions: boolean;
  project: Project | null;
}) {
  const [imageUrl, setImageUrl] = useState('');

  // Update imageUrl when project changes
  if (project && imageUrl === '' && open) {
    setImageUrl(project.imageUrl || '');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update your project details</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={project?.title}
                data-testid="input-title"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                required
                defaultValue={project?.description}
                data-testid="input-description"
              />
            </div>
            <div className="col-span-2">
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
                Optional: Enter a URL to a cover image (or leave blank for default placeholder)
              </p>
              <div className="mt-3 rounded-md overflow-hidden border">
                <img
                  src={imageUrl || DEFAULT_PROJECT_IMAGE}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
                  }}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={project?.category} required>
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
              <Select name="status" defaultValue={project?.status} required>
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
            <div>
              <Label htmlFor="region">Region *</Label>
              <Select name="region" defaultValue={project?.region} required disabled={isLoadingRegions}>
                <SelectTrigger data-testid="select-region">
                  <SelectValue placeholder={isLoadingRegions ? "Loading..." : "Select region"} />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="organizationId">Organization *</Label>
              <Select name="organizationId" defaultValue={project?.organizationId} required>
                <SelectTrigger data-testid="select-organization">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fundingGoal">Funding Goal (USD)</Label>
              <Input
                id="fundingGoal"
                name="fundingGoal"
                type="number"
                min="0"
                defaultValue={project?.fundingGoal || ''}
                data-testid="input-funding-goal"
              />
            </div>
            <div>
              <Label htmlFor="seekingInvestment">Seeking Investment</Label>
              <Select
                name="seekingInvestment"
                defaultValue={
                  project?.seekingInvestment !== undefined
                    ? String(project.seekingInvestment)
                    : 'false'
                }
              >
                <SelectTrigger data-testid="select-seeking-investment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label htmlFor="impactMetrics">Impact Metrics *</Label>
              <Textarea
                id="impactMetrics"
                name="impactMetrics"
                rows={2}
                required
                defaultValue={project?.impactMetrics}
                data-testid="input-impact-metrics"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} data-testid="button-submit">
              {isLoading ? 'Saving...' : 'Update Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
