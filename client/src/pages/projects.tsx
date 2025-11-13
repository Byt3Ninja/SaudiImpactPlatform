import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ArrowRight, Filter, Leaf, Heart, Building2, GraduationCap, Zap, Users } from "lucide-react";
import { projectCategories, saudiRegions, projectStatuses, sdgGoalsData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const categoryIcons = {
  Environmental: Leaf,
  Social: Heart,
  Infrastructure: Building2,
  Education: GraduationCap,
  "Technology & Innovation": Zap,
  default: Users,
};

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSDGs, setSelectedSDGs] = useState<string[]>([]);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects", selectedRegion, selectedStatus, selectedCategories, selectedSDGs, searchTerm],
  });

  const filteredProjects = projects.filter((project) => {
    if (searchTerm && !project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedRegion !== "all" && project.region !== selectedRegion) return false;
    if (selectedStatus !== "all" && project.status !== selectedStatus) return false;
    if (selectedCategories.length > 0 && !selectedCategories.includes(project.category)) return false;
    if (selectedSDGs.length > 0 && !selectedSDGs.some(sdg => project.sdgGoals.includes(sdg))) return false;
    return true;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleSDG = (sdg: string) => {
    setSelectedSDGs(prev =>
      prev.includes(sdg) ? prev.filter(s => s !== sdg) : [...prev, sdg]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4" data-testid="text-page-title">
            Impact Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore transformative social and environmental initiatives across Saudi Arabia
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger data-testid="select-region">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {saudiRegions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {projectStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Category</Label>
                  {projectCategories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        data-testid={`checkbox-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label>SDG Goals</Label>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {sdgGoalsData.slice(0, 10).map(sdg => (
                      <div key={sdg.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sdg-${sdg.id}`}
                          checked={selectedSDGs.includes(sdg.id.toString())}
                          onCheckedChange={() => toggleSDG(sdg.id.toString())}
                          data-testid={`checkbox-sdg-${sdg.id}`}
                        />
                        <label
                          htmlFor={`sdg-${sdg.id}`}
                          className="text-sm font-normal leading-none cursor-pointer"
                        >
                          {sdg.id}. {sdg.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-projects"
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i}>
                    <Skeleton className="aspect-video w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredProjects.map(project => {
                  const CategoryIcon = categoryIcons[project.category as keyof typeof categoryIcons] || categoryIcons.default;
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
                            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {project.category}
                            </Badge>
                          </div>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2" data-testid={`text-project-title-${project.id}`}>
                          {project.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{project.region}</p>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {project.sdgGoals.slice(0, 3).map(sdgId => {
                            const sdg = sdgGoalsData.find(s => s.id.toString() === sdgId);
                            return sdg ? (
                              <Badge
                                key={sdgId}
                                variant="outline"
                                className="text-xs"
                                style={{ borderColor: sdg.color, color: sdg.color }}
                              >
                                SDG {sdg.id}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" data-testid={`badge-status-${project.id}`}>
                            {project.status}
                          </Badge>
                          <Link href={`/projects/${project.id}`}>
                            <Button variant="ghost" size="sm" data-testid={`button-view-${project.id}`}>
                              View Details
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!isLoading && filteredProjects.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No projects found matching your criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRegion("all");
                    setSelectedStatus("all");
                    setSelectedCategories([]);
                    setSelectedSDGs([]);
                  }}
                  data-testid="button-reset-filters"
                >
                  Reset Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
