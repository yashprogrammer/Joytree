"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { waitForMocksReady } from "@/mocks/browser";
import { getToken } from "@/lib/session";
import GiftCard from "@/components/GiftCard";
import Image from "next/image";
// GiftModal removed in favor of dedicated details page

type Gift = { id: string; title: string; imageUrl?: string; description?: string; type: "physical" | "digital" };
type Campaign = { id: string; slug: string; title: string; videoUrl?: string };

export default function GiftsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  // selection modal state removed

  // Auth guard
  useEffect(() => {
    const token = getToken();
    if (!token) router.replace(`/c/${slug}/auth`);
  }, [router, slug]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
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
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
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
  const standLeftPercents = [19, 39, 59, 80];
  const standTopPercents = [25, 26, 25, 23.5]; // adjust each entry to fine-tune vertical alignment
  const standWidthPercents = [80, 80, 80, 80]; // width of each square tile as % of image width

  return (
    loading ? (
      <div className="min-h-screen grid place-items-center">
        <div className="flex items-center gap-3 text-gray-700">
          <span
            className="inline-block w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"
            aria-hidden
          />
          <span>Loading your joyful options</span>
        </div>
      </div>
    ) : (
    <div className="relative min-h-screen overflow-hidden">
      {/* Viewport-positioned heading */}
      <div className="fixed left-1/2 -translate-x-1/2 top-[clamp(24px,10vh,96px)] z-20 text-center px-4 pointer-events-none">
        <h1 className="font-bold text-[clamp(20px,4vh,32px)]">Choose your Gift</h1>
      </div>
      {/* Center frame that preserves BG aspect ratio and scales to fit viewport */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative aspect-[8/5]"
          style={{ width: "max(100vw, calc(100vh * 1.6))" }}
        >
          <Image src="/bg.jpeg" alt="" fill priority className="object-contain" />

          {/* Heading moved to viewport-fixed container */}

          {/* Landscape precise placement over stands within the frame */}
          <div className="hidden landscape:block">
            {displayGifts.map((g, i) => {
              const left = `${standLeftPercents[i] ?? 18}%`;
              const top = `${standTopPercents[i] ?? 25}%`;
              const width = `${standWidthPercents[i] ?? 17}%`;
              return (
                <div key={g.id} className="absolute -translate-x-1/2" style={{ left, top }}>
                  <button onClick={() => onSelect(g)} aria-label={`Select gift ${g.title}`} className="group block text-center focus:outline-none">
                    <div className="mx-auto rounded aspect-square grid place-items-center" style={{ width }}>
                      {g.imageUrl ? (
                        <img
                          src={g.imageUrl}
                          alt=""
                          className="object-contain"
                          style={{ width: "min(clamp(160px, 18vw, 220px), 100%)", height: "min(clamp(160px, 18vw, 220px), 100%)" }}
                        />
                      ) : null}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Portrait fallback: simple grid (orientation guard should keep users in landscape) */}
      <div className="p-6 pt-[clamp(56px,12vh,112px)] grid gap-6 landscape:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
          {displayGifts.map((g) => (
            <GiftCard key={g.id} title={g.title} imageUrl={g.imageUrl} onSelect={() => onSelect(g)} />
          ))}
        </div>
      </div>
    </div>
    )
  );
}


