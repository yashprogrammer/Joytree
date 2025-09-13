"use client";
import { useEffect, useState } from "react";

export default function OrderSummaryPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    // Try to read from local storage (mock order placed on confirm page)
    try {
      const local = typeof window !== "undefined" ? window.localStorage.getItem(`joytree_order_${params.id}`) : null;
      if (local) {
        setData(JSON.parse(local));
        return;
      }
    } catch {}
    // Fallback to API
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(String(e)));
  }, [params.id]);
  return (
    <div className="p-6 grid gap-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Thank you!</h1>
      <p className="text-sm text-gray-600">Your order has been placed successfully.</p>
      {error ? <p className="text-red-600">{error}</p> : null}
      {!data ? <p>Loading...</p> : (
        <div className="border rounded p-4 text-sm grid gap-1 text-gray-100">
          <div className="font-medium text-gray-300">Order ID</div>
          <div className="text-white">{data.id}</div>
          <div className="font-medium mt-2 text-gray-300">Gift</div>
          <div className="text-white">{data.gift?.title || data.giftId}</div>
          <div className="font-medium mt-2 text-gray-300">Campaign</div>
          <div className="text-white">{data.campaign?.title || data.campaignSlug}</div>
          <div className="font-medium mt-2 text-gray-300">Status</div>
          <div className="text-white">{data.status || "PLACED"}</div>
          {data.address ? (
            <>
              <div className="font-medium mt-2 text-gray-300">Shipping Address</div>
              {data.address.recipientName || data.address.phone ? (
                <div className="text-white">{data.address.recipientName} {data.address.phone ? `(${data.address.phone})` : ""}</div>
              ) : null}
              {data.address.email ? <div className="text-white">{data.address.email}</div> : null}
              {data.address.line1 ? <div className="text-white">{data.address.line1}</div> : null}
              {data.address.line2 ? <div className="text-white">{data.address.line2}</div> : null}
              <div className="text-white">{data.address.city}, {data.address.state} {data.address.pincode}</div>
              {data.address.country ? <div className="text-white">{data.address.country}</div> : null}
              {data.address.landmark ? <div className="text-white">Landmark: {data.address.landmark}</div> : null}
              {data.address.alternatePhone ? <div className="text-white">Alt Phone: {data.address.alternatePhone}</div> : null}
              {data.address.addressType ? <div className="text-white">Type: {data.address.addressType}</div> : null}
            </>
          ) : null}
        </div>
      )}
      <a className="px-3 py-2 border rounded w-fit" href="/">Go to home</a>
    </div>
  );
}


