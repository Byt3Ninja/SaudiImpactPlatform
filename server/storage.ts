import { type Project, type InsertProject, type Organization, type InsertOrganization, type User, type UpsertUser, type Region, type InsertRegion, type OrganizationType, type InsertOrganizationType, type OrganizationSubtype, type InsertOrganizationSubtype, type Service, type InsertService, type OrganizationSubmission, type InsertOrganizationSubmission } from "@shared/schema";
import { randomUUID } from "crypto";
import { loadOrganizationsFromJSON } from "./transform-data";

function normalizeInsertOrganization(insert: InsertOrganization, id: string): Organization {
  return {
    id,
    name: insert.name,
    nameAr: insert.nameAr ?? null,
    type: insert.type,
    subType: insert.subType ?? null,
    description: insert.description,
    descriptionAr: insert.descriptionAr ?? null,
    logoUrl: insert.logoUrl ?? null,
    website: insert.website ?? null,
    linkedinUrl: insert.linkedinUrl ?? null,
    contactEmail: insert.contactEmail ?? null,
    region: insert.region,
    sectorFocus: insert.sectorFocus ?? null,
    sdgFocus: insert.sdgFocus ?? null,
    services: insert.services ?? null,
    status: insert.status ?? null,
  };
}

function normalizeInsertProject(insert: InsertProject, id: string): Project {
  return {
    id,
    title: insert.title,
    titleAr: insert.titleAr ?? null,
    description: insert.description,
    descriptionAr: insert.descriptionAr ?? null,
    category: insert.category,
    status: insert.status,
    region: insert.region,
    organizationId: insert.organizationId,
    imageUrl: insert.imageUrl ?? null,
    fundingGoal: insert.fundingGoal ?? null,
    fundingCurrent: insert.fundingCurrent ?? 0,
    sdgGoals: insert.sdgGoals,
    impactMetrics: insert.impactMetrics,
    impactMetricsAr: insert.impactMetricsAr ?? null,
    seekingInvestment: insert.seekingInvestment ?? false,
    latitude: insert.latitude ?? null,
    longitude: insert.longitude ?? null,
  };
}

export interface IStorage {
  getAllProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  getProjectsByOrganization(organizationId: string): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getInvestmentOpportunities(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  getAllOrganizations(): Promise<Organization[]>;
  getOrganizationById(id: string): Promise<Organization | undefined>;
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, organization: Partial<InsertOrganization>): Promise<Organization | undefined>;
  deleteOrganization(id: string): Promise<boolean>;
  
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalFunding: number;
    organizations: number;
  }>;
  
  getAllRegions(): Promise<Region[]>;
  getRegionById(id: string): Promise<Region | undefined>;
  createRegion(region: InsertRegion): Promise<Region>;
  updateRegion(id: string, region: Partial<InsertRegion>): Promise<Region | undefined>;
  deleteRegion(id: string): Promise<boolean>;
  
  getAllOrganizationTypes(): Promise<OrganizationType[]>;
  getOrganizationTypeById(id: string): Promise<OrganizationType | undefined>;
  createOrganizationType(type: InsertOrganizationType): Promise<OrganizationType>;
  updateOrganizationType(id: string, type: Partial<InsertOrganizationType>): Promise<OrganizationType | undefined>;
  deleteOrganizationType(id: string): Promise<boolean>;
  
  getAllOrganizationSubtypes(): Promise<OrganizationSubtype[]>;
  getOrganizationSubtypeById(id: string): Promise<OrganizationSubtype | undefined>;
  createOrganizationSubtype(subtype: InsertOrganizationSubtype): Promise<OrganizationSubtype>;
  updateOrganizationSubtype(id: string, subtype: Partial<InsertOrganizationSubtype>): Promise<OrganizationSubtype | undefined>;
  deleteOrganizationSubtype(id: string): Promise<boolean>;
  
  getAllServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  
  getAllSubmissions(): Promise<OrganizationSubmission[]>;
  getSubmissionById(id: string): Promise<OrganizationSubmission | undefined>;
  getSubmissionsByUser(userId: string): Promise<OrganizationSubmission[]>;
  getPendingSubmissions(): Promise<OrganizationSubmission[]>;
  createSubmission(submission: InsertOrganizationSubmission): Promise<OrganizationSubmission>;
  approveSubmission(id: string, reviewerId: string): Promise<Organization | undefined>;
  rejectSubmission(id: string, reviewerId: string, reason: string): Promise<OrganizationSubmission | undefined>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private organizations: Map<string, Organization>;
  private regions: Map<string, Region>;
  private organizationTypes: Map<string, OrganizationType>;
  private organizationSubtypes: Map<string, OrganizationSubtype>;
  private services: Map<string, Service>;
  private submissions: Map<string, OrganizationSubmission>;

  constructor() {
    this.projects = new Map();
    this.organizations = new Map();
    this.regions = new Map();
    this.organizationTypes = new Map();
    this.organizationSubtypes = new Map();
    this.services = new Map();
    this.submissions = new Map();
    this.seedData();
  }

  private seedData() {
    const realOrgs = loadOrganizationsFromJSON();

    realOrgs.forEach(org => {
      const id = randomUUID();
      this.organizations.set(id, normalizeInsertOrganization(org, id));
    });

    const orgIds = Array.from(this.organizations.keys());

    const sampleProjects: InsertProject[] = [
      {
        title: "NEOM Renewable Energy Complex",
        description: "Massive solar and wind energy installation powering the sustainable city of NEOM with 100% renewable energy. This flagship project demonstrates Saudi Arabia's commitment to clean energy transition.",
        category: "Environmental",
        status: "Active",
        region: "Tabuk",
        organizationId: orgIds[0],
        imageUrl: "/attached_assets/generated_images/Saudi_renewable_energy_project_7646abb9.png",
        fundingGoal: 25000000,
        fundingCurrent: 18500000,
        sdgGoals: ["7", "9", "13"],
        impactMetrics: "Expected to generate 4GW of clean energy, reducing carbon emissions by 6 million tons annually",
        seekingInvestment: true,
        latitude: 27.9625,
        longitude: 35.3025,
      },
      {
        title: "Rural Community Healthcare Access",
        description: "Establishing mobile health clinics and telemedicine infrastructure to serve remote communities across Saudi Arabia, ensuring quality healthcare access for all citizens.",
        category: "Healthcare",
        status: "Active",
        region: "Asir",
        organizationId: orgIds[2],
        imageUrl: "/attached_assets/generated_images/Healthcare_innovation_center_2324ab60.png",
        fundingGoal: 5000000,
        fundingCurrent: 3200000,
        sdgGoals: ["3", "10"],
        impactMetrics: "Serving 50,000+ residents in 25 remote villages with comprehensive healthcare services",
        seekingInvestment: true,
        latitude: 18.2164,
        longitude: 42.5053,
      },
      {
        title: "Advanced Water Conservation System",
        description: "Implementing cutting-edge water recycling and conservation technology to address water scarcity challenges in arid regions.",
        category: "Infrastructure",
        status: "Active",
        region: "Riyadh",
        organizationId: orgIds[3],
        imageUrl: "/attached_assets/generated_images/Water_conservation_infrastructure_b03224d6.png",
        fundingGoal: 15000000,
        fundingCurrent: 8900000,
        sdgGoals: ["6", "9", "11"],
        impactMetrics: "Conserving 50 million liters of water annually, serving 200,000 residents",
        seekingInvestment: true,
        latitude: 24.7136,
        longitude: 46.6753,
      },
      {
        title: "Sustainable Urban Development Initiative",
        description: "Transforming urban spaces with green architecture, vertical gardens, and eco-friendly infrastructure for livable cities.",
        category: "Infrastructure",
        status: "Planning",
        region: "Jeddah",
        organizationId: orgIds[1],
        imageUrl: "/attached_assets/generated_images/Sustainable_urban_development_348acf6b.png",
        fundingGoal: 45000000,
        fundingCurrent: 12000000,
        sdgGoals: ["11", "13", "15"],
        impactMetrics: "Creating 500 hectares of green urban spaces, improving quality of life for 1 million residents",
        seekingInvestment: true,
        latitude: 21.4858,
        longitude: 39.1925,
      },
      {
        title: "Digital Learning Innovation Program",
        description: "Revolutionizing education through technology integration, providing students with modern digital learning tools and interactive platforms.",
        category: "Education",
        status: "Active",
        region: "Riyadh",
        organizationId: orgIds[1],
        imageUrl: "/attached_assets/generated_images/Education_technology_project_d17c00de.png",
        fundingGoal: 8000000,
        fundingCurrent: 8000000,
        sdgGoals: ["4", "9"],
        impactMetrics: "Reaching 100,000 students across 200 schools with enhanced digital learning capabilities",
        seekingInvestment: false,
        latitude: 24.7136,
        longitude: 46.6753,
      },
      {
        title: "Youth Entrepreneurship Hub",
        description: "Creating opportunities for young entrepreneurs through mentorship, funding, and business development support programs.",
        category: "Economic Development",
        status: "Active",
        region: "Riyadh",
        organizationId: orgIds[2],
        imageUrl: "/attached_assets/generated_images/Community_development_collaboration_3975c5a9.png",
        fundingGoal: 3000000,
        fundingCurrent: 2100000,
        sdgGoals: ["8", "9", "10"],
        impactMetrics: "Supporting 500+ startups, creating 2,000+ jobs for Saudi youth",
        seekingInvestment: true,
        latitude: 24.7136,
        longitude: 46.6753,
      },
      {
        title: "Coastal Ecosystem Restoration",
        description: "Protecting and restoring Red Sea coastal ecosystems, including mangrove forests and coral reefs, to preserve marine biodiversity.",
        category: "Environmental",
        status: "Active",
        region: "Jeddah",
        organizationId: orgIds[0],
        fundingGoal: 6000000,
        fundingCurrent: 4500000,
        sdgGoals: ["14", "15"],
        impactMetrics: "Restoring 100km of coastline, protecting 50+ marine species",
        seekingInvestment: true,
        latitude: 21.4858,
        longitude: 39.1925,
      },
      {
        title: "Smart Agriculture Initiative",
        description: "Implementing IoT and AI technologies for precision farming to optimize water usage and increase agricultural productivity.",
        category: "Technology & Innovation",
        status: "Planning",
        region: "Qassim",
        organizationId: orgIds[3],
        fundingGoal: 10000000,
        fundingCurrent: 3500000,
        sdgGoals: ["2", "9", "12"],
        impactMetrics: "Improving yields by 40% while reducing water consumption by 50% across 10,000 hectares",
        seekingInvestment: true,
        latitude: 26.3260,
        longitude: 43.9750,
      },
    ];

    sampleProjects.forEach(project => {
      const id = randomUUID();
      this.projects.set(id, normalizeInsertProject(project, id));
    });
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByOrganization(organizationId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      project => project.organizationId === organizationId
    );
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(p => p.status === "Active")
      .slice(0, 6);
  }

  async getInvestmentOpportunities(): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      project => project.seekingInvestment === true
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = normalizeInsertProject(insertProject, id);
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return Array.from(this.organizations.values());
  }

  async getOrganizationById(id: string): Promise<Organization | undefined> {
    return this.organizations.get(id);
  }

  async createOrganization(insertOrganization: InsertOrganization): Promise<Organization> {
    const id = randomUUID();
    const organization: Organization = normalizeInsertOrganization(insertOrganization, id);
    this.organizations.set(id, organization);
    return organization;
  }

  async updateOrganization(id: string, updates: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const organization = this.organizations.get(id);
    if (!organization) return undefined;
    
    const updatedOrganization = { ...organization, ...updates };
    this.organizations.set(id, updatedOrganization);
    return updatedOrganization;
  }

  async deleteOrganization(id: string): Promise<boolean> {
    return this.organizations.delete(id);
  }

  async getStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalFunding: number;
    organizations: number;
  }> {
    const projects = Array.from(this.projects.values());
    return {
      totalProjects: projects.length,
      activeProjects: projects.filter(p => p.status === "Active").length,
      totalFunding: projects.reduce((sum, p) => sum + (p.fundingCurrent || 0), 0),
      organizations: this.organizations.size,
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const newUser: User = {
      id: user.id || randomUUID(),
      email: user.email || null,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      organizationId: user.organizationId || null,
      role: user.role || 'organization',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newUser;
  }

  async getAllRegions(): Promise<Region[]> {
    return Array.from(this.regions.values());
  }

  async getRegionById(id: string): Promise<Region | undefined> {
    return this.regions.get(id);
  }

  async createRegion(insertRegion: InsertRegion): Promise<Region> {
    const id = randomUUID();
    const region: Region = {
      id,
      name: insertRegion.name,
      nameAr: insertRegion.nameAr ?? null,
      isActive: insertRegion.isActive ?? true,
      createdAt: new Date(),
    };
    this.regions.set(id, region);
    return region;
  }

  async updateRegion(id: string, updates: Partial<InsertRegion>): Promise<Region | undefined> {
    const region = this.regions.get(id);
    if (!region) return undefined;
    
    const updatedRegion = { ...region, ...updates };
    this.regions.set(id, updatedRegion);
    return updatedRegion;
  }

  async deleteRegion(id: string): Promise<boolean> {
    return this.regions.delete(id);
  }

  async getAllOrganizationTypes(): Promise<OrganizationType[]> {
    return Array.from(this.organizationTypes.values());
  }

  async getOrganizationTypeById(id: string): Promise<OrganizationType | undefined> {
    return this.organizationTypes.get(id);
  }

  async createOrganizationType(insertType: InsertOrganizationType): Promise<OrganizationType> {
    const id = randomUUID();
    const orgType: OrganizationType = {
      id,
      name: insertType.name,
      nameAr: insertType.nameAr ?? null,
      isActive: insertType.isActive ?? true,
      createdAt: new Date(),
    };
    this.organizationTypes.set(id, orgType);
    return orgType;
  }

  async updateOrganizationType(id: string, updates: Partial<InsertOrganizationType>): Promise<OrganizationType | undefined> {
    const orgType = this.organizationTypes.get(id);
    if (!orgType) return undefined;
    
    const updatedOrgType = { ...orgType, ...updates };
    this.organizationTypes.set(id, updatedOrgType);
    return updatedOrgType;
  }

  async deleteOrganizationType(id: string): Promise<boolean> {
    return this.organizationTypes.delete(id);
  }

  async getAllOrganizationSubtypes(): Promise<OrganizationSubtype[]> {
    return Array.from(this.organizationSubtypes.values());
  }

  async getOrganizationSubtypeById(id: string): Promise<OrganizationSubtype | undefined> {
    return this.organizationSubtypes.get(id);
  }

  async createOrganizationSubtype(insertSubtype: InsertOrganizationSubtype): Promise<OrganizationSubtype> {
    const id = randomUUID();
    const subtype: OrganizationSubtype = {
      id,
      name: insertSubtype.name,
      nameAr: insertSubtype.nameAr ?? null,
      typeId: insertSubtype.typeId ?? null,
      isActive: insertSubtype.isActive ?? true,
      createdAt: new Date(),
    };
    this.organizationSubtypes.set(id, subtype);
    return subtype;
  }

  async updateOrganizationSubtype(id: string, updates: Partial<InsertOrganizationSubtype>): Promise<OrganizationSubtype | undefined> {
    const subtype = this.organizationSubtypes.get(id);
    if (!subtype) return undefined;
    
    const updatedSubtype = { ...subtype, ...updates };
    this.organizationSubtypes.set(id, updatedSubtype);
    return updatedSubtype;
  }

  async deleteOrganizationSubtype(id: string): Promise<boolean> {
    return this.organizationSubtypes.delete(id);
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = {
      id,
      name: insertService.name,
      nameAr: insertService.nameAr ?? null,
      description: insertService.description ?? null,
      isActive: insertService.isActive ?? true,
      createdAt: new Date(),
    };
    this.services.set(id, service);
    return service;
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...updates };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.services.delete(id);
  }

  async getAllSubmissions(): Promise<OrganizationSubmission[]> {
    return Array.from(this.submissions.values());
  }

  async getSubmissionById(id: string): Promise<OrganizationSubmission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissionsByUser(userId: string): Promise<OrganizationSubmission[]> {
    return Array.from(this.submissions.values()).filter(
      submission => submission.submittedBy === userId
    );
  }

  async getPendingSubmissions(): Promise<OrganizationSubmission[]> {
    return Array.from(this.submissions.values()).filter(
      submission => submission.status === "pending"
    );
  }

  async createSubmission(insertSubmission: InsertOrganizationSubmission): Promise<OrganizationSubmission> {
    const id = randomUUID();
    const submission: OrganizationSubmission = {
      id,
      submittedBy: insertSubmission.submittedBy,
      name: insertSubmission.name,
      nameAr: insertSubmission.nameAr ?? null,
      type: insertSubmission.type,
      subType: insertSubmission.subType ?? null,
      description: insertSubmission.description,
      descriptionAr: insertSubmission.descriptionAr ?? null,
      logoUrl: insertSubmission.logoUrl ?? null,
      website: insertSubmission.website ?? null,
      linkedinUrl: insertSubmission.linkedinUrl ?? null,
      contactEmail: insertSubmission.contactEmail ?? null,
      region: insertSubmission.region,
      sectorFocus: insertSubmission.sectorFocus ?? null,
      sdgFocus: insertSubmission.sdgFocus ?? null,
      services: insertSubmission.services ?? null,
      status: "pending",
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async approveSubmission(id: string, reviewerId: string): Promise<Organization | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;

    const organizationData: InsertOrganization = {
      name: submission.name,
      nameAr: submission.nameAr,
      type: submission.type,
      subType: submission.subType,
      description: submission.description,
      descriptionAr: submission.descriptionAr,
      logoUrl: submission.logoUrl,
      website: submission.website,
      linkedinUrl: submission.linkedinUrl,
      contactEmail: submission.contactEmail,
      region: submission.region,
      sectorFocus: submission.sectorFocus,
      sdgFocus: submission.sdgFocus,
      services: submission.services,
      status: "active",
    };

    const organization = await this.createOrganization(organizationData);

    const updatedSubmission: OrganizationSubmission = {
      ...submission,
      status: "approved",
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
    };
    this.submissions.set(id, updatedSubmission);

    return organization;
  }

  async rejectSubmission(id: string, reviewerId: string, reason: string): Promise<OrganizationSubmission | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;

    const updatedSubmission: OrganizationSubmission = {
      ...submission,
      status: "rejected",
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      rejectionReason: reason,
    };
    this.submissions.set(id, updatedSubmission);

    return updatedSubmission;
  }
}

import { DbStorage } from "./db-storage";

export const storage: IStorage = new DbStorage();
