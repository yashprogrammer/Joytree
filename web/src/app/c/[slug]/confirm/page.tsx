"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/session";
// import { apiPost } from "@/lib/api";
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
      // Skip backend for now; generate a mock order id
      const mockId = `ord_${Math.random().toString(36).slice(2, 10)}`;
      // Persist a minimal order summary locally for the summary page
      if (typeof window !== "undefined") {
        const order: OrderInput & { id: string; status: string; campaign: { slug: string; title: string } } = {
          id: mockId,
          campaignSlug: slug,
          giftId: gift.id,
          selectedGiftType: gift.type,
          employee,
          address,
          // helpful extras for the summary screen
          status: "PLACED",
          campaign: { slug, title: slug },
        };
        window.localStorage.setItem(`joytree_order_${mockId}`, JSON.stringify(order));
      }
      router.push(`/order/${mockId}/summary`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to place order";
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
        <div className="grid gap-2 border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Employee</h2>
          <div className="text-sm text-gray-800">Name: {employee?.name}</div>
          <div className="text-sm text-gray-800">Email: {employee?.email}</div>
          {employee?.empId ? <div className="text-sm text-gray-800">Employee ID: {employee.empId}</div> : null}
          <div className="text-sm text-gray-800">Mobile: {employee?.mobile}</div>
        </div>

        <div className="grid gap-2 border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Gift</h2>
          {gift?.imageUrl ? (
            <div className="w-full aspect-square grid place-items-center bg-white border rounded">
              <img src={gift.imageUrl} alt="" className="object-contain" style={{ width: "70%", height: "70%" }} />
            </div>
          ) : null}
          {gift?.description ? (
            <p className="text-sm text-gray-700 leading-relaxed">{gift.description}</p>
          ) : null}
        </div>

        {gift?.type === "physical" && address ? (
          <div className="md:col-span-2 grid gap-2 border rounded-lg p-4 bg-white">
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

      <div className="flex gap-2">
        <button className="btn btn-outline-primary" onClick={() => router.push(`/c/${slug}/gifts`)}>Back</button>
        <button className="btn btn-primary disabled:opacity-50" onClick={placeOrder} disabled={loading}>
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}


