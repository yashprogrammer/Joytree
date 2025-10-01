"use client";
import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { Address } from "@/types";

export default function OrderSummaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  type OrderSummaryData = {
    id: string;
    gift?: { title?: string } | null;
    giftId?: string;
    campaign?: { title?: string } | null;
    campaignSlug?: string;
    status?: string;
    address?: Address;
  };

  const [data, setData] = useState<OrderSummaryData | null>(null);
  const [error, setError] = useState<string>("");
  const [showCelebration, setShowCelebration] = useState(false);
  useEffect(() => {
    // Try to read from local storage (mock order placed on confirm page)
    try {
      const local = typeof window !== "undefined" ? window.localStorage.getItem(`joytree_order_${id}`) : null;
      if (local) {
        setData(JSON.parse(local));
        return;
      }
    } catch {}
    // Fallback to API
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d: unknown) => setData(d as OrderSummaryData))
      .catch((e) => setError(String(e)));
  }, [id]);

  // Trigger celebration animation on mount
  useEffect(() => {
    setShowCelebration(true);
    // Hide celebration after animation completes (adjust timing as needed)
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Prevent/back-redirect logic: do not allow navigating back away from Thank You.
  // If the user attempts to go back, push them to OTP login for the campaign.
  const slugRef = useRef<string | null>(null);
  useEffect(() => {
    slugRef.current = data?.campaignSlug || undefined as unknown as string | null;
  }, [data]);

  useEffect(() => {
    // Push a new state so the first back hits our handler
    const pushDummy = () => {
      try {
        history.pushState({ noBackFromSummary: true }, "");
      } catch {}
    };
    pushDummy();

    const onPopState = () => {
      const slug = slugRef.current || (data?.campaign?.title ? String(data?.campaign?.title) : data?.campaignSlug) || "";
      const target = slug ? `/c/${slug}/auth` : "/c/demo/auth";
      location.replace(target);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [data]);
  return (
    <div className="p-6 grid gap-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Thank you!</h1>
      <p className="text-sm text-gray-700">Your order has been placed successfully.</p>
      {error ? <p className="text-red-600">{error}</p> : null}
      {!data ? <p className="text-gray-900">Loading...</p> : (
        <div className="border rounded-xl p-5 bg-white">
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="grid gap-1">
              <div className="font-medium text-gray-700">Order ID</div>
              <div className="text-gray-900 break-all">{data.id}</div>
            </div>
            <div className="grid gap-1">
              <div className="font-medium text-gray-700">Gift</div>
              <div className="text-gray-900">{data.gift?.title || data.giftId}</div>
            </div>
            <div className="grid gap-1">
              <div className="font-medium text-gray-700">Campaign</div>
              <div className="text-gray-900">{data.campaign?.title || data.campaignSlug}</div>
            </div>
            <div className="grid gap-1">
              <div className="font-medium text-gray-700">Status</div>
              <div className="text-gray-900">{data.status || "PLACED"}</div>
            </div>
            {data.address ? (
              <div className="md:col-span-2 grid gap-1">
                <div className="font-medium text-gray-700">Shipping Address</div>
                {data.address.recipientName || data.address.phone ? (
                  <div className="text-gray-900">
                    {data.address.recipientName} {data.address.phone ? `(${data.address.phone})` : ""}
                  </div>
                ) : null}
                {data.address.email ? <div className="text-gray-900">{data.address.email}</div> : null}
                {data.address.line1 ? <div className="text-gray-900">{data.address.line1}</div> : null}
                {data.address.line2 ? <div className="text-gray-900">{data.address.line2}</div> : null}
                <div className="text-gray-900">{data.address.city}, {data.address.state} {data.address.pincode}</div>
                {data.address.country ? <div className="text-gray-900">{data.address.country}</div> : null}
                {data.address.landmark ? <div className="text-gray-900">Landmark: {data.address.landmark}</div> : null}
                {data.address.alternatePhone ? <div className="text-gray-900">Alt Phone: {data.address.alternatePhone}</div> : null}
                {data.address.addressType ? <div className="text-gray-900">Type: {data.address.addressType}</div> : null}
              </div>
            ) : null}
          </div>
        </div>
      )}
      <Link className="px-3 py-2 border rounded w-fit" href="/">Go to home</Link>

      {/* Celebration Animations */}
      {showCelebration && (
        <>
          {/* Top-left celebration */}
          <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none z-50">
            <DotLottieReact
              src="/congratulations.lottie"
              loop={false}
              autoplay
            />
          </div>
          
          {/* Top-right celebration */}
          <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none z-50">
            <DotLottieReact
              src="/congratulations.lottie"
              loop={false}
              autoplay
            />
          </div>
          
          {/* Center celebration test ci */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none z-50">
            <DotLottieReact
              src="/congratulations.lottie"
              loop={false}
              autoplay
            />
          </div>
        </>
      )}
    </div>
  );
}


