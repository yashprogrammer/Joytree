"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getToken } from "@/lib/session";
import GiftCard from "@/components/GiftCard";
import GiftModal from "@/components/GiftModal";

type Gift = { id: string; title: string; imageUrl?: string; description?: string; type: "physical" | "digital" };
type Campaign = { id: string; slug: string; title: string; videoUrl?: string };

export default function GiftsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [selected, setSelected] = useState<Gift | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = getToken();
    if (!token) router.replace(`/c/${slug}/auth`);
  }, [router, slug]);

  useEffect(() => {
    apiGet<{ gifts: Gift[]; campaign: Campaign }>(`/api/campaigns/${slug}/gifts`)
      .then((d) => {
        setGifts(d.gifts || []);
        setCampaign(d.campaign || null);
      })
      .catch(() => {
        setGifts([]);
        setCampaign(null);
      });
  }, [slug]);

  const onSelect = (gift: Gift) => {
    setSelected(gift);
    setConfirmOpen(true);
  };

  const onConfirm = () => {
    if (!selected) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("joytree_selected_gift", JSON.stringify({
        id: selected.id,
        type: selected.type,
      }));
    }
    setConfirmOpen(false);
    if (selected.type === "physical") {
      router.push(`/c/${slug}/address`);
    } else {
      router.push(`/c/${slug}/confirm`);
    }
  };

  return (
    <div className="p-6 grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-2xl font-bold">Choose your gift</h1>
        {campaign?.title ? <p className="text-sm text-gray-600">Campaign: {campaign.title}</p> : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {gifts.map((g) => (
          <GiftCard key={g.id} title={g.title} imageUrl={g.imageUrl} onSelect={() => onSelect(g)} />
        ))}
      </div>

      <GiftModal
        open={confirmOpen}
        title={selected?.title || ""}
        description={selected?.description}
        imageUrl={selected?.imageUrl}
        onConfirm={onConfirm}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}


