import { getAllOrders } from "@/lib/db";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const rows = await getAllOrders();
  const records = rows.map((r) => ({
    orderId: r.id,
    createdAt: r.created_at,
    campaignSlug: r.campaign_slug,
    giftId: r.gift_id,
    giftTitle: r.gift_title,
    giftImageUrl: r.gift_image_url,
    selectedGiftType: r.selected_gift_type,
    employeeName: r.employee_name,
    employeeEmail: r.employee_email,
    employeeEmpId: r.employee_emp_id,
    employeeMobile: r.employee_mobile,
    addressLine1: r.address_line1,
    addressLine2: r.address_line2,
    addressCity: r.address_city,
    addressState: r.address_state,
    addressPincode: r.address_pincode,
  }));
  const headers = [
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
  ];
  const body = records.length === 0 ? `${headers.join(",")}\n` : toCsv(records);
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=orders.csv",
      "Cache-Control": "no-store",
    },
  });
}


