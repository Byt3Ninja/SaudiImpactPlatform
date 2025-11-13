import { type Project, type InsertProject, type Organization, type InsertOrganization, type User, type UpsertUser } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private organizations: Map<string, Organization>;

  constructor() {
    this.projects = new Map();
    this.organizations = new Map();
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
}

import { DbStorage } from "./db-storage";

export const storage: IStorage = new DbStorage();
