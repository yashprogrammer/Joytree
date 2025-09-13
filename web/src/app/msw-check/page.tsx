"use client";
import { useEffect, useState } from "react";

type Gift = { id: string; title: string };

export default function MswCheckPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [campaignTitle, setCampaignTitle] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/api/campaigns/diwali-2025/gifts")
      .then((r) => r.json())
      .then((data) => {
        setGifts(data.gifts ?? []);
        setCampaignTitle(data.campaign?.title ?? "");
      })
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">MSW Check</h1>
      {error && <p className="text-red-600">{error}</p>}
      <p className="text-sm text-gray-500">Campaign: {campaignTitle || "(loading)"}</p>
      <ul className="list-disc pl-6">
        {gifts.map((g) => (
          <li key={g.id}>{g.title}</li>
        ))}
      </ul>
    </div>
  );
}


