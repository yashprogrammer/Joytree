import { insertOrder } from "@/lib/db";

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

    await insertOrder({
      id,
      created_at: createdAt,
      campaign_slug: campaignSlug,
      gift_id: giftId,
      gift_title: giftTitle ?? null,
      gift_image_url: giftImageUrl ?? null,
      selected_gift_type: selectedGiftType ?? null,
      employee_name: employee?.name ?? null,
      employee_email: employee?.email ?? null,
      employee_emp_id: employee?.empId ?? null,
      employee_mobile: employee.mobile,
      address_line1: address?.line1 ?? null,
      address_line2: address?.line2 ?? null,
      address_city: address?.city ?? null,
      address_state: address?.state ?? null,
      address_pincode: address?.pincode ?? null,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}


