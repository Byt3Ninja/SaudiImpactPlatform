/**
 * Comprehensive Database Seeding Script
 * Seeds all data: reference data, organizations, and projects
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { 
  regions, 
  organizationTypesTable, 
  organizationSubtypes, 
  servicesTable,
  organizations,
  projects,
  type InsertProject,
  type InsertOrganization
} from "@shared/schema";
import { loadOrganizationsFromJSON } from "./transform-data";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seedAll() {
  console.log("🌱 Starting comprehensive database seed...\n");

  try {
    // ============================================================
    // STEP 1: Seed Reference Data
    // ============================================================
    console.log("📋 STEP 1: Seeding Reference Data");
    console.log("=".repeat(50));

    // Regions
    const saudiRegions = [
      { name: "Riyadh", nameAr: "الرياض", isActive: true },
      { name: "Makkah", nameAr: "مكة المكرمة", isActive: true },
      { name: "Madinah", nameAr: "المدينة المنورة", isActive: true },
      { name: "Eastern Province", nameAr: "المنطقة الشرقية", isActive: true },
      { name: "Asir", nameAr: "عسير", isActive: true },
      { name: "Tabuk", nameAr: "تبوك", isActive: true },
      { name: "Qassim", nameAr: "القصيم", isActive: true },
      { name: "Ha'il", nameAr: "حائل", isActive: true },
      { name: "Northern Borders", nameAr: "الحدود الشمالية", isActive: true },
      { name: "Jazan", nameAr: "جازان", isActive: true },
      { name: "Najran", nameAr: "نجران", isActive: true },
      { name: "Al-Bahah", nameAr: "الباحة", isActive: true },
      { name: "Al-Jouf", nameAr: "الجوف", isActive: true },
    ];

    console.log("   Inserting regions...");
    await db.insert(regions).values(saudiRegions).onConflictDoNothing();
    console.log(`   ✓ Inserted ${saudiRegions.length} regions\n`);

    // Organization Types
    const orgTypes = [
      { name: "Government Entity", nameAr: "جهة حكومية", isActive: true },
      { name: "Non-Profit Organization", nameAr: "منظمة غير ربحية", isActive: true },
      { name: "Private Sector", nameAr: "القطاع الخاص", isActive: true },
      { name: "Social Enterprise", nameAr: "مؤسسة اجتماعية", isActive: true },
      { name: "Foundation", nameAr: "مؤسسة خيرية", isActive: true },
      { name: "Investment Fund", nameAr: "صندوق استثماري", isActive: true },
      { name: "Development Agency", nameAr: "وكالة تنمية", isActive: true },
      { name: "Research Institute", nameAr: "معهد بحثي", isActive: true },
      { name: "Educational Institution", nameAr: "مؤسسة تعليمية", isActive: true },
      { name: "Healthcare Provider", nameAr: "مقدم رعاية صحية", isActive: true },
    ];

    console.log("   Inserting organization types...");
    await db.insert(organizationTypesTable).values(orgTypes).onConflictDoNothing();
    console.log(`   ✓ Inserted ${orgTypes.length} organization types\n`);

    // Organization Subtypes
    const subtypes = [
      { name: "Venture Capital", nameAr: "رأس المال المغامر", isActive: true },
      { name: "Impact Investor", nameAr: "مستثمر التأثير", isActive: true },
      { name: "Accelerator", nameAr: "مسرّع أعمال", isActive: true },
      { name: "Incubator", nameAr: "حاضنة أعمال", isActive: true },
      { name: "Angel Investor Network", nameAr: "شبكة مستثمرين ملائكة", isActive: true },
      { name: "Corporate Foundation", nameAr: "مؤسسة شركات", isActive: true },
      { name: "Community Foundation", nameAr: "مؤسسة مجتمعية", isActive: true },
      { name: "Grant Making Organization", nameAr: "منظمة منح", isActive: true },
      { name: "Microfinance Institution", nameAr: "مؤسسة تمويل أصغر", isActive: true },
      { name: "Development Bank", nameAr: "بنك تنموي", isActive: true },
    ];

    console.log("   Inserting organization subtypes...");
    await db.insert(organizationSubtypes).values(subtypes).onConflictDoNothing();
    console.log(`   ✓ Inserted ${subtypes.length} organization subtypes\n`);

    // Services
    const services = [
      { name: "Funding & Investment", nameAr: "التمويل والاستثمار", isActive: true },
      { name: "Mentorship & Advisory", nameAr: "الإرشاد والاستشارات", isActive: true },
      { name: "Technical Training", nameAr: "التدريب التقني", isActive: true },
      { name: "Market Access Support", nameAr: "دعم الوصول للسوق", isActive: true },
      { name: "Research & Development", nameAr: "البحث والتطوير", isActive: true },
      { name: "Networking Events", nameAr: "فعاليات التواصل", isActive: true },
      { name: "Workspace & Facilities", nameAr: "مساحات العمل والمرافق", isActive: true },
      { name: "Legal & Compliance", nameAr: "الشؤون القانونية والامتثال", isActive: true },
      { name: "Marketing & PR", nameAr: "التسويق والعلاقات العامة", isActive: true },
      { name: "Product Development", nameAr: "تطوير المنتجات", isActive: true },
      { name: "Business Planning", nameAr: "التخطيط التجاري", isActive: true },
      { name: "Financial Management", nameAr: "الإدارة المالية", isActive: true },
      { name: "Technology Infrastructure", nameAr: "البنية التحتية التقنية", isActive: true },
      { name: "Talent Recruitment", nameAr: "توظيف المواهب", isActive: true },
      { name: "Impact Measurement", nameAr: "قياس التأثير", isActive: true },
    ];

    console.log("   Inserting services...");
    await db.insert(servicesTable).values(services).onConflictDoNothing();
    console.log(`   ✓ Inserted ${services.length} services\n`);

    console.log("✅ Reference data seeding completed!\n");

    // ============================================================
    // STEP 2: Seed Organizations
    // ============================================================
    console.log("📋 STEP 2: Seeding Organizations");
    console.log("=".repeat(50));

    const existingOrgs = await db.select().from(organizations);
    
    if (existingOrgs.length > 0) {
      console.log(`   ⚠️  Database already has ${existingOrgs.length} organizations.`);
      console.log("   Skipping organization seeding to preserve existing data.");
      console.log("   To reseed organizations, delete them first.\n");
    } else {
      try {
        const realOrgs = loadOrganizationsFromJSON();
        console.log(`   📦 Loading ${realOrgs.length} organizations from JSON...`);

        const createdOrgs = await db.insert(organizations).values(realOrgs).returning();
        console.log(`   ✅ Created ${createdOrgs.length} organizations\n`);
      } catch (error: any) {
        console.log("   ⚠️  Could not load organizations from JSON file.");
        console.log(`   Error: ${error.message}`);
        console.log("   This is optional - you can add organizations via the admin panel.\n");
      }
    }

    // ============================================================
    // STEP 3: Seed Sample Projects
    // ============================================================
    console.log("📋 STEP 3: Seeding Sample Projects");
    console.log("=".repeat(50));

    const allOrgs = await db.select().from(organizations);
    
    if (allOrgs.length < 8) {
      console.log(`   ⚠️  Need at least 8 organizations for sample projects.`);
      console.log(`   Currently have ${allOrgs.length} organizations.`);
      console.log("   Skipping project seeding.\n");
    } else {
      const existingProjects = await db.select().from(projects);
      
      if (existingProjects.length > 0) {
        console.log(`   ℹ️  Database already has ${existingProjects.length} projects.`);
        console.log("   Skipping project seeding to preserve existing data.\n");
      } else {
        const orgIds = allOrgs.map(org => org.id);

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
            imageUrl: "/attached_assets/generated_images/Saudi_healthcare_mobile_clinic_e7e4da49.png",
            fundingGoal: 8500000,
            fundingCurrent: 6200000,
            sdgGoals: ["3", "10"],
            impactMetrics: "Serving 50,000+ rural residents, conducting 15,000 consultations monthly",
            seekingInvestment: true,
            latitude: 18.2164,
            longitude: 42.5053,
          },
          {
            title: "Digital Skills Training for Youth",
            description: "Comprehensive digital literacy and coding bootcamp program targeting unemployed youth in underserved regions, preparing them for the digital economy.",
            category: "Education",
            status: "Active",
            region: "Eastern Province",
            organizationId: orgIds[1],
            fundingGoal: 3200000,
            fundingCurrent: 3200000,
            sdgGoals: ["4", "8"],
            impactMetrics: "2,500 graduates with 78% employment rate within 6 months of completion",
            seekingInvestment: false,
            latitude: 26.4207,
            longitude: 50.0888,
          },
          {
            title: "Sustainable Agriculture Innovation Hub",
            description: "Research and development center promoting water-efficient farming techniques, hydroponics, and climate-resilient crop varieties for Saudi Arabia's arid climate.",
            category: "Environmental",
            status: "Active",
            region: "Qassim",
            organizationId: orgIds[4],
            imageUrl: "/attached_assets/generated_images/Saudi_sustainable_farm_hydroponic_a2c1bb36.png",
            fundingGoal: 12000000,
            fundingCurrent: 7500000,
            sdgGoals: ["2", "6", "12", "13"],
            impactMetrics: "Reduced water usage by 60%, increased crop yield by 40%, serving 200 farms",
            seekingInvestment: true,
            latitude: 26.3260,
            longitude: 43.9750,
          },
          {
            title: "Women Entrepreneurship Acceleration Program",
            description: "Comprehensive support ecosystem for women-led startups including funding, mentorship, workspace, and market access opportunities across multiple sectors.",
            category: "Economic",
            status: "Active",
            region: "Riyadh",
            organizationId: orgIds[3],
            fundingGoal: 5000000,
            fundingCurrent: 4100000,
            sdgGoals: ["5", "8", "10"],
            impactMetrics: "Supported 180 women-led businesses, created 650 jobs, $12M in revenue generated",
            seekingInvestment: true,
            latitude: 24.7136,
            longitude: 46.6753,
          },
          {
            title: "Coastal Conservation & Marine Protection",
            description: "Marine ecosystem restoration project protecting Red Sea coral reefs, mangroves, and endangered species while promoting sustainable eco-tourism.",
            category: "Environmental",
            status: "Planning",
            region: "Makkah",
            organizationId: orgIds[5],
            imageUrl: "/attached_assets/generated_images/Red_Sea_coral_reef_conservation_03feb8df.png",
            fundingGoal: 15000000,
            fundingCurrent: 3500000,
            sdgGoals: ["14", "15"],
            impactMetrics: "Target: Restore 50km of coastline, protect 10 endangered species, create 200 eco-tourism jobs",
            seekingInvestment: true,
            latitude: 22.3089,
            longitude: 39.1041,
          },
          {
            title: "Smart City Infrastructure Upgrade",
            description: "IoT-enabled infrastructure modernization for improved waste management, traffic flow optimization, and energy efficiency in growing urban centers.",
            category: "Infrastructure",
            status: "Active",
            region: "Madinah",
            organizationId: orgIds[6],
            fundingGoal: 45000000,
            fundingCurrent: 28000000,
            sdgGoals: ["9", "11", "13"],
            impactMetrics: "30% reduction in traffic congestion, 25% energy savings, 40% improvement in waste collection efficiency",
            seekingInvestment: true,
            latitude: 24.5247,
            longitude: 39.5692,
          },
          {
            title: "Affordable Housing Development",
            description: "Sustainable, affordable housing development for low-income families with integrated community facilities, green spaces, and renewable energy systems.",
            category: "Social",
            status: "Active",
            region: "Jazan",
            organizationId: orgIds[7],
            fundingGoal: 35000000,
            fundingCurrent: 22000000,
            sdgGoals: ["1", "11"],
            impactMetrics: "1,200 housing units planned, 400 completed, serving 5,000 residents",
            seekingInvestment: true,
            latitude: 16.8892,
            longitude: 42.5511,
          },
        ];

        console.log(`   Creating ${sampleProjects.length} sample projects...`);
        await db.insert(projects).values(sampleProjects);
        console.log(`   ✅ Created ${sampleProjects.length} projects\n`);
      }
    }

    console.log("=".repeat(50));
    console.log("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log("\n📊 Summary:");
    
    const finalRegions = await db.select().from(regions);
    const finalTypes = await db.select().from(organizationTypesTable);
    const finalSubtypes = await db.select().from(organizationSubtypes);
    const finalServices = await db.select().from(servicesTable);
    const finalOrgs = await db.select().from(organizations);
    const finalProjects = await db.select().from(projects);
    
    console.log(`   • Regions: ${finalRegions.length}`);
    console.log(`   • Organization Types: ${finalTypes.length}`);
    console.log(`   • Organization Subtypes: ${finalSubtypes.length}`);
    console.log(`   • Services: ${finalServices.length}`);
    console.log(`   • Organizations: ${finalOrgs.length}`);
    console.log(`   • Projects: ${finalProjects.length}`);
    console.log("\n🚀 Your Saudi Impact Platform is ready to use!\n");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedAll().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
