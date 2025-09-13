"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/session";

export default function CampaignVideoPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auth guard
  useEffect(() => {
    const token = getToken();
    if (!token) router.replace(`/c/${slug}/auth`);
  }, [router, slug]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const preventSeek = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      target.currentTime = Math.min(target.currentTime, (window as any).__lastTime || 0);
    };
    const trackTime = () => {
      (window as any).__lastTime = v.currentTime;
    };
    v.addEventListener("seeking", preventSeek);
    v.addEventListener("timeupdate", trackTime);
    return () => {
      v.removeEventListener("seeking", preventSeek);
      v.removeEventListener("timeupdate", trackTime);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[var(--surface-light)]">
      <button
        type="button"
        className="absolute top-4 right-4 z-10 px-4 py-2 rounded btn btn-outline-secondary"
        onClick={() => router.push(`/c/${slug}/gifts`)}
        aria-label="Skip video"
      >
        Skip
      </button>
      <video
        ref={videoRef}
        className="w-screen h-screen object-cover"
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        controls={false}
        autoPlay
        playsInline
      />
    </div>
  );
}


