import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { type Project, type InsertProject, type Organization, type InsertOrganization, type User, type InsertUser, type UpsertUser, type Region, type InsertRegion, type OrganizationType, type InsertOrganizationType, type OrganizationSubtype, type InsertOrganizationSubtype, type Service, type InsertService, type OrganizationSubmission, type InsertOrganizationSubmission, projects, organizations, users, regions, organizationTypesTable, organizationSubtypes, servicesTable, organizationSubmissions } from "@shared/schema";
import type { IStorage } from "./storage";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

export class DbStorage implements IStorage {
  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id));
    return result[0];
  }

  async getProjectsByOrganization(organizationId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.organizationId, organizationId));
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const allProjects = await db.select().from(projects).where(eq(projects.status, "Active"));
    return allProjects.slice(0, 6);
  }

  async getInvestmentOpportunities(): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.seekingInvestment, true));
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db.update(projects).set(updates).where(eq(projects.id, id)).returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return await db.select().from(organizations);
  }

  async getOrganizationById(id: string): Promise<Organization | undefined> {
    const result = await db.select().from(organizations).where(eq(organizations.id, id));
    return result[0];
  }

  async createOrganization(insertOrganization: InsertOrganization): Promise<Organization> {
    const result = await db.insert(organizations).values(insertOrganization).returning();
    return result[0];
  }

  async updateOrganization(id: string, updates: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const result = await db.update(organizations).set(updates).where(eq(organizations.id, id)).returning();
    return result[0];
  }

  async deleteOrganization(id: string): Promise<boolean> {
    const result = await db.delete(organizations).where(eq(organizations.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await db.select().from(users).where(eq(users.email, normalizedEmail));
    return result[0];
  }

  async createUser(user: Omit<InsertUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  async getStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    totalFunding: number;
    organizations: number;
  }> {
    const allProjects = await this.getAllProjects();
    const allOrgs = await this.getAllOrganizations();
    
    const activeProjects = allProjects.filter(p => p.status === "Active").length;
    const totalFunding = allProjects.reduce((sum, p) => sum + (p.fundingCurrent || 0), 0);

    return {
      totalProjects: allProjects.length,
      activeProjects,
      totalFunding,
      organizations: allOrgs.length,
    };
  }

  async getAllRegions(): Promise<Region[]> {
    return await db.select().from(regions);
  }

  async getRegionById(id: string): Promise<Region | undefined> {
    const result = await db.select().from(regions).where(eq(regions.id, id));
    return result[0];
  }

  async createRegion(insertRegion: InsertRegion): Promise<Region> {
    const result = await db.insert(regions).values(insertRegion).returning();
    return result[0];
  }

  async updateRegion(id: string, updates: Partial<InsertRegion>): Promise<Region | undefined> {
    const result = await db.update(regions).set(updates).where(eq(regions.id, id)).returning();
    return result[0];
  }

  async deleteRegion(id: string): Promise<boolean> {
    const result = await db.delete(regions).where(eq(regions.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAllOrganizationTypes(): Promise<OrganizationType[]> {
    return await db.select().from(organizationTypesTable);
  }

  async getOrganizationTypeById(id: string): Promise<OrganizationType | undefined> {
    const result = await db.select().from(organizationTypesTable).where(eq(organizationTypesTable.id, id));
    return result[0];
  }

  async createOrganizationType(insertType: InsertOrganizationType): Promise<OrganizationType> {
    const result = await db.insert(organizationTypesTable).values(insertType).returning();
    return result[0];
  }

  async updateOrganizationType(id: string, updates: Partial<InsertOrganizationType>): Promise<OrganizationType | undefined> {
    const result = await db.update(organizationTypesTable).set(updates).where(eq(organizationTypesTable.id, id)).returning();
    return result[0];
  }

  async deleteOrganizationType(id: string): Promise<boolean> {
    const result = await db.delete(organizationTypesTable).where(eq(organizationTypesTable.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAllOrganizationSubtypes(): Promise<OrganizationSubtype[]> {
    return await db.select().from(organizationSubtypes);
  }

  async getOrganizationSubtypeById(id: string): Promise<OrganizationSubtype | undefined> {
    const result = await db.select().from(organizationSubtypes).where(eq(organizationSubtypes.id, id));
    return result[0];
  }

  async createOrganizationSubtype(insertSubtype: InsertOrganizationSubtype): Promise<OrganizationSubtype> {
    const result = await db.insert(organizationSubtypes).values(insertSubtype).returning();
    return result[0];
  }

  async updateOrganizationSubtype(id: string, updates: Partial<InsertOrganizationSubtype>): Promise<OrganizationSubtype | undefined> {
    const result = await db.update(organizationSubtypes).set(updates).where(eq(organizationSubtypes.id, id)).returning();
    return result[0];
  }

  async deleteOrganizationSubtype(id: string): Promise<boolean> {
    const result = await db.delete(organizationSubtypes).where(eq(organizationSubtypes.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAllServices(): Promise<Service[]> {
    return await db.select().from(servicesTable);
  }

  async getServiceById(id: string): Promise<Service | undefined> {
    const result = await db.select().from(servicesTable).where(eq(servicesTable.id, id));
    return result[0];
  }

  async createService(insertService: InsertService): Promise<Service> {
    const result = await db.insert(servicesTable).values(insertService).returning();
    return result[0];
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service | undefined> {
    const result = await db.update(servicesTable).set(updates).where(eq(servicesTable.id, id)).returning();
    return result[0];
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(servicesTable).where(eq(servicesTable.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getAllSubmissions(): Promise<OrganizationSubmission[]> {
    return await db.select().from(organizationSubmissions);
  }

  async getSubmissionById(id: string): Promise<OrganizationSubmission | undefined> {
    const result = await db.select().from(organizationSubmissions).where(eq(organizationSubmissions.id, id));
    return result[0];
  }

  async getSubmissionsByUser(userId: string): Promise<OrganizationSubmission[]> {
    return await db.select().from(organizationSubmissions).where(eq(organizationSubmissions.submittedBy, userId));
  }

  async getPendingSubmissions(): Promise<OrganizationSubmission[]> {
    return await db.select().from(organizationSubmissions).where(eq(organizationSubmissions.status, "pending"));
  }

  async createSubmission(insertSubmission: CreateSubmission): Promise<OrganizationSubmission> {
    const result = await db.insert(organizationSubmissions).values({
      ...insertSubmission,
      submittedAt: insertSubmission.submittedAt ?? new Date(),
    }).returning();
    return result[0];
  }

  async approveSubmission(id: string, reviewerId: string): Promise<Organization | undefined> {
    const submission = await this.getSubmissionById(id);
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

    await db
      .update(organizationSubmissions)
      .set({
        status: "approved",
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      })
      .where(eq(organizationSubmissions.id, id));

    return organization;
  }

  async rejectSubmission(id: string, reviewerId: string, reason: string): Promise<OrganizationSubmission | undefined> {
    const result = await db
      .update(organizationSubmissions)
      .set({
        status: "rejected",
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        rejectionReason: reason,
      })
      .where(eq(organizationSubmissions.id, id))
      .returning();
    
    return result[0];
  }
}
