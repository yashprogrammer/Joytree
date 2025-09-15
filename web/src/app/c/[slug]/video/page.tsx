"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/session";

export default function CampaignVideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);

  // Auth guard
  useEffect(() => {
    const token = getToken();
    if (!token) router.replace(`/c/${slug}/auth`);
  }, [router, slug]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Auto play when routed here
    const play = async () => {
      try {
        await v.play();
      } catch {
        // ignore autoplay errors; user can tap to play
      }
    };
    play();

    // Prevent seeking forward
    const preventSeek = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      const lastTime = (window as unknown as { __lastTime?: number }).__lastTime ?? 0;
      if (target.currentTime > lastTime + 0.3) {
        target.currentTime = lastTime;
      }
    };
    const trackTime = () => {
      (window as unknown as { __lastTime?: number }).__lastTime = v.currentTime;
    };
    v.addEventListener("seeking", preventSeek);
    v.addEventListener("timeupdate", trackTime);

    const onEnded = () => {
      router.push(`/c/${slug}/gifts`);
    };
    v.addEventListener("ended", onEnded);

    return () => {
      v.removeEventListener("seeking", preventSeek);
      v.removeEventListener("timeupdate", trackTime);
      v.removeEventListener("ended", onEnded);
    };
  }, [router, slug]);

  // Apply mute/volume changes to the video element
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    // If muted, keep internal volume but audio is off; if unmuting with volume 0, set a sensible default
    if (!isMuted && v.volume === 0 && volume === 0) {
      v.volume = 0.6;
      setVolume(0.6);
    } else {
      v.volume = volume;
    }
  }, [isMuted, volume]);

  const onToggleMute = () => {
    setIsMuted((m) => !m);
  };

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

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
        src="/video.mp4"
        autoPlay
        playsInline
        // no controls visible
      />

      {/* Volume controls overlay bottom-left */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-black/40 text-white rounded-full px-3 py-2">
        <button
          type="button"
          className="p-1"
          aria-label={isMuted ? "Unmute" : "Mute"}
          onClick={onToggleMute}
        >
          {/* Volume icon */}
          {isMuted || volume === 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3 9v6h4l5 4V5L7 9H3z" />
              <path d="M16.5 12l2.5-2.5 1.5 1.5L18 13.5 20.5 16 19 17.5 16.5 15 14 17.5 12.5 16 15 13.5 12.5 11 14 9.5 16.5 12z" />
            </svg>
          ) : volume < 0.5 ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3 9v6h4l5 4V5L7 9H3z" />
              <path d="M16 12a4 4 0 00-2-3.464v6.928A4 4 0 0016 12z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3 9v6h4l5 4V5L7 9H3z" />
              <path d="M16 12a4 4 0 00-2-3.464v6.928A4 4 0 0016 12z" />
              <path d="M18 12a6 6 0 00-3-5.196v10.392A6 6 0 0018 12z" />
            </svg>
          )}
        </button>
        <input
          aria-label="Volume"
          className="accent-white"
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={onVolumeChange}
          style={{ width: 140 }}
        />
      </div>
    </div>
  );
}


