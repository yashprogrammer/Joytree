"use client";
import { useEffect, useMemo, useState } from "react";

type CsvRow = Record<string, string>;

function parseCsv(text: string): CsvRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = lines[0].split(",");
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (inQuotes) {
        if (char === '"') {
          if (line[j + 1] === '"') {
            current += '"';
            j++; // skip escaped quote
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          values.push(current);
          current = "";
        } else {
          current += char;
        }
      }
    }
    values.push(current);
    const row: CsvRow = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<CsvRow[]>([]);
  useEffect(() => {
    fetch("/api/admin/orders.csv")
      .then((r) => r.text())
      .then((t) => setRows(parseCsv(t)))
      .catch(() => setRows([]));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin: Orders</h1>
      <div className="my-4">
        <a
          href="/api/admin/orders.csv"
          download
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
            <th className="border px-2 py-1 text-left">Mobile</th>
            <th className="border px-2 py-1 text-left">Gift</th>
            <th className="border px-2 py-1 text-left">Type</th>
            <th className="border px-2 py-1 text-left">Address</th>
            <th className="border px-2 py-1 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const addressParts = [
              r.addressLine1,
              r.addressLine2,
              r.addressCity,
              r.addressState,
              r.addressPincode,
            ].filter(Boolean);
            const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : "-";
            
            return (
              <tr key={`${r.orderId || idx}`}>
                <td className="border px-2 py-1">{r.orderId}</td>
                <td className="border px-2 py-1">{r.campaignSlug}</td>
                <td className="border px-2 py-1">{r.employeeName}</td>
                <td className="border px-2 py-1">{r.employeeMobile}</td>
                <td className="border px-2 py-1">{r.giftTitle || r.giftId}</td>
                <td className="border px-2 py-1">{r.selectedGiftType}</td>
                <td className="border px-2 py-1 max-w-xs">{fullAddress}</td>
                <td className="border px-2 py-1">{r.createdAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


