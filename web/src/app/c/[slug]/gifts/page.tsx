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

  // Landscape placement controls (percentages of container width/height)
  const standLeftPercents = [17, 38.5, 60, 82];
  const standTopPercents = [25, 25, 25, 25]; // adjust each entry to fine-tune vertical alignment

  return (
    <div className="relative min-h-screen bg-[url('/bg.jpeg')] bg-cover bg-center">
      {/* Centered heading, a bit lower */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[8vh] text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Choose your gift</h1>
      </div>

      {/* Landscape precise placement over stands */}
      <div className="hidden landscape:block">
        {displayGifts.map((g, i) => {
          const left = `${standLeftPercents[i] ?? 18}%`;
          const top = `${standTopPercents[i] ?? 25}%`;
          return (
            <div key={g.id} className="absolute -translate-x-1/2" style={{ left, top }}>
              <button onClick={() => onSelect(g)} aria-label={`Select gift ${g.title}`} className="group block text-center focus:outline-none">
                <div className="mx-auto rounded aspect-square w-[clamp(120px,17vw,280px)] grid place-items-center">
                  {g.imageUrl ? <img src={g.imageUrl} alt="" className="object-contain w-[95%] h-[95%]" /> : null}
                </div>
                <div className="mt-4 md:mt-5 text-[11px] md:text-sm font-medium text-gray-900 max-w-[clamp(120px,17vw,220px)] mx-auto">
                  {g.title}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Portrait fallback: simple grid (orientation guard should keep users in landscape) */}
      <div className="p-6 grid gap-6 landscape:hidden">
        <div className="grid gap-2 text-center">
          <h2 className="text-xl font-bold">Choose your gift</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
          {displayGifts.map((g) => (
            <GiftCard key={g.id} title={g.title} imageUrl={g.imageUrl} onSelect={() => onSelect(g)} />
          ))}
        </div>
      </div>
    </div>
  );
}


