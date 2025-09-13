"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import { getToken } from "@/lib/session";
import { employeeSchema } from "@/lib/validators";

type EmployeeForm = {
  name: string;
  email: string;
  empId?: string;
  mobile: string;
};

export default function DetailsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace(`/c/${slug}/auth`);
    }
  }, [router, slug]);

  const storedMobile = typeof window !== "undefined" ? window.localStorage.getItem("joytree_mobile") || "" : "";
  const storedEmployee = typeof window !== "undefined" ? window.localStorage.getItem("joytree_employee") : null;
  const parsedEmployee = storedEmployee ? ((): Partial<EmployeeForm> => {
    try { return JSON.parse(storedEmployee) as Partial<EmployeeForm>; } catch { return {}; }
  })() : {};

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema) as unknown as Resolver<EmployeeForm>,
    mode: "onChange",
    defaultValues: {
      name: parsedEmployee.name || "",
      email: parsedEmployee.email || "",
      empId: parsedEmployee.empId || "",
      mobile: storedMobile,
    },
  });

  useEffect(() => {
    // Ensure mobile is set from storage for validation
    if (storedMobile) setValue("mobile", storedMobile, { shouldValidate: true });
  }, [setValue, storedMobile]);

  const onVerifyEmail = async (email: string) => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await apiPost("/api/auth/verify-email", { email, campaignSlug: slug });
      setMessage("Email verified successfully");
    } catch (e: any) {
      setError(e?.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setError("");
    setMessage("");
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("joytree_employee", JSON.stringify({
          name: data.name,
          email: data.email,
          empId: data.empId || "",
          mobile: data.mobile,
        }));
      }
      router.push(`/c/${slug}/video`);
    } catch (e: any) {
      setError(e?.message || "Failed to save details");
    }
  });

  const onReset = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("joytree_employee");
    }
    reset({ name: "", email: "", empId: "", mobile: storedMobile });
    setMessage("");
    setError("");
  };

  return (
    <div className="p-6 grid gap-6 max-w-xl mx-auto">
      <div className="grid gap-2">
        <h1 className="text-2xl font-bold">Your details</h1>
        <p className="text-sm text-gray-600">Provide your company email, name and employee ID.</p>
      </div>

      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      {message ? <p className="text-green-700 text-sm">{message}</p> : null}

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Company Email</label>
          <input className="border p-2 rounded" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email?.message ? <p className="text-sm text-red-600">{errors.email.message as string}</p> : null}
        </div>
        <button
          type="button"
          className="px-3 py-2 border rounded w-fit disabled:opacity-50"
          onClick={() => onVerifyEmail((document.querySelector('input[name="email"]') as HTMLInputElement)?.value || "")}
          disabled={!isValid || loading}
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Full Name</label>
          <input className="border p-2 rounded" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name?.message ? <p className="text-sm text-red-600">{errors.name.message as string}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Employee ID (optional)</label>
          <input className="border p-2 rounded" {...register("empId")} />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Mobile (read-only)</label>
          <input className="border p-2 rounded " {...register("mobile")} readOnly />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="px-3 py-2 border rounded bg-black text-white disabled:opacity-50" disabled={!isValid || loading}>
            Submit
          </button>
          <button type="button" className="px-3 py-2 border rounded" onClick={onReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}


