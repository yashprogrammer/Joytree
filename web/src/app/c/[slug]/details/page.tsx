"use client";

import { use, useEffect, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/session";
import { employeeSchema } from "@/lib/validators";

type EmployeeForm = {
  name: string;
  email: string;
  empId?: string;
  mobile: string;
};

export default function DetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [mobileFromStorage, setMobileFromStorage] = useState<string>("");
  

  // Auth guard
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace(`/c/${slug}/auth`);
    }
  }, [router, slug]);

  const { register, handleSubmit, formState: { errors, isValid }, setValue, reset } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema) as Resolver<EmployeeForm>,
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      empId: "",
      mobile: "",
    },
  });

  useEffect(() => {
    // Read from localStorage on client after hydration
    if (typeof window === "undefined") return;
    const mob = window.localStorage.getItem("joytree_mobile") || "";
    setMobileFromStorage(mob);

    const storedEmployee = window.localStorage.getItem("joytree_employee");
    if (storedEmployee) {
      try {
        const parsed = JSON.parse(storedEmployee) as Partial<EmployeeForm>;
        reset({
          name: parsed.name || "",
          email: parsed.email || "",
          empId: parsed.empId || "",
          mobile: mob || parsed.mobile || "",
        });
      } catch {
        // ignore
        setValue("mobile", mob, { shouldValidate: true });
      }
    } else {
      setValue("mobile", mob, { shouldValidate: true });
    }
  }, [reset, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    setError("");
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
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save details";
      setError(msg);
    }
  });

  const onReset = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("joytree_employee");
    }
    reset({ name: "", email: "", empId: "", mobile: mobileFromStorage });
    setError("");
  };

  return (
    <div className="p-6 grid gap-6 max-w-xl mx-auto">
      <div className="grid gap-2">
        <h1 className="text-2xl font-bold">Your details</h1>
        <p className="text-sm text-gray-600">Provide your company email, name and employee ID.</p>
      </div>

      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      <div className="grid gap-1">
          <label className="text-sm font-medium" suppressHydrationWarning>Mobile (verified): {mobileFromStorage}</label>
          <input type="hidden" {...register("mobile")} />
        </div>
      

      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Company Email</label>
          <input className="border p-2 rounded" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email?.message ? <p className="text-sm text-red-600">{errors.email.message as string}</p> : null}
        </div>
        

        <div className="grid gap-1">
          <label className="text-sm font-medium">Full Name</label>
          <input className="border p-2 rounded" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name?.message ? <p className="text-sm text-red-600">{errors.name.message as string}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium">Employee ID (optional)</label>
          <input className="border p-2 rounded" {...register("empId")} />
        </div>

      

        <div className="flex gap-2">
          <button type="submit" className="px-3 py-2 border rounded bg-black text-white disabled:opacity-50" disabled={!isValid}>
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


