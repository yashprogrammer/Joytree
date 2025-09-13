"use client";
import { useEffect, useMemo, useState } from "react";
import { toCsv } from "@/lib/csv";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/orders").then((r) => r.json()).then((d) => setOrders(d.orders ?? [])).catch(() => setOrders([]));
  }, []);

  const csv = useMemo(() => toCsv(orders), [orders]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin: Orders</h1>
      <div className="my-4">
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
          download="orders.csv"
          className="px-3 py-2 border rounded"
        >
          Download CSV
        </a>
      </div>
      <table className="w-full text-sm border">
        <thead className="bg-gray-50">
          <tr>
            <th className="border px-2 py-1 text-left">Order ID</th>
            <th className="border px-2 py-1 text-left">Campaign</th>
            <th className="border px-2 py-1 text-left">Employee</th>
            <th className="border px-2 py-1 text-left">Gift</th>
            <th className="border px-2 py-1 text-left">Status</th>
            <th className="border px-2 py-1 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="border px-2 py-1">{o.id}</td>
              <td className="border px-2 py-1">{o.campaignId}</td>
              <td className="border px-2 py-1">{o.employeeId}</td>
              <td className="border px-2 py-1">{o.giftId}</td>
              <td className="border px-2 py-1">{o.status}</td>
              <td className="border px-2 py-1">{o.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


