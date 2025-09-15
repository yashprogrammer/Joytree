"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStepper } from "@/components/StepperContext";
import Stepper from "@/components/Stepper";
import AddressForm from "@/components/AddressForm";
import GiftCard from "@/components/GiftCard";
import GiftModal from "@/components/GiftModal";
import ConfirmDetailsModal from "@/components/ConfirmDetailsModal";
import { apiGet, apiPost } from "@/lib/api";
import { getToken } from "@/lib/session";
import { orderInputSchema, type OrderInput } from "@/lib/validators";

type Gift = { id: string; title: string; imageUrl: string; type: "physical" | "digital" };

export default function ClientFlow({ slug }: { slug: string }) {
  const router = useRouter();
  const {
    setFormValid,
    setSelectedGiftId,
    setSelectedGiftType,
    setAddressProvided,
    setOrderPlaced,
    orderPlaced,
  } = useStepper();

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [orderError, setOrderError] = useState<string>("");
  const [isAuthed, setIsAuthed] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<OrderInput>({
    resolver: zodResolver(orderInputSchema) as unknown as Resolver<OrderInput>,
    mode: "onChange",
    defaultValues: {
      campaignSlug: slug,
      giftId: "",
      selectedGiftType: undefined,
      employee: { name: "", email: "", empId: "", mobile: "" },
    },
  });

  useEffect(() => {
    setFormValid(isValid);
  }, [isValid, setFormValid]);

  // Ensure authenticated; otherwise redirect to auth page
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace(`/c/${slug}/auth`);
    } else {
      setIsAuthed(true);
    }
  }, [router, slug]);

  // Prefill mobile from localStorage if available (set by auth page)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedMobile = window.localStorage.getItem("joytree_mobile");
    if (storedMobile) {
      setValue("employee.mobile", storedMobile, { shouldValidate: true });
    }
  }, [setValue]);

  const addr = watch("address");
  useEffect(() => {
    const ok = !!addr?.line1 && !!addr?.city && !!addr?.state && !!addr?.pincode;
    setAddressProvided(ok);
  }, [addr, setAddressProvided]);

  useEffect(() => {
    apiGet<{ gifts: Gift[] }>(`/api/campaigns/${slug}/gifts`)
      .then((d) => {
        setGifts(d.gifts || []);
      })
      .catch(() => {
        setGifts([]);
      });
  }, [slug]);

  

  const onSelectGift = (gift: Gift) => {
    setSelectedGift(gift);
    setGiftModalOpen(true);
  };

  const onConfirmGift = () => {
    if (!selectedGift) return;
    setValue("giftId", selectedGift.id, { shouldValidate: true });
    setValue("selectedGiftType", selectedGift.type, { shouldValidate: true });
    setSelectedGiftId(selectedGift.id);
    setSelectedGiftType(selectedGift.type);
    setGiftModalOpen(false);
  };

  const onPlaceOrder = handleSubmit(async (data) => {
    setOrderError("");
    try {
      const res = await apiPost<{ orderId: string }>("/api/orders", data);
      setOrderPlaced(true);
      router.push(`/order/${res.orderId}/summary`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to place order";
      if (msg === "DUPLICATE_ORDER") {
        setOrderPlaced(true);
        setOrderError("You have already placed an order for this campaign.");
      } else {
        setOrderError(msg);
      }
    }
  });

  const addressErrors: Record<string, { message?: string } | undefined> = {
    "address.line1": errors.address?.line1,
    "address.city": errors.address?.city,
    "address.state": errors.address?.state,
    "address.pincode": errors.address?.pincode,
  };

  const selectedType = watch("selectedGiftType");

  return isAuthed ? (
    <div className="grid gap-6">
      <Stepper />

      <section aria-labelledby="form" className="grid gap-3">
        <h2 id="form" className="text-lg font-semibold">Form</h2>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Company Email</label>
          <input className="border p-2 rounded" {...register("employee.email")} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Name</label>
          <input className="border p-2 rounded" {...register("employee.name")} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Employee ID (optional)</label>
          <input className="border p-2 rounded" {...register("employee.empId")} />
        </div>
        {selectedType === "physical" ? (
          <AddressForm register={register} errors={addressErrors} />
        ) : null}
      </section>

      <section aria-labelledby="gifts" className="grid gap-3">
        <h2 id="gifts" className="text-lg font-semibold">Gifts</h2>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-4 md:grid-cols-5 justify-items-center">
          {gifts.map((g) => (
            <GiftCard key={g.id} title={g.title} imageUrl={g.imageUrl} onSelect={() => onSelectGift(g)} />
          ))}
        </div>
      </section>

      <section aria-labelledby="place" className="grid gap-3">
        <h2 id="place" className="text-lg font-semibold">Confirm & Place</h2>
        {orderError ? <p className="text-red-600 text-sm">{orderError}</p> : null}
        <div className="flex gap-2">
          <button type="button" className="px-3 py-2 border rounded" onClick={() => setConfirmOpen(true)}>Review details</button>
          <button type="button" className="px-3 py-2 border rounded bg-black text-white disabled:opacity-50" disabled={orderPlaced} onClick={onPlaceOrder}>Place Order</button>
        </div>
      </section>

      <GiftModal
        open={giftModalOpen}
        title={selectedGift?.title || ""}
        imageUrl={selectedGift?.imageUrl}
        onConfirm={onConfirmGift}
        onClose={() => setGiftModalOpen(false)}
      />
      <ConfirmDetailsModal
        open={confirmOpen}
        mobile={watch("employee.mobile") || ""}
        name={watch("employee.name") || ""}
        email={watch("employee.email") || ""}
        empId={watch("employee.empId") || ""}
        addressSummary={addr ? `${addr.line1}, ${addr.city}, ${addr.state} ${addr.pincode}` : undefined}
        onEdit={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  ) : null;
}


