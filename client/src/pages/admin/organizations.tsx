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
import { Plus, Pencil, Trash2, Search, Globe, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/adminApi';
import { queryClient } from '@/lib/queryClient';
import type { Organization, InsertOrganization, Region, OrganizationType, OrganizationSubtype, Service } from '@shared/schema';

export default function AdminOrganizations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const { toast } = useToast();

  const { data: organizations, isLoading } = useQuery<Organization[]>({
    queryKey: ['/api/organizations'],
  });

  const { data: regions, isLoading: isLoadingRegions } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
  });

  const { data: organizationTypes, isLoading: isLoadingTypes } = useQuery<OrganizationType[]>({
    queryKey: ['/api/organization-types'],
  });

  const { data: organizationSubtypes, isLoading: isLoadingSubtypes } = useQuery<OrganizationSubtype[]>({
    queryKey: ['/api/organization-subtypes'],
  });

  const { data: services, isLoading: isLoadingServices } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertOrganization) =>
      apiRequest('/api/organizations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/organizations'] });
      setIsCreateDialogOpen(false);
      toast({ title: 'Organization created successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create organization',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertOrganization> }) =>
      apiRequest(`/api/organizations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/organizations'] });
      setIsEditDialogOpen(false);
      setSelectedOrg(null);
      toast({ title: 'Organization updated successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update organization',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/organizations/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/organizations'] });
      setIsDeleteDialogOpen(false);
      setSelectedOrg(null);
      toast({ title: 'Organization deleted successfully' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete organization',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const filteredOrgs =
    organizations?.filter((org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleCreateOrg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: InsertOrganization = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      region: formData.get('region') as string,
      website: (formData.get('website') as string) || undefined,
      contactEmail: (formData.get('contactEmail') as string) || undefined,
    };
    createMutation.mutate(data);
  };

  const handleUpdateOrg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrg) return;
    const formData = new FormData(e.currentTarget);
    const data: Partial<InsertOrganization> = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      region: formData.get('region') as string,
      website: (formData.get('website') as string) || undefined,
      contactEmail: (formData.get('contactEmail') as string) || undefined,
    };
    updateMutation.mutate({ id: selectedOrg.id, data });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="heading-organizations">
              Organizations Management
            </h1>
            <p className="text-muted-foreground">
              Manage all organizations in the platform
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            data-testid="button-create-organization"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredOrgs.length} organization{filteredOrgs.length !== 1 ? 's' : ''}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading organizations...</div>
        ) : (
          <div className="grid gap-4">
            {filteredOrgs.map((org) => (
              <Card key={org.id} data-testid={`org-card-${org.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl mb-2">{org.name}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{org.type}</Badge>
                        <Badge variant="secondary">{org.region}</Badge>
                        {org.subType && (
                          <Badge variant="outline">{org.subType}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedOrg(org);
                          setIsEditDialogOpen(true);
                        }}
                        data-testid={`button-edit-${org.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedOrg(org);
                          setIsDeleteDialogOpen(true);
                        }}
                        data-testid={`button-delete-${org.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {org.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Globe className="w-3 h-3" />
                        Website
                      </a>
                    )}
                    {org.contactEmail && (
                      <a
                        href={`mailto:${org.contactEmail}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Mail className="w-3 h-3" />
                        {org.contactEmail}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <OrgFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreateOrg}
          regions={regions || []}
          organizationTypes={organizationTypes || []}
          organizationSubtypes={organizationSubtypes || []}
          services={services || []}
          isLoading={createMutation.isPending}
          isLoadingRegions={isLoadingRegions}
          isLoadingTypes={isLoadingTypes}
          isLoadingSubtypes={isLoadingSubtypes}
          isLoadingServices={isLoadingServices}
          title="Create Organization"
        />

        <OrgFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleUpdateOrg}
          regions={regions || []}
          organizationTypes={organizationTypes || []}
          organizationSubtypes={organizationSubtypes || []}
          services={services || []}
          isLoading={updateMutation.isPending}
          isLoadingRegions={isLoadingRegions}
          isLoadingTypes={isLoadingTypes}
          isLoadingSubtypes={isLoadingSubtypes}
          isLoadingServices={isLoadingServices}
          title="Edit Organization"
          organization={selectedOrg}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Organization</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedOrg?.name}"? This
                action cannot be undone and will affect all associated projects.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  selectedOrg && deleteMutation.mutate(selectedOrg.id)
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

function OrgFormDialog({
  open,
  onOpenChange,
  onSubmit,
  regions,
  organizationTypes,
  organizationSubtypes,
  services,
  isLoading,
  isLoadingRegions,
  isLoadingTypes,
  isLoadingSubtypes,
  isLoadingServices,
  title,
  organization,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  regions: Region[];
  organizationTypes: OrganizationType[];
  organizationSubtypes: OrganizationSubtype[];
  services: Service[];
  isLoading: boolean;
  isLoadingRegions: boolean;
  isLoadingTypes: boolean;
  isLoadingSubtypes: boolean;
  isLoadingServices: boolean;
  title: string;
  organization?: Organization | null;
}) {
  const activeRegions = regions.filter((region) => region.isActive);
  const activeTypes = organizationTypes.filter((type) => type.isActive);
  const activeSubtypes = organizationSubtypes.filter((subtype) => subtype.isActive);
  const activeServices = services.filter((service) => service.isActive);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {organization ? 'Update organization details' : 'Create a new organization'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={organization?.name}
                data-testid="input-name"
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue={organization?.type} required disabled={isLoadingTypes}>
                <SelectTrigger data-testid="select-type">
                  <SelectValue placeholder={isLoadingTypes ? "Loading types..." : "Select type"} />
                </SelectTrigger>
                <SelectContent>
                  {activeTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Select name="region" defaultValue={organization?.region} required disabled={isLoadingRegions}>
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
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                required
                defaultValue={organization?.description}
                data-testid="input-description"
              />
            </div>
            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://"
                defaultValue={organization?.website || ''}
                data-testid="input-website"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email (Optional)</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                placeholder="contact@example.com"
                defaultValue={organization?.contactEmail || ''}
                data-testid="input-contact-email"
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
              {isLoading ? 'Saving...' : organization ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
