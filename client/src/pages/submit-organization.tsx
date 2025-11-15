import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Building2, Send, LogIn, CheckCircle } from 'lucide-react';
import type { Region, OrganizationType, OrganizationSubtype, Service } from '@shared/schema';
import { sdgGoalsData } from '@shared/schema';

const sectorOptions = [
  'Environmental Sustainability',
  'Healthcare',
  'Education',
  'Economic Development',
  'Social Services',
  'Technology & Innovation',
  'Infrastructure',
  'Agriculture',
  'Energy',
  'Water & Sanitation',
];

export default function SubmitOrganization() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    type: '',
    subType: '',
    description: '',
    descriptionAr: '',
    region: '',
    website: '',
    linkedinUrl: '',
    contactEmail: '',
    sectorFocus: [] as string[],
    sdgFocus: [] as string[],
    services: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: regions = [], isLoading: regionsLoading } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
  });

  const { data: types = [], isLoading: typesLoading } = useQuery<OrganizationType[]>({
    queryKey: ['/api/organization-types'],
  });

  const { data: subtypes = [], isLoading: subtypesLoading } = useQuery<OrganizationSubtype[]>({
    queryKey: ['/api/organization-subtypes'],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const submitMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      apiRequest('POST', '/api/submissions', data),
    onSuccess: () => {
      toast({
        title: 'Submission successful',
        description: 'Your organization has been submitted for review.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      setLocation('/my-submissions');
    },
    onError: (error: Error) => {
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Organization type is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.region) {
      newErrors.region = 'Region is required';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid URL';
    }

    if (formData.contactEmail && !isValidEmail(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    const submissionData: any = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      region: formData.region,
    };

    if (formData.nameAr) submissionData.nameAr = formData.nameAr;
    if (formData.subType) submissionData.subType = formData.subType;
    if (formData.descriptionAr) submissionData.descriptionAr = formData.descriptionAr;
    if (formData.website) submissionData.website = formData.website;
    if (formData.linkedinUrl) submissionData.linkedinUrl = formData.linkedinUrl;
    if (formData.contactEmail) submissionData.contactEmail = formData.contactEmail;
    if (formData.sectorFocus.length > 0) submissionData.sectorFocus = formData.sectorFocus;
    if (formData.sdgFocus.length > 0) submissionData.sdgFocus = formData.sdgFocus;
    if (formData.services.length > 0) submissionData.services = formData.services;

    submitMutation.mutate(submissionData);
  };

  const toggleArrayField = (field: 'sectorFocus' | 'sdgFocus' | 'services', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to submit your organization for approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => (window.location.href = '/api/login')}
                className="w-full"
                data-testid="button-login"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Log In with Replit
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isLoading = regionsLoading || typesLoading || subtypesLoading || servicesLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4" data-testid="heading-submit">
            Submit Your Organization
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Join the Saudi Impact Platform by submitting your organization for approval.
            Our team will review your submission and notify you of the decision.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Please provide accurate information about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Organization Name (English) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter organization name"
                      data-testid="input-name"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameAr">Organization Name (Arabic)</Label>
                    <Input
                      id="nameAr"
                      value={formData.nameAr}
                      onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                      placeholder="اسم المنظمة"
                      data-testid="input-name-ar"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">
                      Organization Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger id="type" data-testid="select-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.filter(t => t.isActive).map((type) => (
                          <SelectItem key={type.id} value={type.name}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subType">Organization Subtype</Label>
                    <Select value={formData.subType} onValueChange={(value) => setFormData({ ...formData, subType: value })}>
                      <SelectTrigger id="subType" data-testid="select-subtype">
                        <SelectValue placeholder="Select subtype (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {subtypes.filter(s => s.isActive).map((subtype) => (
                          <SelectItem key={subtype.id} value={subtype.name}>
                            {subtype.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description (English) <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your organization's mission and activities"
                    rows={4}
                    data-testid="textarea-description"
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                  <Textarea
                    id="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    placeholder="وصف المنظمة"
                    rows={4}
                    data-testid="textarea-description-ar"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">
                    Region <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                    <SelectTrigger id="region" data-testid="select-region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.filter(r => r.isActive).map((region) => (
                        <SelectItem key={region.id} value={region.name}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-sm text-destructive">{errors.region}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                      data-testid="input-website"
                    />
                    {errors.website && (
                      <p className="text-sm text-destructive">{errors.website}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/company/..."
                      data-testid="input-linkedin"
                    />
                    {errors.linkedinUrl && (
                      <p className="text-sm text-destructive">{errors.linkedinUrl}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="contact@example.com"
                    data-testid="input-email"
                  />
                  {errors.contactEmail && (
                    <p className="text-sm text-destructive">{errors.contactEmail}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Sector Focus</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {sectorOptions.map((sector) => (
                      <div key={sector} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sector-${sector}`}
                          checked={formData.sectorFocus.includes(sector)}
                          onCheckedChange={() => toggleArrayField('sectorFocus', sector)}
                          data-testid={`checkbox-sector-${sector.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <Label
                          htmlFor={`sector-${sector}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {sector}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>SDG Focus (Sustainable Development Goals)</Label>
                  <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 border rounded-md">
                    {sdgGoalsData.map((sdg) => (
                      <div key={sdg.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sdg-${sdg.id}`}
                          checked={formData.sdgFocus.includes(String(sdg.id))}
                          onCheckedChange={() => toggleArrayField('sdgFocus', String(sdg.id))}
                          data-testid={`checkbox-sdg-${sdg.id}`}
                        />
                        <Label
                          htmlFor={`sdg-${sdg.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {sdg.id}. {sdg.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Services Offered</Label>
                  <div className="grid md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 border rounded-md">
                    {services.filter(s => s.isActive).map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={formData.services.includes(service.name)}
                          onCheckedChange={() => toggleArrayField('services', service.name)}
                          data-testid={`checkbox-service-${service.name.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <Label
                          htmlFor={`service-${service.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {service.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending || isLoading}
                    className="flex-1"
                    data-testid="button-submit"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit for Review
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
