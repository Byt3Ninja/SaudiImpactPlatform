import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Project, Organization } from "@shared/schema";
import { ArrowRight, TrendingUp, Users, Target, Building2, Leaf, Heart } from "lucide-react";
import heroImage from "@assets/generated_images/Saudi_renewable_energy_project_7646abb9.png";

export default function Home() {
  const { data: stats } = useQuery<{
    totalProjects: number;
    activeProjects: number;
    totalFunding: number;
    organizations: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const { data: featuredProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/featured"],
  });

  const categoryIcons = {
    Environmental: Leaf,
    Social: Heart,
    Infrastructure: Building2,
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center max-w-4xl">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6" data-testid="text-hero-title">
            Transforming Saudi Arabia Through Impact
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover and track social and environmental impact projects across the Kingdom. Connect with organizations, explore investment opportunities, and measure sustainable development outcomes.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/projects">
              <Button size="lg" variant="default" className="text-base" data-testid="button-explore-projects">
                Explore Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/opportunities">
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                data-testid="button-investment-opportunities"
              >
                Investment Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-card border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Projects", value: stats?.totalProjects || 0, icon: Target, color: "text-chart-1" },
              { label: "Active Initiatives", value: stats?.activeProjects || 0, icon: TrendingUp, color: "text-chart-2" },
              { label: "Organizations", value: stats?.organizations || 0, icon: Users, color: "text-chart-3" },
              { label: "Total Funding", value: `${((stats?.totalFunding || 0) / 1000000).toFixed(1)}M SAR`, icon: Building2, color: "text-chart-4" },
            ].map((stat, idx) => (
              <Card key={idx} className="hover-elevate" data-testid={`card-stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold" data-testid={`text-stat-value-${idx}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-2">Featured Projects</h2>
              <p className="text-muted-foreground">Transformative initiatives driving sustainable development</p>
            </div>
            <Link href="/projects">
              <Button variant="outline" data-testid="button-view-all-projects">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.slice(0, 3).map((project) => {
              const CategoryIcon = categoryIcons[project.category as keyof typeof categoryIcons] || Target;
              return (
                <Card key={project.id} className="hover-elevate overflow-hidden group" data-testid={`card-project-${project.id}`}>
                  {project.imageUrl && (
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm" data-testid={`badge-category-${project.id}`}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2" data-testid={`text-project-title-${project.id}`}>{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.region}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" data-testid={`badge-status-${project.id}`}>{project.status}</Badge>
                      <Link href={`/projects/${project.id}`}>
                        <Button variant="ghost" size="sm" data-testid={`button-learn-more-${project.id}`}>
                          Learn More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">Join the Impact Movement</h2>
          <p className="text-muted-foreground mb-8">
            Whether you're a government entity, NGO, investor, or researcher, discover how you can contribute to Saudi Arabia's sustainable development goals.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/organizations">
              <Button size="lg" variant="default" data-testid="button-view-organizations">
                View Organizations
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" data-testid="button-view-dashboard">
                Impact Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
