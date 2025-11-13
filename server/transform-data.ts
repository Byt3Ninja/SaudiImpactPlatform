import type { InsertOrganization } from "@shared/schema";
import { readFileSync } from "fs";
import { join } from "path";

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

function parseSaudiRegion(location: string): string {
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
  if (locationLower.includes("bahah")) return "Al Bahah";
  if (locationLower.includes("jawf")) return "Al Jawf";
  
  return "Riyadh";
}

function parseArrayField(field: string): string[] | undefined {
  if (!field || field.trim() === "") return undefined;
  
  return field
    .split(",")
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

function cleanSubType(subType: string): string {
  return subType.replace(/^["']+|["']+$/g, '').trim();
}

export function transformOrganizations(jsonPath: string): InsertOrganization[] {
  const rawData = JSON.parse(
    readFileSync(jsonPath, "utf-8")
  ) as RawOrganizationData[];

  return rawData.map((raw) => {
    const organization: InsertOrganization = {
      name: raw.Name,
      type: raw.Type || "Private Sector",
      subType: cleanSubType(raw["Sub-Type"]),
      description: raw.Description,
      region: parseSaudiRegion(raw.Location),
      website: raw.Website_URL || undefined,
      linkedinUrl: raw.LinkedIn_URL || undefined,
      logoUrl: raw.Logo_URL || undefined,
      sectorFocus: parseArrayField(raw.Sector_Focus),
      sdgFocus: parseArrayField(raw.SDG_Focus),
      services: parseArrayField(raw["Organization Service"]),
      status: raw.Status === "Done" ? "Active" : raw.Status,
    };

    return organization;
  });
}

export function loadOrganizationsFromJSON(): InsertOrganization[] {
  const jsonPath = join(process.cwd(), "attached_assets", "tableConvert.com_57fv6k_1763052164626.json");
  return transformOrganizations(jsonPath);
}
