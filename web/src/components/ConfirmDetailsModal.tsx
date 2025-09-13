"use client";
import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  mobile: string;
  name: string;
  email: string;
  empId?: string;
  addressSummary?: string;
  onEdit: () => void;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDetailsModal({ open, mobile, name, email, empId, addressSummary, onEdit, onConfirm, onClose }: Props) {
  if (!open) return null;
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

  return (
    <div role="dialog" aria-modal className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div ref={panelRef} className="bg-[var(--color-surface)] rounded p-4 max-w-md w-full shadow-sm" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
        <h2 className="text-xl font-semibold mb-3 text-[var(--color-foreground)]">Confirm your details</h2>
        <dl className="text-sm grid gap-1 mb-3">
          <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Mobile</dt><dd>{mobile}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Name</dt><dd>{name}</dd></div>
          <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Email</dt><dd>{email}</dd></div>
          {empId ? <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Emp ID</dt><dd>{empId}</dd></div> : null}
          {addressSummary ? <div className="flex justify-between"><dt className="text-[var(--color-muted)]">Address</dt><dd>{addressSummary}</dd></div> : null}
        </dl>
        <div className="flex justify-between">
          <button className="px-3 py-2 border border-[var(--color-border)] rounded hover:bg-[var(--color-brand)]/5" onClick={onEdit}>Edit</button>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-[var(--color-border)] rounded hover:bg-[var(--color-brand)]/5" onClick={onClose}>Cancel</button>
            <button className="px-3 py-2 rounded bg-[var(--color-brand)] text-[var(--color-brand-foreground)] hover:opacity-95" onClick={onConfirm}>Place order</button>
          </div>
        </div>
      </div>
    </div>
  );
}


