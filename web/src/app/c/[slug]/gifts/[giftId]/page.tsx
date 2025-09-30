"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { waitForMocksReady } from "@/mocks/browser";
import { getToken } from "@/lib/session";
import Modal from "@/components/Modal";
import ImageCarousel from "@/components/ImageCarousel";

type Gift = { id: string; title: string; imageUrl?: string; imageUrls?: string[]; description?: string; type: "physical" | "digital" };
type Campaign = { id: string; slug: string; title: string; videoUrl?: string };

export default function GiftDetailsPage({ params }: { params: Promise<{ slug: string; giftId: string }> }) {
  const { slug, giftId } = use(params);
  const router = useRouter();
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visualizeOpen, setVisualizeOpen] = useState(false);
  const [visualizeUrl, setVisualizeUrl] = useState<string>("https://www.pacdora.com/share?filter_url=psm6jeyq92");

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
          const list = d.gifts || [];
          const found = list.find((g) => g.id === giftId) || null;
          setGift(found);
          setError(found ? "" : "Gift not found");
          const idx = list.findIndex((g) => g.id === giftId);
          if (idx >= 0) {
            if (idx < 2) {
              setVisualizeUrl("https://www.pacdora.com/share?filter_url=psm6jeyq92");
            } else if (idx < 4) {
              setVisualizeUrl("https://www.pacdora.com/share?filter_url=psbqlf9yjt");
            } else {
              setVisualizeUrl("https://www.pacdora.com/share?filter_url=psm6jeyq92");
            }
          }
        })
        .catch(() => !cancelled && setError("Failed to load gift"))
        .finally(() => !cancelled && setLoading(false));
    };
    run();
    return () => { cancelled = true; };
  }, [slug, giftId]);

  const onChoose = () => {
    if (!gift) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "joytree_selected_gift",
        JSON.stringify({ id: gift.id, type: gift.type, title: gift.title, imageUrl: gift.imageUrl, imageUrls: gift.imageUrls, description: gift.description })
      );
    }
    if (gift.type === "physical") {
      router.push(`/c/${slug}/address`);
    } else {
      router.push(`/c/${slug}/confirm`);
    }
  };

  return (
    <div className="p-6 grid gap-6 max-w-5xl mx-auto">
      <button className="btn btn-outline-primary w-max" onClick={() => router.push(`/c/${slug}/gifts`)}>
        Back
      </button>

      {loading ? (
        <div className="min-h-[70vh] grid place-items-center">
          <div className="flex items-center gap-3 text-gray-700">
            <span
              className="inline-block w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"
              aria-hidden
            />
            <span>Loading...</span>
          </div>
        </div>
      ) : !gift ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="w-full aspect-square">
            <ImageCarousel
              images={gift.imageUrls || (gift.imageUrl ? [gift.imageUrl] : [])}
              alt={gift.title}
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold text-gray-900">{gift.title}</h1>
            {gift.description ? (
              <p className="text-sm text-gray-700 leading-relaxed">{gift.description}</p>
            ) : null}

            <div className="pt-2 flex gap-3">
              <button className="btn btn-outline-primary inline-flex items-center gap-2" onClick={() => setVisualizeOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <path d="M3.27 6.96L12 12l8.73-5.04"/>
                  <path d="M12 22V12"/>
                </svg>
                Visualize
              </button>
              <button className="btn btn-primary" onClick={onChoose}>
                Choose
              </button>
            </div>
          </div>
        </div>
      )}
 
      <Modal
        open={visualizeOpen}
        onClose={() => setVisualizeOpen(false)}
      >
        <div className="w-full relative" style={{height: "50vh" }}>
          <button
            aria-label="Close"
            onClick={() => setVisualizeOpen(false)}
            className="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          >
            <span aria-hidden>×</span>
          </button>
          <iframe
            src={visualizeUrl}
            title="3D Model"
            className="w-full h-full rounded border"
            allow="accelerometer; gyroscope; magnetometer; fullscreen"
            allowFullScreen
          />
        </div>
      </Modal>
    </div>
  );
}


