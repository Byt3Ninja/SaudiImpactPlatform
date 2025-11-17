import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp, DollarSign, MapPin, ArrowRight } from "lucide-react";
import { projectCategories, saudiRegions, sdgGoalsData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from 'react-i18next';
import { DEFAULT_PROJECT_IMAGE } from '@/lib/constants';

export default function Opportunities() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const { data: opportunities = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/opportunities"],
  });

  const filteredOpportunities = opportunities.filter((opp) => {
    if (searchTerm && !opp.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== "all" && opp.category !== selectedCategory) return false;
    if (selectedRegion !== "all" && opp.region !== selectedRegion) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4" data-testid="text-page-title">
            {t('opportunities.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {t('opportunities.description')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('opportunities.filters.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('opportunities.filters.category')}</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('opportunities.filters.allCategories')}</SelectItem>
                      {projectCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('opportunities.filters.region')}</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger data-testid="select-region">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('opportunities.filters.allRegions')}</SelectItem>
                      {saudiRegions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {t('opportunities.quickStats')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-2xl font-bold">{filteredOpportunities.length}</div>
                  <div className="text-sm text-muted-foreground">{t('opportunities.availableOpportunities')}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {(filteredOpportunities.reduce((sum, opp) => sum + (opp.fundingGoal || 0), 0) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">{t('opportunities.totalFundingNeeded')} ({t('common.currency')})</div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('opportunities.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                data-testid="input-search-opportunities"
              />
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-2 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOpportunities.map(opportunity => {
                  const fundingProgress = opportunity.fundingGoal
                    ? ((opportunity.fundingCurrent || 0) / opportunity.fundingGoal) * 100
                    : 0;

                  return (
                    <Card key={opportunity.id} className="hover-elevate" data-testid={`card-opportunity-${opportunity.id}`}>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                          <img
                            src={opportunity.imageUrl || DEFAULT_PROJECT_IMAGE}
                            alt={opportunity.title}
                            className="w-full h-full object-cover rounded-l-md"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
                            }}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="mb-2" data-testid={`text-opportunity-title-${opportunity.id}`}>
                                  {opportunity.title}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge variant="outline" data-testid={`badge-category-${opportunity.id}`}>
                                    {opportunity.category}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    {opportunity.region}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {opportunity.description}
                            </p>

                            {opportunity.fundingGoal && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{t('opportunities.fundingProgress')}</span>
                                  <span className="font-semibold">{fundingProgress.toFixed(0)}%</span>
                                </div>
                                <Progress value={fundingProgress} className="h-2" />
                                <div className="flex items-center justify-between text-sm">
                                  <div>
                                    <span className="font-semibold" data-testid={`text-funding-current-${opportunity.id}`}>
                                      {(opportunity.fundingCurrent || 0).toLocaleString()} {t('common.currency')}
                                    </span>
                                    <span className="text-muted-foreground"> {t('opportunities.raised')}</span>
                                  </div>
                                  <div className="text-muted-foreground">
                                    <span className="font-semibold" data-testid={`text-funding-goal-${opportunity.id}`}>
                                      {opportunity.fundingGoal.toLocaleString()} {t('common.currency')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-1">
                              {opportunity.sdgGoals.slice(0, 5).map(sdgId => {
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

                            <div className="flex gap-2">
                              <Link href={`/projects/${opportunity.id}`} className="flex-1">
                                <Button variant="outline" className="w-full" data-testid={`button-view-details-${opportunity.id}`}>
                                  {t('common.viewAll')}
                                </Button>
                              </Link>
                              <Button className="flex-1" data-testid={`button-learn-more-${opportunity.id}`}>
                                {t('opportunities.learnMore')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {!isLoading && filteredOpportunities.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">{t('opportunities.noResults')}</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedRegion("all");
                  }}
                  data-testid="button-reset-filters"
                >
                  {t('opportunities.resetFilters')}
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
