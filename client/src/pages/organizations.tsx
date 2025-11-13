import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Organization } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Building2, Globe, Mail, ArrowRight } from "lucide-react";
import { organizationTypes, saudiRegions } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from 'react-i18next';

export default function Organizations() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const { data: organizations = [], isLoading } = useQuery<Organization[]>({
    queryKey: ["/api/organizations"],
  });

  const filteredOrganizations = organizations.filter((org) => {
    if (searchTerm && !org.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !org.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedType !== "all" && org.type !== selectedType) return false;
    if (selectedRegion !== "all" && org.region !== selectedRegion) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4" data-testid="text-page-title">
            {t('organizations.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t('organizations.description')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('organizations.filters.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('organizations.filters.type')}</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger data-testid="select-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('organizations.filters.allTypes')}</SelectItem>
                      {organizationTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('organizations.filters.region')}</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger data-testid="select-region">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('organizations.filters.allRegions')}</SelectItem>
                      {saudiRegions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('organizations.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-organizations"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              {t('organizations.resultsCount', { count: filteredOrganizations.length })}
            </div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i}>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrganizations.map(org => (
                  <Card key={org.id} className="hover-elevate" data-testid={`card-organization-${org.id}`}>
                    <CardHeader>
                      <div className="flex items-start gap-3 mb-2">
                        {org.logoUrl ? (
                          <img src={org.logoUrl} alt={org.name} className="w-12 h-12 rounded-md object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base line-clamp-2" data-testid={`text-org-name-${org.id}`}>
                            {org.name}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge variant="outline" className="w-fit" data-testid={`badge-type-${org.id}`}>
                        {org.type}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {org.description}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {org.region}
                      </div>
                      <div className="flex items-center gap-2">
                        {org.website && (
                          <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button variant="outline" size="sm" className="w-full" data-testid={`button-website-${org.id}`}>
                              <Globe className="mr-2 h-3 w-3" />
                              {t('organizations.website')}
                            </Button>
                          </a>
                        )}
                        <Link href={`/organizations/${org.id}`} className="flex-1">
                          <Button variant="ghost" size="sm" className="w-full" data-testid={`button-view-${org.id}`}>
                            {t('organizations.view')}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && filteredOrganizations.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">{t('organizations.noResults')}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                    setSelectedRegion("all");
                  }}
                  data-testid="button-reset-filters"
                >
                  {t('organizations.resetFilters')}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
