"use client";
import { useEffect, useRef } from "react";

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
          <button className="px-3 py-2 border rounded bg-black text-white" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}


