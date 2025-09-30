"use client";

import { use, useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/session";
import { addressSchema } from "@/lib/validators";

type AddressForm = {
  recipientName: string;
  phone: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  alternatePhone?: string;
  landmark?: string;
  addressType?: "home" | "office" | "other";
};

export default function AddressPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  // Auth guard
  useEffect(() => {
    const token = getToken();
    if (!token) router.replace(`/c/${slug}/auth`);
  }, [router, slug]);

  const stored = typeof window !== "undefined" ? window.localStorage.getItem("joytree_address") : null;
  const parsed = stored ? (() => { try { return JSON.parse(stored) as Partial<AddressForm>; } catch { return {}; } })() : {};

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema) as unknown as Resolver<AddressForm>,
    mode: "onChange",
    defaultValues: {
      recipientName: parsed.recipientName || "",
      phone: parsed.phone || (typeof window !== "undefined" ? (window.localStorage.getItem("joytree_mobile") || "") : ""),
      email: parsed.email || "",
      line1: parsed.line1 || "",
      line2: parsed.line2 || "",
      city: parsed.city || "",
      state: parsed.state || "",
      pincode: parsed.pincode || "",
      country: parsed.country || "India",
      alternatePhone: parsed.alternatePhone || "",
      landmark: parsed.landmark || "",
      addressType: parsed.addressType || "home",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("joytree_address", JSON.stringify(data));
    }
    router.push(`/c/${slug}/confirm`);
  });

  const onReset = () => {
    const hasWindow = typeof window !== "undefined";
    if (hasWindow) window.localStorage.removeItem("joytree_address");
    reset({
      recipientName: "",
      phone: hasWindow ? (window.localStorage.getItem("joytree_mobile") || "") : "",
      email: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      alternatePhone: "",
      landmark: "",
      addressType: "home",
    });
  };

  return (
    <div className="p-6 grid gap-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Shipping address</h1>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">Full Name</label>
          <input className="input" {...register("recipientName")} />
          {errors.recipientName?.message ? <p className="text-sm text-red-600">{errors.recipientName.message as string}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">Mobile Number</label>
          <input className="input" {...register("phone")} />
          {errors.phone?.message ? <p className="text-sm text-red-600">{errors.phone.message as string}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">Email Address (optional)</label>
          <input className="input" {...register("email")} />
          {errors.email?.message ? <p className="text-sm text-red-600">{errors.email.message as string}</p> : null}
        </div>

        <div className="grid gap-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-800">Address Line 1</label>
          <input className="input" {...register("line1")} />
          {errors.line1?.message ? <p className="text-sm text-red-600">{errors.line1.message as string}</p> : null}
        </div>

        <div className="grid gap-1 md:col-span-2">
          <label className="text-sm font-medium text-gray-800">Address Line 2 (optional)</label>
          <input className="input" {...register("line2")} />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">City / District</label>
          <input className="input" {...register("city")} />
          {errors.city?.message ? <p className="text-sm text-red-600">{errors.city.message as string}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">State / Region</label>
          <input className="input" {...register("state")} />
          {errors.state?.message ? <p className="text-sm text-red-600">{errors.state.message as string}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">Postal Code / Pincode</label>
          <input className="input" {...register("pincode")} />
          {errors.pincode?.message ? <p className="text-sm text-red-600">{errors.pincode.message as string}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">Country</label>
          <input className="input" {...register("country")} />
          {errors.country?.message ? <p className="text-sm text-red-600">{errors.country.message as string}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">Alternate Phone (optional)</label>
          <input className="input" {...register("alternatePhone")} />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">Landmark (optional)</label>
          <input className="input" {...register("landmark")} />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-800">Address Type</label>
          <select className="input" {...register("addressType")}> 
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="md:col-span-2 flex gap-2 pt-2">
          <button type="submit" className="btn btn-primary" disabled={!isValid}>
            Save & Continue
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onReset}>
            Reset
          </button>
          <button type="button" className="ml-auto btn btn-outline-primary" onClick={() => router.push(`/c/${slug}/gifts`)}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}


