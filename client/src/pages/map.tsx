import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MapPin, Filter, X } from "lucide-react";
import { projectCategories, saudiRegions } from "@shared/schema";
import { Link } from "wouter";
import { useTranslation } from 'react-i18next';

export default function Map() {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter(project => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(project.category)) return false;
    if (selectedRegions.length > 0 && !selectedRegions.includes(project.region)) return false;
    return true;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <h1 className="font-serif text-3xl font-semibold" data-testid="text-page-title">
            {t('map.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('map.description')}
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r bg-card overflow-y-auto p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {t('map.filters.title')}
              </h3>
              {(selectedCategories.length > 0 || selectedRegions.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedRegions([]);
                  }}
                  data-testid="button-clear-filters"
                >
                  {t('common.clear')}
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label className="mb-3 block">Category</Label>
                <div className="space-y-2">
                  {projectCategories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`map-category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        data-testid={`checkbox-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <label
                        htmlFor={`map-category-${category}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Region</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {saudiRegions.map(region => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={`map-region-${region}`}
                        checked={selectedRegions.includes(region)}
                        onCheckedChange={() => toggleRegion(region)}
                        data-testid={`checkbox-region-${region.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                      <label
                        htmlFor={`map-region-${region}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {region}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-3">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} on map
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredProjects.map(project => (
                <Card
                  key={project.id}
                  className="cursor-pointer hover-elevate"
                  onClick={() => setSelectedProject(project)}
                  data-testid={`map-project-${project.id}`}
                >
                  <CardContent className="p-3">
                    <div className="font-medium text-sm mb-1 line-clamp-1">{project.title}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{project.category}</Badge>
                      <span className="text-xs text-muted-foreground">{project.region}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 relative bg-muted/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8 max-w-md">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-2xl font-semibold mb-2">Interactive Map View</h3>
              <p className="text-muted-foreground mb-4">
                This map will display project locations across Saudi Arabia with interactive markers and clusters.
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-card rounded-md border">
                  <MapPin className="h-5 w-5 text-chart-1 mx-auto mb-1" />
                  <div className="font-medium">Environmental</div>
                </div>
                <div className="p-3 bg-card rounded-md border">
                  <MapPin className="h-5 w-5 text-chart-2 mx-auto mb-1" />
                  <div className="font-medium">Social</div>
                </div>
                <div className="p-3 bg-card rounded-md border">
                  <MapPin className="h-5 w-5 text-chart-3 mx-auto mb-1" />
                  <div className="font-medium">Infrastructure</div>
                </div>
              </div>
            </div>
          </div>

          {selectedProject && (
            <div className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] overflow-y-auto">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex-1 pr-8">{selectedProject.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedProject(null)}
                      data-testid="button-close-project"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge>{selectedProject.category}</Badge>
                    <span className="text-sm text-muted-foreground">{selectedProject.region}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedProject.imageUrl && (
                    <img
                      src={selectedProject.imageUrl}
                      alt={selectedProject.title}
                      className="w-full aspect-video object-cover rounded-md"
                    />
                  )}
                  <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                  <div className="flex gap-2">
                    <Link href={`/projects/${selectedProject.id}`} className="flex-1">
                      <Button className="w-full" data-testid="button-view-full-details">
                        View Full Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
