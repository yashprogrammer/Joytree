"use client";
import { useEffect, useRef, useState } from "react";
import Modal from "@/components/Modal";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  imageUrl?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function GiftModal({ open, title, description, imageUrl, onConfirm, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [visualizeOpen, setVisualizeOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && focusable && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (!panel?.contains(active) || active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (!panel?.contains(active) || active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        ref={panelRef}
        className="bg-white text-black rounded p-4 w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="grid gap-4 md:grid-cols-2 overflow-hidden">
          {imageUrl ? (
            <div className="w-full aspect-square grid place-items-center bg-white">
              <img src={imageUrl} alt="" className="object-contain" style={{ width: "70%", height: "70%" }} />
            </div>
          ) : <div />}
          <div className="overflow-auto pr-1">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            {description ? <p className="text-sm text-gray-700 leading-relaxed">{description}</p> : null}
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <button className="px-3 py-2 border border-gray-300 rounded text-gray-800" onClick={onClose}>Cancel</button>
          <button className="px-3 py-2 border border-gray-300 rounded text-gray-800 inline-flex items-center gap-2" onClick={() => setVisualizeOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <path d="M3.27 6.96L12 12l8.73-5.04"/>
              <path d="M12 22V12"/>
            </svg>
            Visualize
          </button>
          <button className="px-3 py-2 border rounded bg-black text-white" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
      <Modal
        open={visualizeOpen}
        onClose={() => setVisualizeOpen(false)}
        footer={
          <>
            <button className="px-3 py-2 border border-gray-300 rounded text-gray-800" onClick={() => setVisualizeOpen(false)}>Close</button>
          </>
        }
      >
        <div className="w-full" style={{ height: "70vh" }}>
          <iframe
            src={"https://www.pacdora.com/share?filter_url=psm6jeyq92"}
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


