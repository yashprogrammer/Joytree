import fs from "fs/promises";
import path from "path";

type OrderInput = {
  campaignSlug: string;
  giftId: string;
  selectedGiftType?: "physical" | "digital";
  employee: { name?: string; email?: string; empId?: string; mobile: string };
  address?: { line1: string; line2?: string; city: string; state: string; pincode: string };
  // Optional enrichment fields
  giftTitle?: string;
  giftImageUrl?: string;
};

type AppendOrderParams = OrderInput & { id: string; createdAt: string };

function getCsvPath(): string {
  // Write to project root (one level up from web/)
  return path.join(process.cwd(), "..", "orders.csv");
}

function escapeCsv(value: unknown): string {
  const str = String(value ?? "");
  return '"' + str.replace(/"/g, '""') + '"';
}

export const CSV_HEADERS = [
  "orderId",
  "createdAt",
  "campaignSlug",
  "giftId",
  "giftTitle",
  "giftImageUrl",
  "selectedGiftType",
  "employeeName",
  "employeeEmail",
  "employeeEmpId",
  "employeeMobile",
  "addressLine1",
  "addressLine2",
  "addressCity",
  "addressState",
  "addressPincode",
] as const;

async function ensureHeader(csvPath: string): Promise<void> {
  try {
    await fs.access(csvPath);
  } catch {
    const headerLine = CSV_HEADERS.join(",") + "\n";
    await fs.writeFile(csvPath, headerLine, { encoding: "utf-8" });
  }
}

export async function appendOrderToCsv(order: AppendOrderParams): Promise<void> {
  const csvPath = getCsvPath();
  await ensureHeader(csvPath);
  const row: Record<(typeof CSV_HEADERS)[number], string | number | undefined> = {
    orderId: order.id,
    createdAt: order.createdAt,
    campaignSlug: order.campaignSlug,
    giftId: order.giftId,
    giftTitle: order.giftTitle,
    giftImageUrl: order.giftImageUrl,
    selectedGiftType: order.selectedGiftType,
    employeeName: order.employee?.name,
    employeeEmail: order.employee?.email,
    employeeEmpId: order.employee?.empId,
    employeeMobile: order.employee?.mobile,
    addressLine1: order.address?.line1,
    addressLine2: order.address?.line2,
    addressCity: order.address?.city,
    addressState: order.address?.state,
    addressPincode: order.address?.pincode,
  };
  const line = CSV_HEADERS.map((h) => escapeCsv(row[h])).join(",") + "\n";
  await fs.appendFile(csvPath, line, { encoding: "utf-8" });
}

export async function readOrdersCsv(): Promise<string | null> {
  const csvPath = getCsvPath();
  try {
    const content = await fs.readFile(csvPath, { encoding: "utf-8" });
    return content;
  } catch {
    return null;
  }
}

export function emptyOrdersCsv(): string {
  return CSV_HEADERS.join(",") + "\n";
}


