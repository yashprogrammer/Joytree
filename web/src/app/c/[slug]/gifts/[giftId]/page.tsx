"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { waitForMocksReady } from "@/mocks/browser";
import { getToken } from "@/lib/session";
import Modal from "@/components/Modal";

type Gift = { id: string; title: string; imageUrl?: string; description?: string; type: "physical" | "digital" };
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
        JSON.stringify({ id: gift.id, type: gift.type, title: gift.title, imageUrl: gift.imageUrl, description: gift.description })
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
        <div>Loading...</div>
      ) : !gift ? (
        <div className="text-sm text-red-600">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="w-full aspect-square grid place-items-center bg-white border rounded">
            {gift.imageUrl ? (
              <img
                src={gift.imageUrl}
                alt=""
                className="object-contain"
                style={{ width: "70%", height: "70%" }}
              />
            ) : null}
          </div>

          <div className="grid gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{gift.title}</h1>
            {gift.description ? (
              <p className="text-sm text-gray-700 leading-relaxed">{gift.description}</p>
            ) : null}

            <div className="pt-2 flex gap-2">
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
        footer={
          <>
            <button className="px-3 py-2 border border-gray-300 rounded text-gray-800" onClick={() => setVisualizeOpen(false)}>Close</button>
          </>
        }
      >
        <div className="w-full" style={{height: "50vh" }}>
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


