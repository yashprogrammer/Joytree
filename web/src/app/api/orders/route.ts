import { orderInputSchema } from "@/lib/validators";
import { campaigns, gifts } from "@/mocks/db";
import { insertOrder } from "@/lib/db";

export async function POST(request: Request) {
  console.log("🔵 POST /api/orders - Real API endpoint hit (not MSW)");
  try {
    const body = await request.json();
    console.log("📦 Order payload:", body);
    
    const parsed = orderInputSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "VALIDATION_ERROR", issues: parsed.error.flatten() }, { status: 400 });
    }
    const input = parsed.data;
    const orderId = `ord_${Math.random().toString(36).slice(2, 10)}`;
    const createdAt = new Date().toISOString();

    // Optional enrichment: map campaign slug to id, and gift title
    const campaign = campaigns.find((c) => c.slug === input.campaignSlug);
    const gift = gifts.find((g) => g.id === input.giftId && (!campaign || g.campaignId === campaign.id));

    const orderRecord = {
      id: orderId,
      created_at: createdAt,
      campaign_slug: input.campaignSlug,
      gift_id: input.giftId,
      gift_title: gift?.title ?? null,
      gift_image_url: gift?.imageUrl ?? null,
      selected_gift_type: input.selectedGiftType ?? null,
      employee_name: input.employee?.name ?? null,
      employee_email: input.employee?.email ?? null,
      employee_emp_id: input.employee?.empId ?? null,
      employee_mobile: input.employee.mobile,
      address_line1: input.address?.line1 ?? null,
      address_line2: input.address?.line2 ?? null,
      address_city: input.address?.city ?? null,
      address_state: input.address?.state ?? null,
      address_pincode: input.address?.pincode ?? null,
    };

    console.log("💾 Attempting to insert order into PostgreSQL:", orderId);
    await insertOrder(orderRecord);
    console.log("✅ Order successfully inserted into PostgreSQL:", orderId);

    return Response.json({ orderId });
  } catch (err) {
    console.error("❌ Error in POST /api/orders:", err);
    return Response.json({ error: "INTERNAL_ERROR", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ orders: [] });
}


