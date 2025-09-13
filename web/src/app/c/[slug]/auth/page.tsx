"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "@/components/PhoneInput";
import OtpInput from "@/components/OtpInput";
import { apiPost } from "@/lib/api";
import { setToken } from "@/lib/session";
import { mobileSchema } from "@/lib/validators";

export default function AuthPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const isMobileValid = (() => {
    try {
      return mobileSchema.parse(mobile) && true;
    } catch {
      return false;
    }
  })();

  const canRequestOtp = isMobileValid && !loading;
  const canVerifyOtp = isMobileValid && otp.trim().length === 6 && !loading;

  const requestOtp = async () => {
    if (!canRequestOtp) return;
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await apiPost("/api/auth/request-otp", { mobile, campaignSlug: slug });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("joytree_mobile", mobile);
      }
      setOtpRequested(true);
      setMessage("OTP sent successfully");
    } catch (e: any) {
      setError(e?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!canVerifyOtp) return;
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await apiPost<{ token: string }>("/api/auth/verify-otp", { mobile, code: otp.trim() });
      setToken(res.token);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("joytree_mobile", mobile);
      }
      router.push(`/c/${slug}/details`);
    } catch (e: any) {
      setError(e?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <div className="w-full max-w-md grid gap-6 bg-[var(--surface-beige)] p-6 rounded-2xl shadow-sm">
        <div className="grid gap-2 text-center">
          <h1 className="text-2xl font-medium">Verify your mobile</h1>
          <p className="text-sm muted">Enter your mobile number to receive an OTP.</p>
        </div>

        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        {message ? <p className="text-green-700 text-sm">{message}</p> : null}

        <div className="grid gap-3">
          <PhoneInput
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            error={!mobile || isMobileValid ? undefined : "Enter a valid 10-digit Indian mobile number"}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={requestOtp}
            disabled={!canRequestOtp}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>

        <div className="grid gap-3">
          <OtpInput
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={!otpRequested}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={verifyOtp}
            disabled={!canVerifyOtp}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}


