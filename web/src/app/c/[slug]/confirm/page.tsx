"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/session";
// import { apiPost } from "@/lib/api";

type OrderInput = {
  campaignSlug: string;
  giftId: string;
  selectedGiftType?: "physical" | "digital";
  employee: { name: string; email: string; empId?: string; mobile: string };
  address?: { line1: string; line2?: string; city: string; state: string; pincode: string };
};

export default function ConfirmPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
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
    return raw ? (JSON.parse(raw) as { id: string; type: "physical" | "digital" }) : null;
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
        } as any;
        window.localStorage.setItem(`joytree_order_${mockId}`, JSON.stringify(order));
      }
      router.push(`/order/${mockId}/summary`);
    } catch (e: any) {
      setError(e?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 grid gap-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Confirm your details</h1>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-2">
        <h2 className="text-lg font-semibold">Employee</h2>
        <div className="text-sm">Name: {employee?.name}</div>
        <div className="text-sm">Email: {employee?.email}</div>
        {employee?.empId ? <div className="text-sm">Employee ID: {employee.empId}</div> : null}
        <div className="text-sm">Mobile: {employee?.mobile}</div>
      </div>

      <div className="grid gap-2">
        <h2 className="text-lg font-semibold">Gift</h2>
        <div className="text-sm">Gift ID: {gift?.id}</div>
        <div className="text-sm">Type: {gift?.type}</div>
      </div>

      {gift?.type === "physical" && address ? (
        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Address</h2>
          <div className="text-sm">{address.recipientName} ({address.phone})</div>
          {address.email ? <div className="text-sm">{address.email}</div> : null}
          <div className="text-sm">{address.line1}</div>
          {address.line2 ? <div className="text-sm">{address.line2}</div> : null}
          <div className="text-sm">{address.city}, {address.state} {address.pincode}</div>
          <div className="text-sm">{address.country}</div>
          {address.landmark ? <div className="text-sm">Landmark: {address.landmark}</div> : null}
          {address.alternatePhone ? <div className="text-sm">Alt Phone: {address.alternatePhone}</div> : null}
          {address.addressType ? <div className="text-sm">Type: {address.addressType}</div> : null}
        </div>
      ) : null}

      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded" onClick={() => router.push(`/c/${slug}/gifts`)}>Back</button>
        <button className="px-3 py-2 border rounded bg-black text-white disabled:opacity-50" onClick={placeOrder} disabled={loading}>
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}


