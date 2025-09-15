"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
  disableBackdropClose?: boolean;
  disableEscapeClose?: boolean;
};

export default function Modal({ open, title, onClose, footer, children, disableBackdropClose, disableEscapeClose }: Props) {
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
        if (!disableEscapeClose) onClose();
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
  }, [open, onClose, disableEscapeClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={disableBackdropClose ? undefined : onClose}>
      <div ref={panelRef} className="bg-white text-black rounded p-4 max-w-md w-full" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
        {title ? <h2 className="text-xl font-semibold mb-3">{title}</h2> : null}
        <div className="grid gap-3">
          {children}
        </div>
        {footer ? <div className="mt-4 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}



