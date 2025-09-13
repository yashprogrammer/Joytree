import { http, HttpResponse } from "msw";
import { campaigns, gifts, employees, orders, tokenToEmployeeId } from "./db";

export const handlers = [
  http.post("/api/auth/request-otp", async () => {
    return HttpResponse.json({ success: true });
  }),

  http.post("/api/auth/verify-otp", async ({ request }) => {
    const { mobile, code } = (await request.json()) as { mobile: string; code: string };
    if (code !== "123456") {
      return HttpResponse.json({ error: "INVALID_CODE" }, { status: 401 });
    }
    // Ensure employee exists
    let employee = employees.find((e) => e.mobile === mobile);
    if (!employee) {
      employee = { id: `emp_${employees.length + 1}`, mobile };
      employees.push(employee);
    }
    const token = `t_${Math.random().toString(36).slice(2)}`;
    tokenToEmployeeId.set(token, employee.id);
    return HttpResponse.json({ token });
  }),

  http.post("/api/auth/verify-email", async () => {
    return HttpResponse.json({ success: true });
  }),

  http.get("/api/campaigns/:slug/gifts", async ({ params }) => {
    const { slug } = params as { slug: string };
    const existing = campaigns.find((c) => c.slug === slug);
    const campaign = existing ?? { id: `mock_${slug}`, slug, title: slug, companyId: "c1", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" };
    const campaignGifts = existing ? gifts.filter((g) => g.campaignId === campaign.id) : gifts;
    return HttpResponse.json({ gifts: campaignGifts, campaign });
  }),

  http.post("/api/orders", async ({ request }) => {
    const body = (await request.json()) as {
      campaignSlug: string;
      giftId: string;
      employee: { name: string; email: string; empId?: string; mobile: string };
      address?: { line1: string; line2?: string; city: string; state: string; pincode: string };
    };
    const { campaignSlug, giftId, employee, address } = body;
    const campaign = campaigns.find((c) => c.slug === campaignSlug);
    if (!campaign) return HttpResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    const gift = gifts.find((g) => g.id === giftId && g.campaignId === campaign.id);
    if (!gift) return HttpResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    // ensure employee exists
    let existing = employees.find((e) => e.mobile === employee.mobile);
    if (!existing) {
      existing = { id: `emp_${employees.length + 1}`, mobile: employee.mobile, email: employee.email, name: employee.name, empId: employee.empId };
      employees.push(existing);
    }

    // duplicate rule: one order per employee per campaign
    const dup = orders.find((o) => o.employeeId === existing!.id && o.campaignId === campaign!.id);
    if (dup) {
      return HttpResponse.json({ error: "DUPLICATE_ORDER" }, { status: 409 });
    }

    const orderId = `ord_${orders.length + 1}`;
    orders.push({
      id: orderId,
      campaignId: campaign.id,
      employeeId: existing.id,
      giftId: gift.id,
      address: gift.type === "physical" ? address ?? undefined : undefined,
      status: "PLACED",
      createdAt: new Date().toISOString(),
    });
    return HttpResponse.json({ orderId });
  }),

  http.get("/api/orders", async () => {
    return HttpResponse.json({ orders });
  }),

  http.get("/api/orders/:id", async ({ params }) => {
    const { id } = params as { id: string };
    const order = orders.find((o) => o.id === id);
    if (!order) return HttpResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    const gift = gifts.find((g) => g.id === order.giftId)!;
    const campaign = campaigns.find((c) => c.id === order.campaignId)!;
    return HttpResponse.json({ ...order, gift, campaign });
  }),
];



