import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from './layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/adminApi';
import { queryClient } from '@/lib/queryClient';
import type { Project, InsertProject, Organization, Region } from '@shared/schema';
import { projectCategories, projectStatuses } from '@shared/schema';
import { DEFAULT_PROJECT_IMAGE } from '@/lib/constants';

export default function AdminProjects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  const { data: organizations } = useQuery<Organization[]>({
    queryKey: ['/api/organizations'],
  });

  const { data: regions, isLoading: isLoadingRegions } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertProject) =>
      apiRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsCreateDialogOpen(false);
      toast({ title: 'Project created successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create project',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertProject> }) =>
      apiRequest(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
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
    mutationFn: (id: string) =>
      apiRequest(`/api/projects/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
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

  const filteredProjects =
    projects?.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertProject = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
      region: formData.get('region') as string,
      organizationId: formData.get('organizationId') as string,
      sdgGoals: [],
      impactMetrics: formData.get('impactMetrics') as string,
      fundingGoal: Number(formData.get('fundingGoal')) || undefined,
      seekingInvestment: formData.get('seekingInvestment') === 'true',
    };
    createMutation.mutate(data);
  };

  const handleUpdateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;
    const formData = new FormData(e.currentTarget);
    const data: Partial<InsertProject> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
      region: formData.get('region') as string,
      organizationId: formData.get('organizationId') as string,
      impactMetrics: formData.get('impactMetrics') as string,
      fundingGoal: Number(formData.get('fundingGoal')) || undefined,
      seekingInvestment: formData.get('seekingInvestment') === 'true',
    };
    updateMutation.mutate({ id: selectedProject.id, data });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-projects">
              Projects Management
            </h1>
            <p className="text-muted-foreground">
              Manage all projects in the platform
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            data-testid="button-create-project"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading projects...</div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} data-testid={`project-card-${project.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-2">
                        {project.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{project.category}</Badge>
                        <Badge variant="secondary">{project.region}</Badge>
                        <Badge
                          variant={
                            project.status === 'Active' ? 'default' : 'outline'
                          }
                        >
                          {project.status}
                        </Badge>
                        {project.seekingInvestment && (
                          <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800">
                            Seeking Investment
                          </Badge>
                        )}
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
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  {project.fundingGoal && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Funding: </span>
                        <span className="font-medium">
                          ${(project.fundingCurrent || 0).toLocaleString()} / $
                          {project.fundingGoal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ProjectFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateProject}
          organizations={organizations || []}
          regions={regions || []}
          isLoading={createMutation.isPending}
          isLoadingRegions={isLoadingRegions}
          title="Create Project"
        />

        <ProjectFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateProject}
          organizations={organizations || []}
          regions={regions || []}
          isLoading={updateMutation.isPending}
          isLoadingRegions={isLoadingRegions}
          title="Edit Project"
          project={selectedProject}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedProject?.title}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  selectedProject && deleteMutation.mutate(selectedProject.id)
                }
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-testid="button-confirm-delete"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}

function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  organizations,
  regions,
  isLoading,
  isLoadingRegions,
  title,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  organizations: Organization[];
  regions: Region[];
  isLoading: boolean;
  isLoadingRegions: boolean;
  title: string;
  project?: Project | null;
}) {
  const [imageUrl, setImageUrl] = useState(project?.imageUrl || '');
  const activeRegions = regions.filter((region) => region.isActive);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {project ? 'Update project details' : 'Create a new project'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={project?.title}
                data-testid="input-title"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
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
              <Label htmlFor="category">Category</Label>
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
              <Label htmlFor="status">Status</Label>
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
              <Label htmlFor="region">Region</Label>
              <Select name="region" defaultValue={project?.region} required disabled={isLoadingRegions}>
                <SelectTrigger data-testid="select-region">
                  <SelectValue placeholder={isLoadingRegions ? "Loading regions..." : "Select region"} />
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
              <Label htmlFor="organizationId">Organization</Label>
              <Select
                name="organizationId"
                defaultValue={project?.organizationId}
                required
              >
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
              <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
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
              <Label htmlFor="impactMetrics">Impact Metrics</Label>
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
              {isLoading ? 'Saving...' : project ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
