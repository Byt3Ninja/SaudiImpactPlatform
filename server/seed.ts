import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { projects, organizations, type InsertProject, type InsertOrganization } from "@shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log("Seeding database...");

  const sampleOrgs: InsertOrganization[] = [
    {
      name: "Saudi Green Initiative",
      type: "Government Entity",
      description: "Leading Saudi Arabia's efforts in environmental sustainability and climate action through innovative programs and partnerships.",
      region: "Riyadh",
      website: "https://example.com",
      contactEmail: "contact@sgi.gov.sa",
    },
    {
      name: "Vision 2030 Foundation",
      type: "Government Entity",
      description: "Driving economic diversification and social transformation aligned with Saudi Vision 2030 objectives.",
      region: "Riyadh",
      website: "https://example.com",
      contactEmail: "info@vision2030.sa",
    },
    {
      name: "Community Development NGO",
      type: "NGO",
      description: "Empowering local communities through education, healthcare access, and economic opportunity programs.",
      region: "Jeddah",
      contactEmail: "hello@cdngo.org",
    },
    {
      name: "Clean Energy Research Institute",
      type: "Research Institution",
      description: "Advancing renewable energy technologies and sustainable solutions for Saudi Arabia's energy sector.",
      region: "Eastern Province",
      website: "https://example.com",
      contactEmail: "research@ceri.edu.sa",
    },
  ];

  console.log("Creating organizations...");
  const createdOrgs = await db.insert(organizations).values(sampleOrgs).returning();
  const orgIds = createdOrgs.map(org => org.id);
  console.log(`Created ${orgIds.length} organizations`);

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

  console.log("Creating projects...");
  const createdProjects = await db.insert(projects).values(sampleProjects).returning();
  console.log(`Created ${createdProjects.length} projects`);

  console.log("Database seeding complete!");
  await pool.end();
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
