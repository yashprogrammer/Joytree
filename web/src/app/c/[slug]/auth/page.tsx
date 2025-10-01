"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "@/components/PhoneInput";
import OtpInput from "@/components/OtpInput";
import Modal from "@/components/Modal";
import { apiPost } from "@/lib/api";
import { setToken } from "@/lib/session";
import { mobileSchema } from "@/lib/validators";

export default function AuthPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [loginOpen, setLoginOpen] = useState(true);
  const [otpOpen, setOtpOpen] = useState(false);

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
      setLoginOpen(false);
      setOtpOpen(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to request OTP";
      setError(msg);
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 w-screen h-screen grid place-items-center p-6 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: 'url(/JoytreeBGImage.png)' }}
    >

      <Modal
        open={loginOpen}
        title="Enter your mobile"
        onClose={() => setLoginOpen(false)}
        disableBackdropClose
        disableEscapeClose
        footer={
          <>
            {/* <button className="px-3 py-2 border border-gray-300 rounded text-gray-800" onClick={() => setLoginOpen(false)}>Close</button> */}
            <button className="btn btn-secondary disabled:opacity-50" onClick={requestOtp} disabled={!canRequestOtp}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        }
      >
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        {message ? <p className="text-green-700 text-sm">{message}</p> : null}
        <PhoneInput
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          error={!mobile || isMobileValid ? undefined : "Enter a valid 10-digit Indian mobile number"}
        />
      </Modal>

      <Modal
        open={otpOpen}
        title="Enter OTP"
        onClose={() => setOtpOpen(false)}
        disableBackdropClose
        disableEscapeClose
        footer={
          <>
            <button className="px-3 py-2 border border-gray-300 rounded text-gray-800" onClick={() => { setOtpOpen(false); setLoginOpen(true); }}>Back</button>
            <button className="btn btn-primary disabled:opacity-50" onClick={verifyOtp} disabled={!canVerifyOtp}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        }
      >
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <OtpInput
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={!otpRequested}
        />
      </Modal>
    </div>
  );
}


