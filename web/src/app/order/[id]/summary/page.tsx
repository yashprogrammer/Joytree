"use client";
import { useEffect, useState } from "react";

export default function OrderSummaryPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(String(e)));
  }, [params.id]);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Order Summary</h1>
      {error ? <p className="text-red-600">{error}</p> : null}
      {!data ? <p>Loading...</p> : (
        <div className="mt-4 text-sm grid gap-1">
          <div>Order ID: {data.id}</div>
          <div>Gift: {data.gift?.title}</div>
          <div>Campaign: {data.campaign?.title}</div>
          <div>Status: {data.status}</div>
        </div>
      )}
    </div>
  );
}


