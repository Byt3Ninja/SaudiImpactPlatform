import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { type Project, type InsertProject, type Organization, type InsertOrganization, projects, organizations } from "@shared/schema";
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
}
