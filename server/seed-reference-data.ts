import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { regions, organizationTypesTable, organizationSubtypes, servicesTable } from "@shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seedReferenceData() {
  console.log("Seeding reference data...");

  try {
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

    console.log("Inserting regions...");
    await db.insert(regions).values(saudiRegions).onConflictDoNothing();
    console.log(`✓ Inserted ${saudiRegions.length} regions`);

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

    console.log("Inserting organization types...");
    await db.insert(organizationTypesTable).values(orgTypes).onConflictDoNothing();
    console.log(`✓ Inserted ${orgTypes.length} organization types`);

    const subtypes = [
      { name: "Venture Capital", nameAr: "رأس المال المغامر", isActive: true },
      { name: "Impact Investor", nameAr: "مستثمر التأثير", isActive: true },
      { name: "Accelerator", nameAr: "مسرّع أعمال", isActive: true },
      { name: "Incubator", nameAr: "حاضنة أعمال", isActive: true },
      { name: "Corporate Social Responsibility", nameAr: "المسؤولية الاجتماعية للشركات", isActive: true },
      { name: "Grant Maker", nameAr: "مانح", isActive: true },
      { name: "Technical Assistance Provider", nameAr: "مقدم مساعدة فنية", isActive: true },
      { name: "Research & Development", nameAr: "البحث والتطوير", isActive: true },
      { name: "Training & Capacity Building", nameAr: "التدريب وبناء القدرات", isActive: true },
      { name: "Policy & Advocacy", nameAr: "السياسات والدعوة", isActive: true },
    ];

    console.log("Inserting organization subtypes...");
    await db.insert(organizationSubtypes).values(subtypes).onConflictDoNothing();
    console.log(`✓ Inserted ${subtypes.length} organization subtypes`);

    const servicesList = [
      { name: "Funding & Investment", nameAr: "التمويل والاستثمار", isActive: true },
      { name: "Mentorship & Advisory", nameAr: "الإرشاد والاستشارات", isActive: true },
      { name: "Technical Training", nameAr: "التدريب التقني", isActive: true },
      { name: "Business Development", nameAr: "تطوير الأعمال", isActive: true },
      { name: "Research & Analytics", nameAr: "البحث والتحليل", isActive: true },
      { name: "Network & Partnerships", nameAr: "الشبكات والشراكات", isActive: true },
      { name: "Impact Measurement", nameAr: "قياس التأثير", isActive: true },
      { name: "Legal & Compliance", nameAr: "القانونية والامتثال", isActive: true },
      { name: "Marketing & Communications", nameAr: "التسويق والاتصالات", isActive: true },
      { name: "Technology & Digital Solutions", nameAr: "التكنولوجيا والحلول الرقمية", isActive: true },
      { name: "Project Management", nameAr: "إدارة المشاريع", isActive: true },
      { name: "Monitoring & Evaluation", nameAr: "المتابعة والتقييم", isActive: true },
      { name: "Grants Management", nameAr: "إدارة المنح", isActive: true },
      { name: "ESG Consulting", nameAr: "استشارات الحوكمة البيئية والاجتماعية", isActive: true },
      { name: "Community Engagement", nameAr: "المشاركة المجتمعية", isActive: true },
    ];

    console.log("Inserting services...");
    await db.insert(servicesTable).values(servicesList).onConflictDoNothing();
    console.log(`✓ Inserted ${servicesList.length} services`);

    console.log("\n✓ Reference data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding reference data:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedReferenceData();
