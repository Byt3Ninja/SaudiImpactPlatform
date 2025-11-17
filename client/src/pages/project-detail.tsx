import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Project, Organization } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Building2, TrendingUp, DollarSign, Users, ExternalLink } from "lucide-react";
import { sdgGoalsData } from "@shared/schema";
import { DEFAULT_PROJECT_IMAGE } from '@/lib/constants';

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const projectId = params?.id;

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const { data: organization } = useQuery<Organization>({
    queryKey: ["/api/organizations", project?.organizationId],
    enabled: !!project?.organizationId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Link href="/projects">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const fundingProgress = project.fundingGoal
    ? ((project.fundingCurrent || 0) / project.fundingGoal) * 100
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={project.imageUrl || DEFAULT_PROJECT_IMAGE}
          alt={project.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link href="/projects">
              <Button variant="outline" className="mb-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="button-back">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            <Badge className="mb-4" data-testid="badge-category">{project.category}</Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-2" data-testid="text-project-title">
              {project.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{project.region}</span>
              </div>
              <Badge variant="outline" className="border-white/20 text-white" data-testid="badge-status">
                {project.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                  {project.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid="text-impact-metrics">
                  {project.impactMetrics}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainable Development Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.sdgGoals.map(sdgId => {
                    const sdg = sdgGoalsData.find(s => s.id.toString() === sdgId);
                    return sdg ? (
                      <div
                        key={sdgId}
                        className="flex items-center gap-3 p-3 rounded-md border"
                        style={{ borderColor: sdg.color }}
                        data-testid={`sdg-goal-${sdgId}`}
                      >
                        <div
                          className="w-12 h-12 rounded-md flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: sdg.color }}
                        >
                          {sdg.id}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{sdg.name}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {organization && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="font-semibold mb-1" data-testid="text-org-name">{organization.name}</div>
                    <div className="text-sm text-muted-foreground">{organization.type}</div>
                  </div>
                  {organization.website && (
                    <a href={organization.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full" data-testid="button-org-website">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit Website
                      </Button>
                    </a>
                  )}
                  <Link href={`/organizations/${organization.id}`}>
                    <Button variant="outline" size="sm" className="w-full" data-testid="button-view-org">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {project.seekingInvestment && project.fundingGoal && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Funding Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{fundingProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={fundingProgress} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Raised</div>
                      <div className="text-lg font-bold" data-testid="text-funding-current">
                        {(project.fundingCurrent || 0).toLocaleString()} SAR
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Goal</div>
                      <div className="text-lg font-bold" data-testid="text-funding-goal">
                        {project.fundingGoal.toLocaleString()} SAR
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" data-testid="button-learn-investment">
                    Learn About Investment
                  </Button>
                </CardContent>
              </Card>
            )}

            {project.latitude && project.longitude && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {project.region}, Saudi Arabia
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
