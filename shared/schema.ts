import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleAr: text("title_ar"),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  category: text("category").notNull(),
  status: text("status").notNull(),
  region: text("region").notNull(),
  organizationId: varchar("organization_id").notNull(),
  imageUrl: text("image_url"),
  fundingGoal: real("funding_goal"),
  fundingCurrent: real("funding_current").default(0),
  sdgGoals: text("sdg_goals").array().notNull(),
  impactMetrics: text("impact_metrics").notNull(),
  impactMetricsAr: text("impact_metrics_ar"),
  seekingInvestment: boolean("seeking_investment").default(false),
  latitude: real("latitude"),
  longitude: real("longitude"),
  createdBy: varchar("created_by"),
});

export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  type: text("type").notNull(),
  subType: text("sub_type"),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  logoUrl: text("logo_url"),
  website: text("website"),
  linkedinUrl: text("linkedin_url"),
  contactEmail: text("contact_email"),
  region: text("region").notNull(),
  sectorFocus: text("sector_focus").array(),
  sdgFocus: text("sdg_focus").array(),
  services: text("services").array(),
  status: text("status"),
});

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  organizationId: varchar("organization_id"),
  role: varchar("role").notNull().default('user'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const regions = pgTable("regions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  nameAr: text("name_ar"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const organizationTypesTable = pgTable("organization_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  nameAr: text("name_ar"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const organizationSubtypes = pgTable("organization_subtypes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  nameAr: text("name_ar"),
  typeId: varchar("type_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const servicesTable = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  nameAr: text("name_ar"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const organizationSubmissions = pgTable("organization_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  submittedBy: varchar("submitted_by").notNull().references(() => users.id),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  type: text("type").notNull(),
  subType: text("sub_type"),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  logoUrl: text("logo_url"),
  website: text("website"),
  linkedinUrl: text("linkedin_url"),
  contactEmail: text("contact_email"),
  region: text("region").notNull(),
  sectorFocus: text("sector_focus").array(),
  sdgFocus: text("sdg_focus").array(),
  services: text("services").array(),
  status: text("status").notNull().default("pending"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"),
  rejectionReason: text("rejection_reason"),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdBy: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const registerUserSchema = z.object({
  email: z.string().email('Invalid email address').transform(v => v.trim().toLowerCase()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').transform(v => v.trim()),
  lastName: z.string().min(1, 'Last name is required').transform(v => v.trim()),
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email address').transform(v => v.trim().toLowerCase()),
  password: z.string().min(1, 'Password is required'),
});

export const insertRegionSchema = createInsertSchema(regions).omit({
  id: true,
  createdAt: true,
});

export const insertOrganizationTypeSchema = createInsertSchema(organizationTypesTable).omit({
  id: true,
  createdAt: true,
});

export const insertOrganizationSubtypeSchema = createInsertSchema(organizationSubtypes).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({
  id: true,
  createdAt: true,
});

export const insertOrganizationSubmissionSchema = createInsertSchema(organizationSubmissions).omit({
  id: true,
  submittedBy: true,
  submittedAt: true,
  reviewedAt: true,
  reviewedBy: true,
  rejectionReason: true,
  status: true,
});

export const createSubmissionSchema = insertOrganizationSubmissionSchema.extend({
  submittedBy: z.string(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  submittedAt: z.date().optional(),
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type Region = typeof regions.$inferSelect;
export type InsertOrganizationType = z.infer<typeof insertOrganizationTypeSchema>;
export type OrganizationType = typeof organizationTypesTable.$inferSelect;
export type InsertOrganizationSubtype = z.infer<typeof insertOrganizationSubtypeSchema>;
export type OrganizationSubtype = typeof organizationSubtypes.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
export type InsertOrganizationSubmission = z.infer<typeof insertOrganizationSubmissionSchema>;
export type CreateSubmission = z.infer<typeof createSubmissionSchema>;
export type OrganizationSubmission = typeof organizationSubmissions.$inferSelect;

export const sdgGoalsData = [
  { id: 1, name: "No Poverty", color: "#E5243B" },
  { id: 2, name: "Zero Hunger", color: "#DDA63A" },
  { id: 3, name: "Good Health and Well-being", color: "#4C9F38" },
  { id: 4, name: "Quality Education", color: "#C5192D" },
  { id: 5, name: "Gender Equality", color: "#FF3A21" },
  { id: 6, name: "Clean Water and Sanitation", color: "#26BDE2" },
  { id: 7, name: "Affordable and Clean Energy", color: "#FCC30B" },
  { id: 8, name: "Decent Work and Economic Growth", color: "#A21942" },
  { id: 9, name: "Industry, Innovation and Infrastructure", color: "#FD6925" },
  { id: 10, name: "Reduced Inequalities", color: "#DD1367" },
  { id: 11, name: "Sustainable Cities and Communities", color: "#FD9D24" },
  { id: 12, name: "Responsible Consumption and Production", color: "#BF8B2E" },
  { id: 13, name: "Climate Action", color: "#3F7E44" },
  { id: 14, name: "Life Below Water", color: "#0A97D9" },
  { id: 15, name: "Life on Land", color: "#56C02B" },
  { id: 16, name: "Peace, Justice and Strong Institutions", color: "#00689D" },
  { id: 17, name: "Partnerships for the Goals", color: "#19486A" },
];

export const saudiRegions = [
  "Riyadh",
  "Makkah",
  "Madinah",
  "Eastern Province",
  "Asir",
  "Tabuk",
  "Qassim",
  "Ha'il",
  "Northern Borders",
  "Jazan",
  "Najran",
  "Al Bahah",
  "Al Jawf",
];

export const projectCategories = [
  "Environmental",
  "Social",
  "Infrastructure",
  "Healthcare",
  "Education",
  "Economic Development",
  "Technology & Innovation",
];

export const projectStatuses = [
  "Planning",
  "Active",
  "Completed",
  "On Hold",
];

export const organizationTypes = [
  "Capital Provider",
  "Ecosystem Builder",
  "Government Entity",
  "NGO",
  "Private Sector",
  "Research Institution",
  "International Organization",
];
