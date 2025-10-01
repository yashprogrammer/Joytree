"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { waitForMocksReady } from "@/mocks/browser";
import { getToken } from "@/lib/session";
import GiftCard from "@/components/GiftCard";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
        <div className="flex flex-col items-center gap-4 text-gray-700">
          <div className="relative">
            <span
              className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--brand-primary)] rounded-full animate-spin"
              aria-hidden
            />
            <span className="absolute inset-0 m-auto w-8 h-8 border-4 border-gray-100 border-b-[var(--brand-secondary)] rounded-full animate-spin" style={{ animationDelay: '0.15s' }} />
          </div>
          <span className="text-lg font-medium animate-pulse">Loading your joyful options ✨</span>
        </div>
      </div>
    ) : (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating celebration particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="celebration-particle"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: i % 3 === 0 ? 'var(--brand-primary)' : 
                         i % 3 === 1 ? 'var(--brand-secondary)' : '#fbbf24',
              left: `${Math.random() * 100}%`,
              animationDuration: `${8 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.4 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* Viewport-positioned heading with celebration */}
      <div className="fixed left-1/2 -translate-x-1/2 top-[clamp(24px,10vh,96px)] z-20 text-center px-4 pointer-events-none">
        {/* Small celebration animation above heading */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 pointer-events-none opacity-70">
          <DotLottieReact
            src="/Success celebration.lottie"
            loop={true}
            autoplay
            speed={0.5}
          />
        </div>
        
        <h1 className="font-bold text-[clamp(24px,5vh,40px)] mb-2">
          <span className="text-[clamp(24px,5vh,40px)]">🎁</span>
          <span className="bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-primary)] bg-clip-text text-transparent animate-[shimmer_3s_linear_infinite]" style={{ backgroundSize: '200% 200%' }}>
            {" "}Pick Your Perfect Gift!{" "}
          </span>
          <span className="text-[clamp(24px,5vh,40px)]">🎉</span>
        </h1>
        <p className="text-[clamp(14px,2vh,18px)] text-gray-700 font-medium drop-shadow-sm">
          Each one brings joy – choose what speaks to you!
        </p>
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
                <div 
                  key={g.id} 
                  className="absolute -translate-x-1/2 gift-card-animated" 
                  style={{ left, top }}
                >
                  <button 
                    onClick={() => onSelect(g)} 
                    aria-label={`Select gift ${g.title}`} 
                    className="landscape-gift-item group block text-center focus:outline-none focus:ring-4 focus:ring-[var(--brand-primary)]/40 rounded-2xl relative"
                  >
                    {/* Subtle glow ring - always visible */}
                    <div className="subtle-glow-ring" />
                    
                    {/* Glow effect container */}
                    <div 
                      className="mx-auto rounded-xl aspect-square grid place-items-center relative
                                 before:absolute before:inset-0 before:rounded-xl
                                 before:bg-gradient-to-t before:from-yellow-400/30 before:via-pink-400/20 before:to-transparent
                                 before:opacity-0 group-hover:before:opacity-100
                                 before:transition-opacity before:duration-500
                                 after:absolute after:inset-0 after:rounded-xl
                                 after:shadow-[0_0_30px_rgba(214,97,102,0.4)]
                                 after:opacity-0 group-hover:after:opacity-100
                                 after:transition-opacity after:duration-300"
                      style={{ width }}
                    >
                      {g.imageUrl ? (
                        <>
                          <img
                            src={g.imageUrl}
                            alt=""
                            className="gift-image-float object-contain transition-all duration-500 group-hover:scale-110 relative z-10"
                            style={{ 
                              width: "min(clamp(160px, 18vw, 220px), 100%)", 
                              height: "min(clamp(160px, 18vw, 220px), 100%)",
                              filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.15))',
                            }}
                          />
                          {/* Sparkle on hover - top right */}
                          <div className="absolute -top-6 -right-6 text-4xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-[bounce-soft_1s_ease-in-out_infinite] z-20">
                            ⭐
                          </div>
                          {/* Additional sparkle - top left */}
                          <div className="absolute -top-4 -left-4 text-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-[sparkle_1.5s_ease-in-out_infinite] z-20" style={{ animationDelay: '0.3s' }}>
                            ✨
                          </div>
                          {/* Gift emoji - bottom */}
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-[bounce-soft_1.2s_ease-in-out_infinite] z-20" style={{ animationDelay: '0.2s' }}>
                            🎁
                          </div>
                        </>
                      ) : null}
                    </div>
                    
                    {/* Gift title on hover */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white shadow-lg">
                        {g.title} 🎉
                      </span>
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


