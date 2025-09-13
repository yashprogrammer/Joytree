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
      <div ref={panelRef} className="bg-white rounded p-4 max-w-md w-full" onClick={(e) => e.stopPropagation()} tabIndex={-1}>
        <h2 className="text-xl font-semibold mb-3">Confirm your details</h2>
        <dl className="text-sm grid gap-1 mb-3">
          <div className="flex justify-between"><dt className="text-gray-600">Mobile</dt><dd>{mobile}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-600">Name</dt><dd>{name}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-600">Email</dt><dd>{email}</dd></div>
          {empId ? <div className="flex justify-between"><dt className="text-gray-600">Emp ID</dt><dd>{empId}</dd></div> : null}
          {addressSummary ? <div className="flex justify-between"><dt className="text-gray-600">Address</dt><dd>{addressSummary}</dd></div> : null}
        </dl>
        <div className="flex justify-between">
          <button className="px-3 py-2 border rounded" onClick={onEdit}>Edit</button>
          <div className="flex gap-2">
            <button className="px-3 py-2 border rounded" onClick={onClose}>Cancel</button>
            <button className="px-3 py-2 border rounded bg-black text-white" onClick={onConfirm}>Place order</button>
          </div>
        </div>
      </div>
    </div>
  );
}


