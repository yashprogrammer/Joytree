"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/session";
import type { Address } from "@/types";

type OrderInput = {
  campaignSlug: string;
  giftId: string;
  selectedGiftType?: "physical" | "digital";
  employee: { name: string; email: string; empId?: string; mobile: string };
  address?: Address;
};

export default function ConfirmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = getToken();
    if (!token) router.replace(`/c/${slug}/auth`);
  }, [router, slug]);

  const employee = useMemo(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("joytree_employee");
    return raw ? (JSON.parse(raw) as OrderInput["employee"]) : null;
  }, []);

  const gift = useMemo(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem("joytree_selected_gift");
    return raw ? (JSON.parse(raw) as { id: string; type: "physical" | "digital"; title?: string; imageUrl?: string; description?: string }) : null;
  }, []);

  const address = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const raw = window.localStorage.getItem("joytree_address");
    return raw ? (JSON.parse(raw) as OrderInput["address"]) : undefined;
  }, []);

  const placeOrder = async () => {
    if (!employee || !gift) return;
    setError("");
    setLoading(true);
    try {
      // Create order payload
      const orderPayload: OrderInput = {
        campaignSlug: slug,
        giftId: gift.id,
        selectedGiftType: gift.type,
        employee: employee,
        address: gift.type === "physical" ? address : undefined,
      };

      console.log("📤 Submitting order to API:", orderPayload);

      // Call the real API endpoint
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      const data = await response.json();
      const orderId = data.orderId;

      console.log("✅ Order placed successfully:", orderId);

      // Store order info in localStorage for the summary page
      const summaryData = {
        id: orderId,
        gift: { title: gift.title },
        giftId: gift.id,
        campaign: { title: undefined },
        campaignSlug: slug,
        status: "PLACED",
        address,
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`joytree_order_${orderId}`, JSON.stringify(summaryData));
      }

      router.push(`/order/${orderId}/summary`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to place order";
      console.error("❌ Order placement failed:", e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 grid gap-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Confirm your details</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Left column: Gift details */}
        <div className="grid gap-2 border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Gift</h2>
          {gift?.imageUrl ? (
            <div className="w-full aspect-square grid place-items-center bg-white  rounded">
              <img src={gift.imageUrl} alt="" className="object-contain rounded-2xl" style={{ width: "95%", height: "95%" }} />
            </div>
          ) : null}
          {gift?.description ? (
            <p className="text-sm text-gray-700 leading-relaxed">{gift.description}</p>
          ) : null}
        </div>

        {/* Right column: Employee + Address */}
        <div className="grid gap-4">
          <div className="flex flex-col gap-2 border rounded-lg p-4 bg-white">
            <h2 className="text-lg font-semibold text-gray-900">Employee</h2>
            <div className="text-sm text-gray-800">Name: {employee?.name}</div>
            <div className="text-sm text-gray-800">Email: {employee?.email}</div>
            {employee?.empId ? <div className="text-sm text-gray-800">Employee ID: {employee.empId}</div> : null}
            <div className="text-sm text-gray-800">Mobile: {employee?.mobile}</div>
          </div>

          {gift?.type === "physical" && address ? (
            <div className="grid gap-2 border rounded-lg p-4 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Address</h2>
              <div className="text-sm text-gray-800">{address.recipientName} ({address.phone})</div>
              {address.email ? <div className="text-sm text-gray-800">{address.email}</div> : null}
              <div className="text-sm text-gray-800">{address.line1}</div>
              {address.line2 ? <div className="text-sm text-gray-800">{address.line2}</div> : null}
              <div className="text-sm text-gray-800">{address.city}, {address.state} {address.pincode}</div>
              <div className="text-sm text-gray-800">{address.country}</div>
              {address.landmark ? <div className="text-sm text-gray-800">Landmark: {address.landmark}</div> : null}
              {address.alternatePhone ? <div className="text-sm text-gray-800">Alt Phone: {address.alternatePhone}</div> : null}
              {address.addressType ? <div className="text-sm text-gray-800">Type: {address.addressType}</div> : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn btn-outline-primary" onClick={() => router.push(`/c/${slug}/gifts`)}>Back</button>
        <button className="btn btn-primary disabled:opacity-50" onClick={placeOrder} disabled={loading}>
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}


