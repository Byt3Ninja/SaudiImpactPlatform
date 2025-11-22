-- ============================================================
-- Saudi Impact Platform - Complete Migration and Seed SQL
-- Generated: 2025-11-22T23:14:15.451Z
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

INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Public Investment Fund (PIF)', 'Capital Provider', 'Sovereign Wealth Fund (e.g., PIF)', 'The Public Investment Fund (PIF), established in 1971, is Saudi Arabia’s sovereign wealth fund with over USD 925 billion in assets under management and a diversified portfolio of more than 220 companies across 13 strategic sectors. It leads the Kingdom’s economic transformation through long-term investments, sector development, and global strategic partnerships aligned with Vision 2030', 'https://share.google/images/1vHUpKZ2MOSY50TMo', 'https://www.pif.gov.sa/en/', 'https://www.linkedin.com/company/pifsaudi', 'Riyadh', ARRAY['Circular Economy', 'Any Sector'], ARRAY['SDG 7: Affordable and Clean Energy', 'SDG 11: Sustainable Cities and Communities', 'SDG 6: Clean Water and Sanitation', 'SDG 12: Responsible Consumption and Production', 'SDG 15: Life on Land'], ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Venture Capital (SVC)', 'Capital Provider', 'Government Fund', 'SVC is an investment company established in 2018 and is a subsidiary of the SME Bank, part of the National Development Fund (NDF). SVC aims to stimulate and sustain financing for Startups and SMEs from pre-Seed to pre-IPO by investing USD 3 billion through fund investments and direct investments in startups and SMEs.', 'https://svc.com.sa/wp-content/uploads/2023/03/SVC-Logo-Simple-h120.png', 'https://svc.com.sa/en/', 'https://www.linkedin.com/company/svcsa/', 'Riyadh', ARRAY['Circular Economy'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Impact46', 'Capital Provider', 'Venture Capital (VC)', 'Impact46 is a CMA-licensed, innovation-driven asset management firm that manages over 2.3 billion SAR in assets under management and invests in high-growth companies across Saudi Arabia. Its activities include building a diversified portfolio of venture investments and supporting founders through active fund management and capital deployment.', 'https://i0.wp.com/impact46.sa/wp-content/uploads/2023/12/Group-4-1.png?w=105&ssl=1', 'https://impact46.sa/', 'https://www.linkedin.com/company/impact-46/', 'Riyadh', ARRAY['Climate Tech & Energy', 'Education & EdTech'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('RAED Ventures', 'Capital Provider', 'Venture Capital (VC)', 'Raed Ventures is a MENA-focused investment firm that supports high-potential startups by providing funding, strategic partnerships, access to new markets, and value-added services such as its RAEDPlus program, with a network of 56 partners. Its investment approach centers on generating strong financial returns while contributing to social impact and accelerating the region’s digital innovation ecosystem.', NULL, 'https://raed.vc/', 'https://sa.linkedin.com/company/raedvc', 'Riyadh', ARRAY['Logistics & Transport', 'Education & EdTech', 'Financial Inclusion & FinTech', 'Healthcare & Wellness'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Wa''ed Ventures', 'Capital Provider', 'Venture Capital (VC)', 'Supported by Aramco, Wa’ed Ventures is a $500 million venture capital fund dedicated to advancing a comprehensive innovation ecosystem by investing in technology-driven startups, scaling locally developed technologies, and fostering a resilient startup economy. The fund offers access to ecosystem resources, strategic partners, market insights, and an international network that enables portfolio companies to expand across markets and regions.', 'https://www.waed.com/img/logo/waedw.png', 'https://www.waed.com/', 'https://www.linkedin.com/company/waed-ventures', 'Riyadh', ARRAY['Circular Economy', 'Education & EdTech', 'Technology and Innovation'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('National Development Fund (NDF)', 'Capital Provider', 'Government Fund', 'The National Development Fund (NDF), established by Royal Order No. (A/13) in 2017, oversees and coordinates Saudi Arabia’s development funds and banks to enhance their performance, effectiveness, and financial sustainability in alignment with Vision 2030. Its mandate includes streamlining roles, reducing overlap, improving financing and development lending, and ensuring that all development efforts support the Kingdom’s economic priorities and long-term transformation goals.', 'https://ndf.gov.sa/wp-content/themes/ndf''/img/logo.svg''', 'https://ndf.gov.sa/en/home/', 'https://www.linkedin.com/company/ndf', 'Riyadh', ARRAY['Circular Economy'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Misk Foundation', 'Capital Provider', 'Foundation / Philanthropy', 'Misk Foundation, established in 2011 by HRH Prince Mohammed bin Salman bin Abdulaziz, is a non-profit organization dedicated to empowering Saudi youth through education, entrepreneurship, culture, and the creative arts, with science and technology as a supporting focus. The Foundation advances its mission by designing programs and forming local and global partnerships that nurture learning, leadership, and the development of a knowledge-based society.', 'https://misk.org.sa/wp-content/uploads/2021/11/misk-21-logo-light-dark-2048x1177.png', 'https://misk.org.sa/en/', 'https://www.linkedin.com/company/misk-foundation', 'Riyadh', ARRAY['Community Development'], ARRAY['All SDGs'], ARRAY['Fellowship', 'Incubation Program', 'Mentorship Program', 'Workshops & Training', 'Acceleration Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('STV', 'Capital Provider', 'Venture Capital (VC)', 'STV (Saudi Technology Ventures) is the Middle East’s largest technology-focused venture capital fund, managing over $800 million in capital to support and scale high-potential, disruptive technology companies. Since 2018, the firm has invested in more than 30 startups across the MENA region, providing strategic support and resources to accelerate their growth.', 'https://images.squarespace-cdn.com/content/v1/5abdf4e6c3c16a2a7cfb472b/ed1afacf-1845-4c4c-8788-2b4e343d5389/STV+Logo+White+%281%29.png?format=1500w', 'https://stv.vc/', 'https://ky.linkedin.com/company/stvcapital', 'Riyadh', ARRAY['Education & EdTech', 'Financial Inclusion & FinTech', 'Logistics & Transport', 'Technology and Innovation'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Hala Ventures', 'Capital Provider', 'Venture Capital (VC)', 'HALA Ventures, established in its current form in 2018 after operating as a corporate fund under Financial Horizon Group since 2014, is a Saudi-based investment management company specializing in alternative investments with a focus on venture capital. The firm manages a portfolio of 30+ investments and a portfolio valuation exceeding USD 270 million, supporting technology-driven startups across the MENA region.', 'https://www.hala.vc/wp-content/uploads/2020/08/Logo-SVG-black.svg', 'https://www.hala.vc/', 'https://sa.linkedin.com/company/halavc', 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Oqal Angel Investors', 'Capital Provider', 'Angel Investor Network', 'OQAL Angel Investors was established 2011 as an NGO and is the first angel investor community in Saudi Arabia concerned with the growth of the SME sector in the region. OQAL was formed to connect innovative startup founders with experienced angel investors, for the purpose of establishing leading enterprises that contribute to the welfare of the economy and society.', 'https://oqal.org/wp-content/uploads/2021/02/Group-242.svg', 'https://oqal.org/en/', 'https://www.linkedin.com/company/oqalangels', 'Riyadh', ARRAY['Circular Economy'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Seedra Ventures', 'Capital Provider', 'Venture Capital (VC)', 'Seedra Ventures is an investment management firm licensed by the Capital Market Authority (CMA) since 2021. The firm specializes in venture capital, directing its investments toward innovative, technology-driven ideas and high-growth startups.', 'https://seedra.com/wp-content/uploads/2021/03/Seedra-logo-white-vtrs.svg', 'https://seedra.com/', 'https://www.linkedin.com/company/seedra', 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Khwarizmi Ventures', 'Capital Provider', 'Venture Capital (VC)', 'Khwarizmi Ventures is a Saudi-based venture capital firm founded in 2018, investing in early-stage startups that demonstrate strong traction across the GCC. The firm combines an efficient investment process with multidisciplinary expertise and active, value-added support to help founders scale their teams, accelerate growth, and access strategic opportunities.', 'https://static.wixstatic.com/media/462acf_b2dcf172dba140b3aed8c9196a0332a8~mv2.png/v1/fill/w_480,h_190,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/image.png', 'https://www.khwarizmivc.com/', 'https://www.linkedin.com/company/khwarizmivc', 'Riyadh', ARRAY['Any Sector'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Nama Ventures', 'Capital Provider', 'Venture Capital (VC)', 'Nama Ventures is an early-stage, tech-focused venture capital fund dedicated to fueling innovation across the MENA region, with a particular emphasis on Saudi Arabia. The firm is committed to nurturing strong founding teams with complementary skill sets and supporting them in transforming ideas into exceptional, scalable companies.', 'https://www.namaventures.com/wp-content/uploads/2025/05/cropped-Nama-Ventures-Logo-original.jpg', 'https://www.namaventures.com/', 'https://www.linkedin.com/company/namaventures/', 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('King Khalid Foundation', 'Capital Provider', 'Foundation / Philanthropy', 'King Khalid Foundation is a leading philanthropic institution in Saudi Arabia, dedicated to advancing social and economic development through innovative solutions to critical national challenges. Building on King Khalid’s legacy, the foundation brings together key partners across sectors to create lasting, equitable impact and expand opportunities for all individuals in the Kingdom.', 'https://kkf.org.sa/assets/images/kkf-logo.png', 'https://www.kkf.org.sa/en/', 'https://www.linkedin.com/company/king-khalid-foundation', 'Riyadh', ARRAY['""Social Inclusion (e.g.', 'people with disabilities', 'youth)""', 'Community Development'], ARRAY['SDG 5: Gender Equality', 'SDG 7: Affordable and Clean Energy', 'SDG 6: Clean Water and Sanitation', 'SDG 12: Responsible Consumption and Production', 'SDG 8: Decent Work and Economic Growth', 'SDG 3: Good Health and Well-being'], ARRAY['Workshops & Training', 'Mentorship Program', 'Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Al-Khair Capital', 'Capital Provider', 'Impact Fund', 'Alkhair Capital, founded in 2009, is a Shariah-compliant investment services firm with a strong presence across key financial hubs in Saudi Arabia and the wider region. With a paid-up capital of SAR 1 billion, the firm offers tailored investment strategies, modern Islamic financial products, and access to regional capital markets including Tadawul.', 'https://alkhaircapital.com.sa/wp-content/themes/alkhair/img/logo_01.svg', 'https://alkhaircapital.com.sa/', 'https://www.linkedin.com/company/alkhairntl', 'Riyadh', ARRAY['Healthcare & Wellness'], NULL, ARRAY['Grant Program', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Monsha''at', 'Policy & Ecosystem', 'Government Agency', 'Monsha’at, the Small and Medium Enterprises General Authority established in 2016, is an independent government entity under the Ministry of Commerce responsible for regulating, supporting, and developing the SME sector in Saudi Arabia. The authority drives entrepreneurship and innovation by implementing programs that enhance SME productivity, expand access to financing, stimulate venture capital activity, and strengthen business capabilities across key operational areas.', 'https://www.monshaat.gov.sa/themes/eportal2_new/assets/imgs/m_Logo.png', 'https://www.monshaat.gov.sa/en', 'https://www.linkedin.com/company/monshaatsa', 'Riyadh', ARRAY['Circular Economy', 'Any Sector'], ARRAY['SDG 5: Gender Equality', 'SDG 8: Decent Work and Economic Growth', '""SDG 9: Industry', 'Innovation and Infrastructure""'], ARRAY['Acceleration Program', 'Incubation Program', 'Mentorship Program', 'Workshops & Training', 'Technical Assistance', 'Ecosystem Events / Convening', 'Research & Publications', 'Fellowship', 'Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('KAUST Entrepreneurship Center', 'Intermediary & Enablers', 'University / Education Program', 'KAUST fosters a deep-tech entrepreneurship ecosystem in Saudi Arabia by providing founders with training, mentorship, and comprehensive support—from idea development and commercialization to launch and funding. The university empowers scientists, students, and innovators to build impactful ventures aligned with KAUST’s research strengths, while helping protect intellectual property and drive local and regional economic growth.', 'https://innovation.kaust.edu.sa/wp-content/themes/catapult/images/kaust_logo.png', 'https://innovation.kaust.edu.sa/entrepreneurs/kaust-entrepreneurship-center/', 'https://www.linkedin.com/showcase/kaust-innovation/', 'Riyadh', ARRAY['Circular Economy', 'Technology and Innovation'], ARRAY['SDG 17: Partnerships for the Goals'], ARRAY['Mentorship Program', 'Workshops & Training', 'Technical Assistance', 'Research & Publications', 'Ecosystem Events / Convening'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Misk Foundation', 'Intermediary & Enablers', 'Accelerator', 'Misk Foundation, established in 2011 by HRH Prince Mohammed bin Salman bin Abdulaziz, is a non-profit organization dedicated to empowering Saudi youth through education, entrepreneurship, culture, and the creative arts, with science and technology as a supporting focus. The Foundation advances its mission by designing programs and forming local and global partnerships that nurture learning, leadership, and the development of a knowledge-based society.', 'https://misk.org.sa/wp-content/uploads/2021/11/misk-21-logo-light-dark-2048x1177.png', 'https://misk.org.sa/en/', 'https://www.linkedin.com/company/misk-foundation', 'Riyadh', ARRAY['Circular Economy'], ARRAY['All SDGs'], ARRAY['Fellowship', 'Incubation Program', 'Mentorship Program', 'Workshops & Training', 'Acceleration Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('The Garage', 'Intermediary & Enablers', 'Accelerator, Incubator, Co-working Space / Hub', 'The Garage is a national deep-tech innovation hub established through a partnership between MCIT, KACST, and the Saudi Federation for Cybersecurity, Programming, and Drones, designed to incubate and accelerate high-potential technology startups. Combining modern workspaces with funding access, specialized programs, and comprehensive technical and business support, it empowers entrepreneurs to build scalable ventures across advanced and emerging technologies.', 'https://thegarage.sa/assets/images/logo/logo.png', 'https://thegarage.sa/', 'https://www.linkedin.com/company/thegarageksa', 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Acceleration Program', 'Incubation Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Flat6Labs Riyadh', 'Intermediary & Enablers', 'Accelerator', 'Flat6Labs is the Middle East and Africa’s leading entrepreneurial ecosystem builder, operating across more than 14 countries to support startups through world-class programs, advisory services, and strategic partnerships. Since its launch in 2011, it has empowered thousands of entrepreneurs—including underserved and displaced founders—driving job creation, innovation, and sustainable economic growth across emerging markets.', 'https://flat6labs.com/wp-content/themes/flat6labs/images/F6-New-Icon-Logo.png', 'https://flat6labs.com/Location/ksa/', 'https://eg.linkedin.com/company/flat6labs', 'Riyadh', ARRAY['Technology and Innovation'], ARRAY['SDG 5: Gender Equality', 'SDG 3: Good Health and Well-being', 'SDG 4: Quality Education', 'SDG 7: Affordable and Clean Energy', 'SDG 8: Decent Work and Economic Growth', 'SDG 13: Climate Action'], ARRAY['Acceleration Program', 'Incubation Program', 'Corporate Challenge / Prize', 'Mentorship Program', 'Workshops & Training'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Fintech Saudi', 'Intermediary & Enablers', 'Accelerator', 'Fintech Saudi works to serve the financial sector in the Kingdom, with goals that include making the Kingdom a hub for innovation in the fintech sector, creating a sophisticated ecosystem that relies on both local and international stakeholders, contributing to the support and development of infrastructure according to the requirements of the fintech industry, building and developing the necessary skills and knowledge in the field, and supporting entrepreneurs at all stages of their development.', 'https://saudipedia.com/en/saudipediaen/uploads/images/2024/08/02/thumbs/400x400/97342.jpg', 'https://www.fintechsaudi.com/', 'https://www.linkedin.com/company/fintech-saudi', 'Riyadh', ARRAY['Financial Inclusion & FinTech'], NULL, ARRAY['Acceleration Program', 'Ecosystem Events / Convening', 'Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('The Riyadh Techstars Accelerator', 'Intermediary & Enablers', 'Accelerator', 'Riyadh Techstars Accelerator is a technical program approved by the Ministry of Communications and Information Technology, in partnership with the global Techstars network. It aims to accelerate the businesses of digital startups in the Kingdom of Saudi Arabia and invest in early-stage projects, from inception to growth. This initiative aligns with the targets of the Communications and Information Technology Strategy and the core pillars of Saudi Vision 2030.', 'https://mms.businesswire.com/media/20210331006021/en/868715/4/techstars-logo-2020-billboard-1548-1586377039-768x433.jpg', 'https://www.techstars.com/accelerators/riyadh', 'https://www.linkedin.com/company/the-riyadh-techstars-accelerator/posts/?feedView=all', 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Acceleration Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('NIM (National Industrial Dev. Center)', 'Policy & Ecosystem', 'Government Agency', 'The National Industrial Development Center (NIDC) is tasked with the mission of driving sustainable industrial growth and leading initiatives to enhance the effectiveness, promote, and empower major industries in Saudi Arabia to achieve the mandates of Vision 2030 goals.', 'https://www.ic.gov.sa/wp-content/uploads/2025/08/IC-logo.webp', 'https://www.ic.gov.sa/', 'https://www.linkedin.com/company/national-industrial-development-program/?trk=public_profile_experience-item_profile-section-card_image-click&originalSubdomain=ng', 'Riyadh', ARRAY['Circular Economy', 'Agriculture & Food Security', 'Healthcare & Wellness', 'Smart Cities & Urban Development'], NULL, ARRAY['Technical Assistance', 'Research & Publications'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Blossom Accelerator', 'Intermediary & Enablers', 'Accelerator', 'Blossom Accelerator is Saudi Arabia’s first female-focused and tech-inclusion accelerator, working to expand participation and diversify talent within the national entrepreneurial ecosystem. It supports women-led and select male-led startups through a one-month boot camp offered five times a year, alongside regular public events and workshops that strengthen skills, networks, and access to resources.', 'https://blossom.sa/wp-content/uploads/2024/09/bloosom-logo1.png', 'https://blossom.sa/', 'https://sa.linkedin.com/company/blossomaccel', 'Riyadh', ARRAY['Technology and Innovation'], ARRAY['SDG 5: Gender Equality'], ARRAY['Technical Assistance', 'Acceleration Program', 'Mentorship Program', 'Workshops & Training', 'Ecosystem Events / Convening'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('BIAC (Biz. Incubators & Accel. Co.)', 'Intermediary & Enablers', 'Incubator', 'BIAC, established in 2017 as a subsidiary of the Saudi Technology Development and Investment Company (TAQNIA), provides innovation and shared services to help public and private entities develop effective, modern solutions. As the first licensed company in Saudi Arabia to manage business incubators and accelerators, it enables innovation by building and operating innovation environments, supporting technology transfer, and managing projects across multiple sectors.', 'https://www.pif.gov.sa/-/media/project/pif-corporate/pif-corporate-site/our-investments/portfolio/pc-logos/biac-logo-500x200.png?h=200&iar=0&w=500', 'https://www.biac.com.sa/?lang=en', 'https://www.linkedin.com/company/tasamaksa/', 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Technical Assistance', 'Acceleration Program', 'Incubation Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Center of Digital Ent. (CODE)', 'Intermediary & Enablers', 'Incubator', 'The Center of Digital Entrepreneurship Headquarters (HQ) promotes digital entrepreneurship by supporting innovative business models, fostering a strong entrepreneurial culture, and enabling the establishment of leading digital companies. Through its programs, events, and access to expert engineers and technicians, the Center helps bridge the gap between service providers and the wider digital innovation labs network.', 'https://code.mcit.gov.sa/sites/default/files/code_logo_1.png', 'https://code.mcit.gov.sa/en/Innovation-Lab/center-digital-entrepreneurship', NULL, 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Technical Assistance', 'Incubation Program', 'Grant Program', 'Mentorship Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Wadi Makkah Ventures', 'Intermediary & Enablers', 'University / Education Program', 'Wadi Makkah Ventures (WMV), owned by Umm Al-Qura University, drives innovation and technological development in the Makkah province with a strong focus on solutions that enhance Hajj and Umrah services. Through its incubators, accelerators, funding programs, and comprehensive support services, WMV supports startups across multiple sectors and extends its innovation services to public, private, and non-profit organizations.', 'https://www.iasp.ws/media/imagegenerator/290x290/upscale(false)/canvascolor(0xffffffff)/WMV_logo_PNG_2024-03-03_14_03_12_1@2x.png', 'https://wmvc.sa/', 'https://sa.linkedin.com/company/wadimakkahvc', 'Makkah', ARRAY['Circular Economy', 'Agriculture & Food Security', 'Arts & Culture', 'Education & EdTech', 'Healthcare & Wellness', 'Logistics & Transport', 'Smart Cities & Urban Development', 'Sustainable Tourism', 'Technology and Innovation'], NULL, ARRAY['Technical Assistance', 'Incubation Program', 'Grant Program', 'Research & Publications', 'Ecosystem Events / Convening', 'Acceleration Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('MBSC Venture Lab', 'Intermediary & Enablers', 'University / Education Program', 'The Business Lab at Prince Mohammed Bin Salman College of Management and Entrepreneurship is an accelerator, incubator, and co-working space based in King Abdullah Economic City, uniquely positioned within Saudi Arabia’s only higher-education institution dedicated exclusively to entrepreneurship. It serves as a launchpad for both local and international entrepreneurs, providing support for starting, launching, and growing their ventures within the college and the wider community.', 'https://www.mbsc.edu.sa/wp-content/uploads/sites/5/2024/01/Artboard-5-1.svg', 'https://www.mbsc.edu.sa/ar/venture-lab/', NULL, 'Riyadh', ARRAY['Circular Economy'], NULL, ARRAY['Incubation Program', 'Acceleration Program', 'Technical Assistance', 'Workshops & Training', 'Ecosystem Events / Convening', 'Co-working Space'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('AstroLabs', 'Intermediary & Enablers', 'Co-working Space / Hub, Incubator, Accelerator, Mentorship Platform, Hackathons', 'AstroLabs, founded in 2013, is a platform dedicated to simplifying and accelerating market entry into the Gulf, supporting companies of all sizes across dozens of industries and countries. Through a combination of advanced technology and hands-on expertise, it enables sustainable growth and successful regional expansion for more than 1,800 startups and global enterprises.', 'https://astrolabs.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F732yszuw%2Fproduction%2F38a8f9bb6df4a51cdedc0f9f4121ede95bc635ed-1370x470.png&w=384&q=75', 'https://astrolabs.com/', 'https://www.linkedin.com/school/astrolabs/', 'Riyadh', ARRAY['Circular Economy', 'Technology and Innovation', 'Sustainable Tourism', 'Climate Tech & Energy'], NULL, ARRAY['Acceleration Program', 'Technical Assistance', 'Research & Publications', 'Incubation Program', 'Mentorship Program', 'Ecosystem Events / Convening', 'Co-working Space'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('White Space', 'Intermediary & Enablers', 'Co-working Space / Hub', 'White Spaces is a Saudi hospitality company founded in 2014 in Jeddah, specializing in providing flexible, private, and fully serviced office solutions across major cities in the Kingdom. Through customizable workspaces, risk-free agreements, and comprehensive amenities, White Spaces delivers a worry-free, high-quality environment for teams, startups, and enterprises seeking productive and adaptable office experiences.', 'https://www.wspace.com.sa/web/image/website/1/logo/White%20Space?unique=f8c5e6c', 'https://www.wspace.com.sa/', 'https://sa.linkedin.com/company/wspaceksa', 'Riyadh', ARRAY['Any Sector'], NULL, ARRAY['Co-working Space'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Alnahda Society', 'Impact Maker', 'Non-Profit / NGO', 'Alnahda is a nonprofit organization founded in 1963 that empowers women socially and economically through programs, evidence-based initiatives, and advocacy aligned with national development. Accredited by the UN ECOSOC, the organization works to strengthen women’s capabilities, expand their leadership opportunities, and support lower-income households while advancing women’s rights and driving long-term social impact in Saudi Arabia.', 'https://www.alnahda.org/img/mlogo.png', 'https://www.alnahda.org/?lang=en', 'https://www.linkedin.com/company/nahda', 'Riyadh', ARRAY['Circular Economy'], ARRAY['SDG 5: Gender Equality'], ARRAY['Technical Assistance', 'Workshops & Training', 'Mentorship Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Glowork', 'Impact Maker', 'Social Enterprise', 'Glowork, founded in 2011, is a social enterprise focused on empowering women in the labour market through innovative employment solutions and close collaboration with government entities. With operations in Riyadh and Amman and a team of over 60 employees, it has supported more than 16,000 women and aims to set a regional benchmark for impactful social entrepreneurship.', 'https://media.licdn.com/dms/image/v2/D4D0BAQEj_KaP2hxpLg/company-logo_200_200/B4DZVNvjVKHkAI-/0/1740766066518/glowork_logo?e=1764201600&v=beta&t=7wTkLd9J2WADz5BmT9Qj_zUP0T3X4mZxmUCpRs5-7M4', 'https://glowork.net/', 'https://www.linkedin.com/company/glowork', 'Riyadh', ARRAY['Circular Economy'], ARRAY['SDG 5: Gender Equality'], ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Classera', 'Impact Maker', 'Impact-Driven Startup', 'Classera’s mission is to transform traditional education through smart e-learning solutions that create an engaging, future-ready learning experience for students. With a focus on sustained motivation and high-impact digital tools, it works to reshape the education ecosystem for current and future generations.', 'https://classera.com/static/assets/img/logos/hqlogo.svg', 'https://classera.com/', 'https://www.linkedin.com/company/classera-inc-', 'Riyadh', ARRAY['Circular Economy'], NULL, ARRAY['Workshops & Training'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('EKHAA Charitable Foundation', 'Impact Maker', 'Non-Profit / NGO', 'Ikhaa, the Charitable Foundation for the Care of Orphans, was established by Council of Ministers Resolution No. 14 (1424 AH) as a national organization supporting orphans after their transition from government-supervised care. Through its nationwide branches and comprehensive services—including housing, education, training, employment support, financial assistance, and family programs—Ikhaa aims to ensure stability, dignity, and a successful shift from dependence to responsibility for the youth it serves.', 'https://website.ekhaa.org.sa/', 'https://website.ekhaa.org.sa/', 'https://sa.linkedin.com/company/%D8%A5%D8%AE%D8%A7%D8%A1-%D8%A7%D9%84%D9%85%D8%A4%D8%B3%D8%B3%D8%A9-%D8%A7%D9%84%D8%AE%D9%8A%D8%B1%D9%8A%D8%A9-%D9%84%D8%B1%D8%B9%D8%A7%D9%8A%D8%A9-%D8%A7%D9%84%D8%A3%D9%8A%D8%AA%D8%A7%D9%85', 'Riyadh', ARRAY['""Social Inclusion (e.g.', 'people with disabilities', 'youth)""'], ARRAY['SDG 10: Reduced Inequalities'], ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Labayh', 'Impact Maker', 'Impact-Driven Startup', 'Labayh is an electronic platform that provides psychological and family counseling sessions, offering users secure, accessible support from qualified service providers. Committed to privacy and transparency, it outlines clear policies governing how personal information and shared data are handled, ensuring trust and protection for all beneficiaries.', 'https://labayh.net/wp-content/themes/labayh/assets/images/logo/labayh-logo.svg', 'https://labayh.net/', 'https://www.linkedin.com/company/labayhapp/', 'Riyadh', ARRAY['Healthcare & Wellness'], ARRAY['SDG 3: Good Health and Well-being'], ARRAY['Workshops & Training', 'Mentorship Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Naqaa Solutions', 'Impact Maker', 'Impact-Driven Startup', 'Naqaa Solutions, founded in 2011, is a Saudi company dedicated to advancing sustainability and circularity by helping organizations establish and optimize effective recycling systems. Having served more than 200 companies across sectors, it provides customized solutions that support waste reduction, resource management, and progress toward achieving zero waste to landfill.', 'https://cdn.prod.website-files.com/65bff36178c33935f55f821b/65c00228daccf3250b8249c1_Naqaa%20solutions%20logo.svg', 'https://www.naqaa.com.sa/', 'https://www.linkedin.com/company/naqaa-solutions-environmental-services/', 'Makkah', ARRAY['Circular Economy', 'Climate Tech & Energy'], ARRAY['SDG 12: Responsible Consumption and Production'], ARRAY['Workshops & Training', 'Mentorship Program', 'Ecosystem Events / Convening'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Sadu House', 'Impact Maker', 'Social Enterprise', 'No description available', NULL, NULL, NULL, 'Eastern Province', ARRAY['Circular Economy'], NULL, NULL, 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Mawaddah Women''s Charity', 'Impact Maker', 'Non-Profit / NGO', 'Mawaddah is a specialized family development association dedicated to strengthening the stability and well-being of Saudi families, with a core mission to reduce divorce rates and address their social and emotional impacts. Through research-driven, sustainable solutions and close collaboration with national authorities, it works to enhance family support systems, influence relevant legislation, and promote a more secure, informed, and resilient society.', 'https://mawaddah.org.sa/web_assets/images/logo_new.png', 'https://mawaddah.org.sa/news/129', 'https://www.linkedin.com/company/mafs-org', 'Riyadh', ARRAY['Community Development', '""Social Inclusion (e.g.', 'people with disabilities', 'youth)""'], ARRAY['SDG 5: Gender Equality', 'SDG 10: Reduced Inequalities', '""SDG 16: Peace', 'Justice and Strong Institutions""', 'SDG 17: Partnerships for the Goals'], ARRAY['Workshops & Training', 'Mentorship Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Desert Technologies', 'Impact Maker', 'Impact-Driven Startup', 'Desert Technologies (DT) is a global sustainable development platform specializing in investment development, asset management, and EPC services for large-scale renewable energy projects. With a portfolio exceeding USD 210 million and over USD 1.4 billion in the pipeline, DT advances environmentally responsible energy solutions by aligning public benefit with financially viable private-sector investment.', 'https://www.desert-technologies.com/', 'https://www.desert-technologies.com/', 'https://sa.linkedin.com/company/desert-technologies', 'Makkah', ARRAY['Climate Tech & Energy'], NULL, ARRAY['Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Faheem', 'Impact Maker', 'Impact-Driven Startup', 'Faheem is a platform that connects and provides experienced tutors to students looking to boost their performance.', 'https://www.faheemapp.com/logo_dark.png', 'https://www.faheemapp.com/', 'https://www.linkedin.com/company/faheemapp', 'Riyadh', ARRAY['Education & EdTech'], ARRAY['SDG 4: Quality Education'], ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Alzheimer''s Disease Association', 'Impact Maker', 'Non-Profit / NGO', 'The Saudi Alzheimer Disease Association, established in 2009, was founded by families of patients to break the silence surrounding Alzheimer’s, raise public awareness, and provide essential support to those affected. Through education, care programs, research support, and strategic partnerships, the association works to improve quality of life for patients and caregivers while advancing national understanding of the disease.', 'https://alz.org.sa/wp-content/uploads/2023/11/alz-logo.png', 'https://alz.org.sa/?page_id=5708', 'https://sa.linkedin.com/in/saudi-alzheimer-s-disease-association-8b8bb9139', 'Riyadh', ARRAY['Healthcare & Wellness', '""Social Inclusion (e.g.', 'people with disabilities', 'youth)""'], ARRAY['SDG 3: Good Health and Well-being'], ARRAY['Workshops & Training', 'Mentorship Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('NABATIK', 'Intermediary & Enablers', 'Impact-Driven Startup, Social Enterprise, Grant-Making Organization', 'Nabatik is a digital platform launched by the Holy Makkah Municipality that enables residents and visitors to remotely participate in tree-planting efforts across Makkah and its holy sites. By allowing users to select planting locations, choose climate-appropriate tree species, and have municipal teams carry out the planting, the platform supports the Saudi Green Initiative and advances the city’s environmental sustainability goals.', NULL, 'https://www.nabatik.com/', NULL, 'Makkah', ARRAY['Climate Tech & Energy', 'Agriculture & Food Security'], ARRAY['SDG 13: Climate Action', 'SDG 15: Life on Land'], ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Tarahum (Nat''l C''ttee for Prisoners)', 'Impact Maker', 'Non-Profit / NGO', 'Tarahum, established in 2001 by a Council of Ministers decision, is a national committee that provides comprehensive care and support for prisoners, inmates in correctional facilities, released individuals, and their families across Saudi Arabia. Through programs focused on basic and family care, rehabilitation, empowerment, and financial assistance, it works to improve living conditions, prevent recidivism, and facilitate successful reintegration into society.', 'https://saudipedia.com/en/saudipediaen/uploads/images/2024/07/10/thumbs/400x400/96057.jpg', 'https://donate.trahum.org.sa/', NULL, 'Riyadh', ARRAY['""Social Inclusion (e.g.', 'people with disabilities', 'youth)""'], ARRAY['""SDG 16: Peace', 'Justice and Strong Institutions""'], ARRAY['Workshops & Training', 'Mentorship Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Taher', 'Impact Maker', 'Impact-Driven Startup, Social Enterprise', 'No description available', NULL, NULL, NULL, 'Makkah', ARRAY['Community Development', '""Social Inclusion (e.g.', 'people with disabilities', 'youth)""'], ARRAY['SDG 10: Reduced Inequalities', 'SDG 11: Sustainable Cities and Communities'], NULL, 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Ivvest', 'Capital Provider', 'Impact-Driven Startup, Venture Capital (VC)', 'Ivvest, founded in 2020, is a Saudi indoor farming solutions provider that transforms spaces into smart vertical farms powered by its proprietary operating system, IvvestOS. Through products like The Capsule—a modular, high-yield container farm—it delivers technology-driven, farm-to-table production solutions and maintains a strong presence in the Saudi market.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFfIzluGnBwYn1CBTAv7AqvOAqE5fFePooMw&s', 'https://ivvest.com/', NULL, 'Riyadh', ARRAY['Technology and Innovation', 'Agriculture & Food Security'], ARRAY['SDG 8: Decent Work and Economic Growth', '""SDG 9: Industry', 'Innovation and Infrastructure""'], ARRAY['Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Culture Development Fund', 'Capital Provider', 'Government Fund', 'No description available', NULL, 'https://cdf.gov.sa/', NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance', 'Acceleration Program', 'Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Tourism Development Fund', 'Capital Provider', 'Government Fund', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Workshops & Training', 'Ecosystem Events / Convening', 'Incubation Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Heritage Comission ', 'Policy & Ecosystem', 'Government Agency', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Workshops & Training', 'Acceleration Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Ministry of Enviroment, Water & Agriculture ', 'Policy & Ecosystem', 'Government Ministry', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Mentorship Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Ministry of Industry & Mineral Resources ', 'Policy & Ecosystem', 'Government Ministry', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Acceleration Program', 'Incubation Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('KACST', 'Intermediary & Enablers', 'Government Agency', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Water Authority ', 'Policy & Ecosystem', 'Government Agency', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Research, Development & Innovation Authority', 'Policy & Ecosystem', 'Research Institute / Think Tank, Government Agency', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Grant Program', 'Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('National Technology Development Program', 'Capital Provider', 'Government Agency, Accelerator', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Mentorship Program', 'Workshops & Training', 'Technical Assistance', 'Grant Program', 'Acceleration Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Social Development Bank', 'Capital Provider', 'Impact Fund', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('SME Bank', 'Capital Provider, Intermediary & Enablers', 'Impact Fund', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Agricultural Development Fund', 'Capital Provider', 'Government Fund', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Industrial Development Fund', 'Capital Provider', 'Government Fund', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Acceleration Program', 'Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Export Development Authority', 'Intermediary & Enablers', 'Government Agency', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi NIH', 'Policy & Ecosystem', 'Research Institute / Think Tank, Government Agency', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Data & AI Authority ', 'Policy & Ecosystem', 'Government Agency', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Research & Publications'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Human Resources Development Fund (Hadaf)', 'Capital Provider', 'Government Agency', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance', 'Workshops & Training', 'Mentorship Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Standards', 'Intermediary & Enablers', 'Service Provider, Government Agency', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Authority for Intellectual Property ', 'Policy & Ecosystem', 'Government Agency', 'The Saudi Authority for Intellectual Property (SAIP) is the government body responsible for regulating and protecting intellectual property rights in Saudi Arabia', NULL, NULL, NULL, 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Research & Publications'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('National eLearning Center', 'Intermediary & Enablers', 'Government Agency', 'The National eLearning Center (NeLC) is an independent institution established by the Council of Ministers in Saudi Arabia. Its primary objectives are to enhance trust in e-learning, facilitate equitable access to lifelong learning, and promote sustainable innovation in the digital education sector. The NeLC aims to provide a reliable online learning environment, ensuring high-quality e-learning programs and services that meet the needs of learners and the labor market.', NULL, NULL, NULL, 'Riyadh', ARRAY['Education & EdTech'], NULL, ARRAY['Workshops & Training'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('NEOM', 'Impact Maker', 'Government Fund, Corporate Venture Capital (CVC)', 'Neom is a futuristic, high-tech planned mega-development in Saudi Arabia designed to diversify the country''s oil-dependent economy. Launched in 2017, it aims to create a sustainable region powered by 100% renewable energy and is part of Saudi Arabia''s Vision 2030 initiative. Neom is envisioned as an entirely new city that will redefine urban living and is backed by a $500 billion investment.', NULL, NULL, NULL, 'Riyadh', ARRAY['Smart Cities & Urban Development'], NULL, ARRAY['Corporate Challenge / Prize'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Ministry of Communications and Information Technology (MCIT)', 'Policy & Ecosystem', 'Government Ministry', 'The Ministry of Communications and Information Technology (MCIT) in Saudi Arabia is responsible for regulating all means of telecommunications and information technology in the Kingdom. Its mission includes building a prosperous digital society by developing skills and empowering national capacities to accelerate digital transformation, contributing to the Kingdom''s Vision 2030.', NULL, NULL, NULL, 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Acceleration Program', 'Ecosystem Events / Convening'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Business Center', 'Intermediary & Enablers', 'Government Agency', 'The Saudi Business Center (SBC) is a government initiative aimed at facilitating the procedures for starting, conducting, and closing economic businesses in Saudi Arabia. It provides comprehensive services to investors and entrepreneurs, ensuring compliance with international best practices. The center was established to create an attractive business environment, enhance competitiveness, and support economic growth in the Kingdom. It offers services such as company registration, commercial license issuance, and simplifies the overall business setup process for both local and foreign investors.', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('General Authority of Statistics ', 'Policy & Ecosystem', 'Government Agency', 'The General Authority for Statistics (GASTAT) is the official statistical reference for the Kingdom of Saudi Arabia. It is responsible for conducting statistical work, providing accurate and updated data and indicators, and overseeing the statistical sector. GASTAT''s tasks include designing and implementing field surveys, conducting statistical studies, and ensuring the quality of statistical data. For more information, you can visit their official website.', NULL, NULL, NULL, 'Riyadh', ARRAY['Community Development'], NULL, ARRAY['Research & Publications'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('King Khalid University', 'Intermediary & Enablers', 'University / Education Program', 'King Khalid University is a public university located in Abha, Saudi Arabia, established in 1998 through the merger of Imam Mohammad Ibn Saud Islamic University and King Saud University. The university is named after King Khalid bin Abdulaziz, who was the ruler of Saudi Arabia from 1975 to 1982. It serves over 80,000 students across 29 colleges and is committed to global leadership and regional development, aligning with Saudi Vision 2030. The university aims to enhance higher education accessibility and contribute to the academic and intellectual growth of its students.', NULL, NULL, NULL, 'Riyadh', ARRAY['Education & EdTech'], NULL, ARRAY['Research & Publications', 'Fellowship'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Ministry of National Gaurd - Health Affairs', 'Policy & Ecosystem', 'Government Ministry', 'The Ministry of National Guard Health Affairs (MNGHA) is a government-funded healthcare system in Saudi Arabia, established in 1982. It is affiliated with the Ministry of National Guard and provides a wide range of healthcare services, including primary care, specialized care, and research. MNGHA operates multiple medical campuses across the country, including in Riyadh, Jeddah, Al-Ahsa, Dammam, and Medina, and is recognized for its advanced medical technology and patient-centered care approaches. The organization also plays a significant role in medical education and research, contributing to the development of healthcare in the region.', NULL, NULL, NULL, 'Riyadh', ARRAY['Healthcare & Wellness'], NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('National Platform', 'Intermediary & Enablers', 'Service Provider', 'The National Platform refers to a unified system in Saudi Arabia that facilitates access to government services and information for citizens, residents, and businesses. It serves as a primary reference point for digital government services, making it easier for users to find and utilize various e-services. The platform is designed to provide a user-friendly experience and centralize government services through multiple channels, ensuring efficient access to information and services.', NULL, NULL, NULL, 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Modon', 'Policy & Ecosystem', 'Government Agency', 'MODON is the Saudi Authority for Industrial Cities and Technology Zones, established in 2001. It is responsible for developing integrated serviced industrial lands across the Kingdom, contributing to the diversification of the national economy and creating job opportunities. MODON provides various services, including industrial land, ready-built factories, and logistics products, aimed at empowering both local and foreign private sectors.', NULL, NULL, NULL, 'Riyadh', ARRAY['Smart Cities & Urban Development'], NULL, ARRAY['Technical Assistance', 'Acceleration Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Ministry of Health', 'Policy & Ecosystem', 'Government Ministry', 'A Ministry of Health is a government department responsible for overseeing a country''s healthcare system and public health. It acts as the central authority for public health policy, ensuring that citizens have access to quality medical care, disease prevention programs, and health education. Additionally, it is dedicated to safeguarding and enhancing the well-being of the population through various health initiatives and resource management.', NULL, NULL, NULL, 'Riyadh', ARRAY['Healthcare & Wellness'], NULL, ARRAY['Technical Assistance', 'Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Real Estate General Authority', 'Policy & Ecosystem', 'Government Agency', 'The Real Estate General Authority (REGA) is a Saudi government agency established in 2017 to regulate and enhance the country’s real estate industry. Its main objectives are to stimulate investment, provide consumer protection, and ensure market transparency. REGA is headquartered in Riyadh and is administrated by a board of directors chaired by the Minister of Housing. The authority is responsible for formulating policies, establishing regulations, and implementing the real estate registry system. It also oversees the real estate sector through various programs and initiatives, including Mullak, Ejar, Real Estate Units Subdivision, Wafi, the Real Estate Institute, the Val Real Estate License, the Saudi Center for Real Estate Arbitration, and partner services. REGA plays a vital role in the Kingdom''s Vision 2030 strategy, aiming to create a sustainable and trustworthy real estate environment that attracts both local and international investors.', NULL, NULL, NULL, 'Riyadh', ARRAY['Smart Cities & Urban Development'], NULL, ARRAY['Research & Publications'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('The Saudi Industrial Development Fund (SIDF)', 'Capital Provider', 'Government Agency', 'The Saudi Industrial Development Fund (SIDF) is a government financial institution established in 1974 to support industrial development in Saudi Arabia. Its primary mission is to provide financial and advisory support to the industrial sector, including financing for various projects and initiatives aimed at enhancing the competitiveness of the local economy. SIDF plays a crucial role in promoting investment in priority sectors such as manufacturing, mining, and logistics, and it assists foreign investors by offering long-term loans and advisory services.', NULL, NULL, NULL, 'Riyadh', ARRAY['Circular Economy'], NULL, ARRAY['Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Ministry of Energy', 'Policy & Ecosystem', 'Government Ministry', 'A ministry of energy is a government department that oversees the production of fuel and electricity. In some countries, it also manages nuclear weapons development and conducts energy-related research and development. For example, in Pakistan, the Ministry of Energy is responsible for implementing the national energy policy and managing energy production and electricity transmission.', NULL, NULL, NULL, 'Riyadh', ARRAY['Climate Tech & Energy'], NULL, ARRAY['Research & Publications', 'Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Impact Hub Riyadh ', 'Intermediary & Enablers', 'Co-working Space / Hub, Accelerator', 'Impact Hub Riyadh is a global network focused on fostering impact-driven entrepreneurship. It aims to create a vibrant community where individuals and companies can collaborate to solve significant challenges and drive positive social and environmental change. The hub offers various services, including co-working spaces, innovation labs, and incubation programs, designed to support entrepreneurs in their journey from idea to launch. Impact Hub Riyadh emphasizes collaboration, creativity, and the empowerment of changemakers to build sustainable businesses that contribute to a more resilient society.', NULL, NULL, NULL, 'Riyadh', ARRAY['""Social Inclusion (e.g.', 'people with disabilities', 'youth)""', 'Technology and Innovation'], NULL, ARRAY['Incubation Program', 'Acceleration Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Wamda', 'Capital Provider', 'Media & Events Platform, Venture Capital (VC)', 'Wamda is an entrepreneurship empowering platform that accelerates the entrepreneurship ecosystem across the Middle East and North Africa (MENA) region. It focuses on providing support to entrepreneurs through various channels, including a media site, a leading early-stage investment fund, and programs like the Mix N'' Mentor event series. Wamda aims to fill gaps in the emerging MENA ecosystem by offering resources, knowledge, and community development services to help entrepreneurs succeed.', NULL, NULL, NULL, 'Riyadh', ARRAY['Technology and Innovation'], NULL, ARRAY['Acceleration Program', 'Mentorship Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Arabian Monetary Agency (SAMA)', 'Policy & Ecosystem', 'Government Agency', 'The Saudi Arabian Monetary Agency (SAMA), now known as the Saudi Central Bank, is the central bank of Saudi Arabia, established in 1952. It is responsible for managing the country''s monetary policy, regulating the banking and financial sectors, and ensuring financial stability. SAMA oversees the issuance and stabilization of the Saudi Riyal, supervises banks and financial institutions, and plays a crucial role in controlling inflation and promoting economic growth in the kingdom.', NULL, NULL, NULL, 'Riyadh', ARRAY['Financial Inclusion & FinTech'], NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Arabian General Investment Authority (SAGIA)', 'Intermediary & Enablers', 'Government Agency', 'The Saudi Arabian General Investment Authority (SAGIA) is the official investment promotion agency of Saudi Arabia, established in 2000. Its primary functions include:
-Promoting and facilitating investment opportunities within the Kingdom, attracting both local and foreign investments.
-Ensuring compliance with regulatory frameworks to create a favorable environment for investors.
-Driving economic diversification in alignment with Saudi Arabia''s Vision 2030 goals.
In 2020, SAGIA was elevated to a ministerial status, becoming the Ministry of Investment (MISA), which aims to streamline investment processes and enhance the quality of services offered to investors.
', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Ecosystem Events / Convening'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Tasamy', 'Impact Maker', 'Non-Profit / NGO', 'Tasamy is a non-profit organization that focuses on finding sustainable and innovative business solutions to societal problems. It enables social entrepreneurs and collaborates with governmental and private institutions to address social challenges. Tasamy supports social entrepreneurship through various pillars, including accelerators and incubators, training and education, social innovation, and impact investing.', NULL, NULL, NULL, 'Riyadh', ARRAY['Community Development', '""Social Inclusion (e.g.', 'people with disabilities', 'youth)""'], NULL, ARRAY['Mentorship Program', 'Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Ashoka ', 'Intermediary & Enablers', 'Foundation / Philanthropy', 'No description available', NULL, NULL, NULL, 'Riyadh', ARRAY['""Social Inclusion (e.g.', 'people with disabilities', 'youth)""'], NULL, ARRAY['Mentorship Program', 'Fellowship'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('SEA Ventures', 'Intermediary & Enablers', 'Venture Capital (VC)', 'No description available', NULL, 'https://www.seavent.org/', NULL, 'Riyadh', NULL, NULL, ARRAY['Mentorship Program', 'Incubation Program', 'Acceleration Program', 'Workshops & Training', 'Technical Assistance', 'Ecosystem Events / Convening'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Roqqi', 'Intermediary & Enablers', 'Consulting Firm', 'No description available', NULL, 'https://roqqi.sa/impact-measurement/', NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('3i Holding', 'Capital Provider', 'Impact Fund', 'No description available', NULL, NULL, NULL, 'Makkah', NULL, NULL, ARRAY['Technical Assistance', 'Incubation Program', 'Acceleration Program', 'Grant Program', 'Ecosystem Events / Convening'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Alwaleed Philanthropies', 'Impact Maker', 'Non-Profit / NGO', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, ARRAY['SDG 4: Quality Education', 'SDG 5: Gender Equality', 'SDG 7: Affordable and Clean Energy', 'SDG 12: Responsible Consumption and Production', 'SDG 13: Climate Action', 'SDG 15: Life on Land', '""SDG 16: Peace', 'Justice and Strong Institutions""', 'SDG 17: Partnerships for the Goals'], ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Community Jameel', 'Capital Provider', 'Foundation / Philanthropy', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance', 'Grant Program', 'Ecosystem Events / Convening'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('House of Social Enterprise B.V', 'Intermediary & Enablers', 'Consulting Firm', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Technical Assistance'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Sedco Holding', 'Capital Provider', 'Grant-Making Organization', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Grant Program'], 'active');
INSERT INTO organizations (name, type, sub_type, description, logo_url, website, linkedin_url, region, sector_focus, sdg_focus, services, status) VALUES
('Saudi Awwal Bank', 'Capital Provider', 'Impact Fund', 'No description available', NULL, NULL, NULL, 'Riyadh', NULL, NULL, ARRAY['Grant Program'], 'active');

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
