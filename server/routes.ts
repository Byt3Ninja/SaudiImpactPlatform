import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertOrganizationSchema, insertRegionSchema, insertOrganizationTypeSchema, insertOrganizationSubtypeSchema, insertServiceSchema, insertOrganizationSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";

declare module "express-session" {
  interface SessionData {
    adminAuthenticated?: boolean;
  }
}

const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.adminAuthenticated) {
    return res.status(401).json({ error: "Unauthorized: Not logged in" });
  }
  
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  app.get("/api/projects", async (req, res) => {
    try {
      const { organizationId } = req.query;
      
      let projects;
      if (organizationId && typeof organizationId === "string") {
        projects = await storage.getProjectsByOrganization(organizationId);
      } else {
        projects = await storage.getAllProjects();
      }
      
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/featured", async (_req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProjectById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/admin/auth", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminPassword) {
        return res.status(500).json({ error: "Server configuration error" });
      }
      
      if (password === adminPassword) {
        req.session.adminAuthenticated = true;
        res.json({ success: true });
      } else {
        res.status(401).json({ error: "Invalid password", success: false });
      }
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ error: "Logout failed" });
        }
        res.clearCookie('connect.sid', {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        res.json({ success: true });
      });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  });

  app.get("/api/admin/session", async (req, res) => {
    try {
      const isAuthenticated = !!req.session?.adminAuthenticated;
      res.json({ authenticated: isAuthenticated });
    } catch (error) {
      res.status(500).json({ error: "Session check failed" });
    }
  });

  app.post("/api/projects", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.patch("/api/projects/:id", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(req.params.id, validatedData);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid project data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.get("/api/opportunities", async (_req, res) => {
    try {
      const opportunities = await storage.getInvestmentOpportunities();
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch investment opportunities" });
    }
  });

  app.get("/api/organizations", async (_req, res) => {
    try {
      const organizations = await storage.getAllOrganizations();
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  app.get("/api/organizations/:id", async (req, res) => {
    try {
      const organization = await storage.getOrganizationById(req.params.id);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json(organization);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  app.post("/api/organizations", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertOrganizationSchema.parse(req.body);
      const organization = await storage.createOrganization(validatedData);
      res.status(201).json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid organization data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  app.patch("/api/organizations/:id", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertOrganizationSchema.partial().parse(req.body);
      const organization = await storage.updateOrganization(req.params.id, validatedData);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid organization data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update organization" });
    }
  });

  app.delete("/api/organizations/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteOrganization(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Organization not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete organization" });
    }
  });

  app.get("/api/regions", async (_req, res) => {
    try {
      const regions = await storage.getAllRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch regions" });
    }
  });

  app.post("/api/regions", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertRegionSchema.parse(req.body);
      const region = await storage.createRegion(validatedData);
      res.status(201).json(region);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid region data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create region" });
    }
  });

  app.patch("/api/regions/:id", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertRegionSchema.partial().parse(req.body);
      const region = await storage.updateRegion(req.params.id, validatedData);
      if (!region) {
        return res.status(404).json({ error: "Region not found" });
      }
      res.json(region);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid region data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update region" });
    }
  });

  app.delete("/api/regions/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteRegion(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Region not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete region" });
    }
  });

  app.get("/api/organization-types", async (_req, res) => {
    try {
      const types = await storage.getAllOrganizationTypes();
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organization types" });
    }
  });

  app.post("/api/organization-types", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertOrganizationTypeSchema.parse(req.body);
      const type = await storage.createOrganizationType(validatedData);
      res.status(201).json(type);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid organization type data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create organization type" });
    }
  });

  app.patch("/api/organization-types/:id", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertOrganizationTypeSchema.partial().parse(req.body);
      const type = await storage.updateOrganizationType(req.params.id, validatedData);
      if (!type) {
        return res.status(404).json({ error: "Organization type not found" });
      }
      res.json(type);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid organization type data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update organization type" });
    }
  });

  app.delete("/api/organization-types/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteOrganizationType(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Organization type not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete organization type" });
    }
  });

  app.get("/api/organization-subtypes", async (_req, res) => {
    try {
      const subtypes = await storage.getAllOrganizationSubtypes();
      res.json(subtypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organization subtypes" });
    }
  });

  app.post("/api/organization-subtypes", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertOrganizationSubtypeSchema.parse(req.body);
      const subtype = await storage.createOrganizationSubtype(validatedData);
      res.status(201).json(subtype);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid organization subtype data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create organization subtype" });
    }
  });

  app.patch("/api/organization-subtypes/:id", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertOrganizationSubtypeSchema.partial().parse(req.body);
      const subtype = await storage.updateOrganizationSubtype(req.params.id, validatedData);
      if (!subtype) {
        return res.status(404).json({ error: "Organization subtype not found" });
      }
      res.json(subtype);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid organization subtype data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update organization subtype" });
    }
  });

  app.delete("/api/organization-subtypes/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteOrganizationSubtype(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Organization subtype not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete organization subtype" });
    }
  });

  app.get("/api/services", async (_req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/services", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid service data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.patch("/api/services/:id", requireAdminAuth, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, validatedData);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid service data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/services/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteService(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  app.get("/api/submissions/my", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const submissions = await storage.getSubmissionsByUser(userId);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.post("/api/submissions", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertOrganizationSubmissionSchema.parse(req.body);
      const submission = await storage.createSubmission({
        ...validatedData,
        submittedBy: (req.user as any).claims.sub,
      });
      res.status(201).json(submission);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid submission data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create submission" });
    }
  });

  app.get("/api/submissions", requireAdminAuth, async (_req, res) => {
    try {
      const submissions = await storage.getAllSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  app.get("/api/submissions/pending", requireAdminAuth, async (_req, res) => {
    try {
      const submissions = await storage.getPendingSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending submissions" });
    }
  });

  app.get("/api/submissions/:id", requireAdminAuth, async (req, res) => {
    try {
      const submission = await storage.getSubmissionById(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  });

  app.post("/api/submissions/:id/approve", requireAdminAuth, async (req: any, res) => {
    try {
      const reviewerId = req.session?.adminAuthenticated ? "admin" : req.user?.claims?.sub || "unknown";
      const organization = await storage.approveSubmission(req.params.id, reviewerId);
      if (!organization) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(organization);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve submission" });
    }
  });

  app.post("/api/submissions/:id/reject", requireAdminAuth, async (req: any, res) => {
    try {
      const { reason } = req.body;
      if (!reason || typeof reason !== "string") {
        return res.status(400).json({ error: "Rejection reason is required" });
      }
      const reviewerId = req.session?.adminAuthenticated ? "admin" : req.user?.claims?.sub || "unknown";
      const submission = await storage.rejectSubmission(req.params.id, reviewerId, reason);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject submission" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
