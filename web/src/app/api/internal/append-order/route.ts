import { appendOrderToCsv } from "@/lib/csv-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Best-effort append; assume body comes from trusted MSW handler
    const { id, createdAt, campaignSlug, giftId, selectedGiftType, employee, address, giftTitle, giftImageUrl } = body as {
      id: string;
      createdAt: string;
      campaignSlug: string;
      giftId: string;
      selectedGiftType?: "physical" | "digital";
      employee: { name?: string; email?: string; empId?: string; mobile: string };
      address?: { line1: string; line2?: string; city: string; state: string; pincode: string };
      giftTitle?: string;
      giftImageUrl?: string;
    };

    if (!id || !createdAt || !campaignSlug || !giftId || !employee?.mobile) {
      return Response.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
    }

    await appendOrderToCsv({ id, createdAt, campaignSlug, giftId, selectedGiftType, employee, address, giftTitle, giftImageUrl });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}


