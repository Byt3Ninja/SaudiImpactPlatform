import { readFileSync, writeFileSync } from 'fs';

interface RawOrganizationData {
  Entry_ID: string;
  Status: string;
  Name: string;
  Type: string;
  "Sub-Type": string;
  Description: string;
  Location: string;
  Sector_Focus: string;
  SDG_Focus: string;
  "Organization Service": string;
  Website_URL: string;
  LinkedIn_URL: string;
  Logo_URL: string;
}

function escapeSql(str: string | undefined | null): string {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
}

function parseArrayField(field: string): string[] {
  if (!field || field.trim() === "") return [];
  return field.split(",").map(item => item.trim()).filter(item => item.length > 0);
}

function parseSaudiRegion(location: string | undefined): string {
  if (!location || location.trim() === "") return "Riyadh";
  
  const locationLower = location.toLowerCase();
  
  if (locationLower.includes("riyadh")) return "Riyadh";
  if (locationLower.includes("jeddah") || locationLower.includes("makkah") || locationLower.includes("mecca")) return "Makkah";
  if (locationLower.includes("madinah") || locationLower.includes("medina")) return "Madinah";
  if (locationLower.includes("dhahran") || locationLower.includes("dammam") || locationLower.includes("khobar") || locationLower.includes("eastern")) return "Eastern Province";
  if (locationLower.includes("tabuk")) return "Tabuk";
  if (locationLower.includes("asir")) return "Asir";
  if (locationLower.includes("qassim")) return "Qassim";
  if (locationLower.includes("hail")) return "Ha'il";
  if (locationLower.includes("jazan")) return "Jazan";
  if (locationLower.includes("najran")) return "Najran";
  if (locationLower.includes("bahah")) return "Al-Bahah";
  if (locationLower.includes("jawf")) return "Al-Jouf";
  
  return "Riyadh";
}

// Read organization data
const orgData: RawOrganizationData[] = JSON.parse(
  readFileSync('attached_assets/tableConvert.com_57fv6k_1763052164626.json', 'utf-8')
);

let sql = `-- ============================================================
-- Saudi Impact Platform - Complete Migration and Seed SQL
-- Generated: ${new Date().toISOString()}
-- ============================================================

-- ============================================================
-- STEP 1: CREATE TABLES
-- ============================================================

-- Drop existing tables (careful!)
DROP TABLE IF EXISTS organization_submissions CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS organization_subtypes CASCADE;
DROP TABLE IF EXISTS organization_types CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    profile_image_url VARCHAR,
    organization_id VARCHAR,
    role VARCHAR NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);
CREATE INDEX IDX_session_expire ON sessions(expire);

-- Regions table
CREATE TABLE regions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    name TEXT NOT NULL UNIQUE,
    name_ar TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organization types table
CREATE TABLE organization_types (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    name TEXT NOT NULL UNIQUE,
    name_ar TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organization subtypes table
CREATE TABLE organization_subtypes (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    name TEXT NOT NULL UNIQUE,
    name_ar TEXT,
    type_id VARCHAR,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    name TEXT NOT NULL UNIQUE,
    name_ar TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizations table
CREATE TABLE organizations (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    name TEXT NOT NULL,
    name_ar TEXT,
    type TEXT NOT NULL,
    sub_type TEXT,
    description TEXT NOT NULL,
    description_ar TEXT,
    logo_url TEXT,
    website TEXT,
    linkedin_url TEXT,
    contact_email TEXT,
    region TEXT NOT NULL,
    sector_focus TEXT[],
    sdg_focus TEXT[],
    services TEXT[],
    status TEXT
);

-- Projects table
CREATE TABLE projects (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    title TEXT NOT NULL,
    title_ar TEXT,
    description TEXT NOT NULL,
    description_ar TEXT,
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    region TEXT NOT NULL,
    organization_id VARCHAR NOT NULL,
    image_url TEXT,
    funding_goal REAL,
    funding_current REAL DEFAULT 0,
    sdg_goals TEXT[] NOT NULL,
    impact_metrics TEXT NOT NULL,
    impact_metrics_ar TEXT,
    seeking_investment BOOLEAN DEFAULT false,
    latitude REAL,
    longitude REAL,
    created_by VARCHAR
);

-- Organization submissions table
CREATE TABLE organization_submissions (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
    submitted_by VARCHAR NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    name_ar TEXT,
    type TEXT NOT NULL,
    sub_type TEXT,
    description TEXT NOT NULL,
    description_ar TEXT,
    logo_url TEXT,
    website TEXT,
    linkedin_url TEXT,
    contact_email TEXT,
    region TEXT NOT NULL,
    sector_focus TEXT[],
    sdg_focus TEXT[],
    services TEXT[],
    status TEXT NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR,
    rejection_reason TEXT
);

-- ============================================================
-- STEP 2: SEED REFERENCE DATA
-- ============================================================

-- Regions
INSERT INTO regions (name, name_ar, is_active) VALUES
('Riyadh', 'الرياض', true),
('Makkah', 'مكة المكرمة', true),
('Madinah', 'المدينة المنورة', true),
('Eastern Province', 'المنطقة الشرقية', true),
('Asir', 'عسير', true),
('Tabuk', 'تبوك', true),
('Qassim', 'القصيم', true),
('Ha''il', 'حائل', true),
('Northern Borders', 'الحدود الشمالية', true),
('Jazan', 'جازان', true),
('Najran', 'نجران', true),
('Al-Bahah', 'الباحة', true),
('Al-Jouf', 'الجوف', true);

-- Organization Types
INSERT INTO organization_types (name, name_ar, is_active) VALUES
('Government Entity', 'جهة حكومية', true),
('Non-Profit Organization', 'منظمة غير ربحية', true),
('Private Sector', 'القطاع الخاص', true),
('Social Enterprise', 'مؤسسة اجتماعية', true),
('Foundation', 'مؤسسة خيرية', true),
('Investment Fund', 'صندوق استثماري', true),
('Development Agency', 'وكالة تنمية', true),
('Research Institute', 'معهد بحثي', true),
('Educational Institution', 'مؤسسة تعليمية', true),
('Healthcare Provider', 'مقدم رعاية صحية', true);

-- Organization Subtypes
INSERT INTO organization_subtypes (name, name_ar, is_active) VALUES
('Venture Capital', 'رأس المال المغامر', true),
('Impact Investor', 'مستثمر التأثير', true),
('Accelerator', 'مسرع أعمال', true),
('Incubator', 'حاضنة أعمال', true),
('Consultancy', 'استشارات', true),
('Training Provider', 'مقدم تدريب', true),
('Co-working Space', 'مساحة عمل مشتركة', true);

-- Services
INSERT INTO services (name, name_ar, description, is_active) VALUES
('Grant Program', 'برنامج منح', 'Provides financial grants to organizations and projects', true),
('Corporate Challenge / Prize', 'تحدي الشركات / جائزة', 'Organizes competitions and awards for innovative solutions', true),
('Mentorship', 'إرشاد', 'Offers guidance and advice from experienced professionals', true),
('Training & Workshops', 'تدريب وورش عمل', 'Provides educational programs and skill development', true),
('Networking Events', 'فعاليات التواصل', 'Organizes events for professional connections', true),
('Market Research', 'أبحاث السوق', 'Conducts research and analysis of market trends', true),
('Legal Support', 'الدعم القانوني', 'Provides legal advice and assistance', true),
('Technical Support', 'الدعم الفني', 'Offers technical expertise and guidance', true);

-- ============================================================
-- STEP 3: SEED ORGANIZATIONS
-- ============================================================

`;

// Generate organization insert statements
orgData.forEach((org, index) => {
  const name = escapeSql(org.Name);
  const type = escapeSql(org.Type || 'Private Sector');
  const subType = org['Sub-Type'] ? escapeSql(org['Sub-Type'].replace(/^["']+|["']+$/g, '').trim()) : 'NULL';
  const description = escapeSql(org.Description || 'No description available');
  const logoUrl = escapeSql(org.Logo_URL);
  const website = escapeSql(org.Website_URL);
  const linkedinUrl = escapeSql(org.LinkedIn_URL);
  const region = escapeSql(parseSaudiRegion(org.Location));
  
  const sectorFocus = parseArrayField(org.Sector_Focus);
  const sdgFocus = parseArrayField(org.SDG_Focus);
  const services = parseArrayField(org['Organization Service']);
  
  const sectorArray = sectorFocus.length > 0 ? `ARRAY[${sectorFocus.map(s => escapeSql(s)).join(', ')}]` : 'NULL';
  const sdgArray = sdgFocus.length > 0 ? `ARRAY[${sdgFocus.map(s => escapeSql(s)).join(', ')}]` : 'NULL';
  const servicesArray = services.length > 0 ? `ARRAY[${services.map(s => escapeSql(s)).join(', ')}]` : 'NULL';
  
  sql += `INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
(${name}, ${type}, ${subType}, ${description}, ${logoUrl}, ${website}, ${linkedinUrl}, ${region}, ${sectorArray}, ${sdgArray}, ${servicesArray}, 'active');\n`;
});

sql += `
-- ============================================================
-- STEP 4: SEED SAMPLE PROJECTS
-- ============================================================

-- Get some organization IDs for projects
DO $$
DECLARE
    org_ids VARCHAR[];
BEGIN
    SELECT ARRAY_AGG(id) INTO org_ids FROM organizations LIMIT 10;
    
    -- NEOM Renewable Energy Complex
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment, latitude, longitude
    ) VALUES (
        'NEOM Renewable Energy Complex',
        'Massive solar and wind energy installation powering the sustainable city of NEOM with 100% renewable energy.',
        'Environmental',
        'Active',
        'Tabuk',
        org_ids[1],
        25000000,
        18500000,
        ARRAY['7', '9', '13'],
        'Expected to generate 4GW of clean energy, reducing carbon emissions by 6 million tons annually',
        true,
        27.9625,
        35.3025
    );
    
    -- Rural Healthcare Access
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment, latitude, longitude
    ) VALUES (
        'Rural Community Healthcare Access',
        'Establishing mobile health clinics and telemedicine infrastructure to serve remote communities.',
        'Healthcare',
        'Active',
        'Asir',
        org_ids[2],
        8000000,
        3200000,
        ARRAY['3', '10', '11'],
        'Serving 50,000+ residents in remote areas, 15 mobile clinics deployed',
        true,
        18.2164,
        42.5053
    );
    
    -- Smart City Infrastructure Riyadh
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment
    ) VALUES (
        'Smart City Infrastructure - Riyadh',
        'Implementing IoT sensors and AI-driven traffic management to reduce congestion and improve urban living.',
        'Infrastructure',
        'Active',
        'Riyadh',
        org_ids[3],
        45000000,
        32000000,
        ARRAY['9', '11', '13'],
        '40% reduction in traffic congestion, 25% improvement in air quality',
        false
    );
    
    -- Youth Skills Development
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment
    ) VALUES (
        'Youth Skills Development Program',
        'Comprehensive vocational training and mentorship program for Saudi youth in technology and innovation sectors.',
        'Education',
        'Active',
        'Eastern Province',
        org_ids[4],
        12000000,
        9500000,
        ARRAY['4', '8', '10'],
        'Training 5,000+ youth annually, 75% job placement rate',
        true
    );
    
    -- Circular Economy Initiative
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment, latitude, longitude
    ) VALUES (
        'Circular Economy Industrial Park',
        'First-of-its-kind industrial park promoting waste reduction, recycling, and sustainable manufacturing practices.',
        'Economic Development',
        'Planning',
        'Makkah',
        org_ids[5],
        60000000,
        12000000,
        ARRAY['9', '12', '13'],
        'Expected to recycle 100,000 tons annually, create 2,000 jobs',
        true,
        21.4225,
        39.8262
    );
    
    -- Water Conservation Project
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment
    ) VALUES (
        'Advanced Water Conservation & Recycling',
        'Implementing cutting-edge water treatment and conservation technologies across agricultural regions.',
        'Environmental',
        'Active',
        'Qassim',
        org_ids[6],
        18000000,
        7200000,
        ARRAY['6', '13', '15'],
        'Saving 50 million liters daily, supporting 200+ farms',
        true
    );
    
    -- Digital Literacy Initiative
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment
    ) VALUES (
        'National Digital Literacy Initiative',
        'Bridging the digital divide through comprehensive training programs for underserved communities.',
        'Education',
        'Active',
        'Najran',
        org_ids[7],
        5000000,
        2800000,
        ARRAY['4', '9', '10'],
        '30,000 citizens trained, 85% digital competency achievement',
        false
    );
    
    -- Renewable Energy Hub
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment, latitude, longitude
    ) VALUES (
        'Red Sea Renewable Energy Hub',
        'Large-scale solar farm providing clean energy to coastal communities and tourist developments.',
        'Environmental',
        'Active',
        'Tabuk',
        org_ids[8],
        35000000,
        21000000,
        ARRAY['7', '9', '13'],
        '500MW capacity, powering 50,000 homes with clean energy',
        true,
        28.3838,
        34.5015
    );
    
    -- Heritage Preservation
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment
    ) VALUES (
        'Cultural Heritage Digital Preservation',
        'Using advanced technology to digitally preserve and showcase Saudi Arabia''s rich cultural heritage.',
        'Social',
        'Completed',
        'Madinah',
        org_ids[9],
        4000000,
        4000000,
        ARRAY['4', '11', '16'],
        'Digitized 5,000+ artifacts, 2 million virtual visitors annually',
        false
    );
    
    -- Startup Ecosystem
    INSERT INTO projects (
        title, description, category, status, region, organization_id,
        funding_goal, funding_current, sdg_goals, impact_metrics,
        seeking_investment
    ) VALUES (
        'Tech Startup Ecosystem Development',
        'Building a comprehensive support network for tech startups including funding, mentorship, and infrastructure.',
        'Economic Development',
        'Active',
        'Riyadh',
        org_ids[10],
        22000000,
        15000000,
        ARRAY['8', '9', '17'],
        'Supporting 300+ startups, $100M+ in startup funding facilitated',
        true
    );
END $$;

-- ============================================================
-- COMPLETED!
-- ============================================================
-- To import this file:
-- psql -h YOUR_HOST -U YOUR_USER -d YOUR_DATABASE -f saudi_impact_complete.sql
-- ============================================================
`;

writeFileSync('saudi_impact_complete.sql', sql);
console.log('✅ SQL file generated: saudi_impact_complete.sql');
console.log(`   - ${orgData.length} organizations`);
console.log('   - 10 sample projects');
console.log('   - All reference data (regions, types, services)');
