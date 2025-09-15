"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { waitForMocksReady } from "@/mocks/browser";
import { getToken } from "@/lib/session";
import GiftCard from "@/components/GiftCard";
// GiftModal removed in favor of dedicated details page

type Gift = { id: string; title: string; imageUrl?: string; description?: string; type: "physical" | "digital" };
type Campaign = { id: string; slug: string; title: string; videoUrl?: string };

export default function GiftsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  // selection modal state removed

  // Auth guard
  useEffect(() => {
    const token = getToken();
    if (!token) router.replace(`/c/${slug}/auth`);
  }, [router, slug]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      await waitForMocksReady();
      if (cancelled) return;
      apiGet<{ gifts: Gift[]; campaign: Campaign }>(`/api/campaigns/${slug}/gifts`)
        .then((d) => {
          if (cancelled) return;
          setGifts(d.gifts || []);
          setCampaign(d.campaign || null);
        })
        .catch(() => {
          if (cancelled) return;
          setGifts([]);
          setCampaign(null);
        });
    };
    run();
    return () => { cancelled = true; };
  }, [slug]);

  // Auto scroll to bottom once gifts are loaded
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!gifts || gifts.length === 0) return;
    try {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    } catch {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  }, [gifts]);

  const onSelect = (gift: Gift) => {
    router.push(`/c/${slug}/gifts/${gift.id}`);
  };

  const onConfirm = () => {};

  // Use Front.jpg images from public/Products for the first four gifts
  const frontImages = [
    "/Products/Calander/Front.jpg",
    "/Products/Eye%20Massager/Front.jpg",
    "/Products/Smart%20watch/Front.jpg",
    "/Products/Water%20bottle/front.jpg",
  ];

  const displayGifts = gifts.slice(0, 4).map((g, i) => ({
    ...g,
    imageUrl: frontImages[i],
  }));

  return (
    <div className="p-6 grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-2xl font-bold">Choose your gift</h1>
        {campaign?.title ? <p className="text-sm text-gray-600">Campaign: {campaign.title}</p> : null}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 justify-items-center">
        {displayGifts.map((g) => (
          <GiftCard
            key={g.id}
            title={g.title}
            imageUrl={g.imageUrl}
            onSelect={() => onSelect(g)}
          />
        ))}
      </div>

      {/* Modal removed; dedicated details page handles confirmation */}
    </div>
  );
}


