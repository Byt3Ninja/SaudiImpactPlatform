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
});

export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameAr: text("name_ar"),
  type: text("type").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar"),
  logoUrl: text("logo_url"),
  website: text("website"),
  contactEmail: text("contact_email"),
  region: text("region").notNull(),
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
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  organizationId: varchar("organization_id"),
  role: varchar("role").notNull().default('organization'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

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
  "Government Entity",
  "NGO",
  "Private Sector",
  "Research Institution",
  "International Organization",
];
