import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Organization, Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, Globe, Mail, MapPin, ArrowRight } from "lucide-react";
import { DEFAULT_ORGANIZATION_LOGO } from '@/lib/constants';

export default function OrganizationDetail() {
  const [, params] = useRoute("/organizations/:id");
  const organizationId = params?.id;

  const { data: organization, isLoading } = useQuery<Organization>({
    queryKey: ["/api/organizations", organizationId],
    enabled: !!organizationId,
  });

  const { data: allProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !!organizationId,
  });

  const orgProjects = allProjects.filter(p => p.organizationId === organizationId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Organization not found</p>
          <Link href="/organizations">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Organizations
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <Link href="/organizations">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Organizations
            </Button>
          </Link>
          
          <div className="flex items-start gap-6">
            <img
              src={organization.logoUrl || DEFAULT_ORGANIZATION_LOGO}
              alt={organization.name}
              className="w-20 h-20 rounded-md object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_ORGANIZATION_LOGO;
              }}
            />
            <div className="flex-1">
              <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-3" data-testid="text-org-name">
                {organization.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" data-testid="badge-type">{organization.type}</Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{organization.region}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                  {organization.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects ({orgProjects.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {orgProjects.length > 0 ? (
                  <div className="space-y-4">
                    {orgProjects.map(project => (
                      <div
                        key={project.id}
                        className="flex items-start justify-between p-4 border rounded-md hover-elevate"
                        data-testid={`project-item-${project.id}`}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{project.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {project.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{project.category}</Badge>
                            <Badge variant="outline" className="text-xs">{project.status}</Badge>
                          </div>
                        </div>
                        <Link href={`/projects/${project.id}`}>
                          <Button variant="ghost" size="sm" data-testid={`button-view-project-${project.id}`}>
                            View
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No projects found for this organization
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {organization.website && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Website</div>
                    <a
                      href={organization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                      data-testid="link-website"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="break-all">{organization.website}</span>
                    </a>
                  </div>
                )}
                {organization.contactEmail && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <a
                      href={`mailto:${organization.contactEmail}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                      data-testid="link-email"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="break-all">{organization.contactEmail}</span>
                    </a>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Region</div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{organization.region}, Saudi Arabia</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-2xl font-bold" data-testid="text-project-count">
                    {orgProjects.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {orgProjects.filter(p => p.status === "Active").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Currently Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {orgProjects.filter(p => p.status === "Completed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
