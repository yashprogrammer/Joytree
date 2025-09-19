import { orderInputSchema } from "@/lib/validators";
import { appendOrderToCsv } from "@/lib/csv-server";
import { campaigns, gifts } from "@/mocks/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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

    await appendOrderToCsv({
      id: orderId,
      createdAt,
      campaignSlug: input.campaignSlug,
      giftId: input.giftId,
      selectedGiftType: input.selectedGiftType,
      employee: input.employee,
      address: input.address,
      giftTitle: gift?.title,
    });

    return Response.json({ orderId });
  } catch (err) {
    return Response.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ orders: [] });
}


