"use client";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "@/components/PhoneInput";
import OtpInput from "@/components/OtpInput";
import AddressForm from "@/components/AddressForm";
import GiftCard from "@/components/GiftCard";
import GiftModal from "@/components/GiftModal";
import ConfirmDetailsModal from "@/components/ConfirmDetailsModal";
import VideoPlayer from "@/components/VideoPlayer";
import Stepper from "@/components/Stepper";
import { StepperProvider, useStepper } from "@/components/StepperContext";
import { orderInputSchema, type OrderInput } from "@/lib/validators";
import { useState } from "react";

function Demo() {
  const { setFormValid, setVideoWatched, setSelectedGiftId, setSelectedGiftType, setAddressProvided } = useStepper();
  const [giftModal, setGiftModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, watch } = useForm<OrderInput>({
    resolver: zodResolver(orderInputSchema) as unknown as Resolver<OrderInput>,
    mode: "onChange",
    defaultValues: {
      campaignSlug: "diwali-2025",
      giftId: "",
      employee: { name: "", email: "", empId: "", mobile: "" },
    },
  });

  setFormValid(isValid);
  const selectedType = watch("selectedGiftType");
  const address = watch("address");
  setAddressProvided(!!address && !!address.line1 && !!address.city && !!address.state && !!address.pincode);

  const onGiftSelect = (id: string, type: "physical" | "digital") => {
    setSelectedGiftId(id);
    setSelectedGiftType(type);
  };

  const onSubmit = handleSubmit(() => setConfirmOpen(true));

  return (
    <div className="p-6 grid gap-6">
      <Stepper />
      <form onSubmit={onSubmit} className="grid gap-4 max-w-lg">
        <PhoneInput {...register("employee.mobile")} error={errors.employee?.mobile?.message as string | undefined} />
        <OtpInput />
        <div className="grid gap-1">
          <label className="text-sm font-medium">Name</label>
          <input className="border p-2 rounded" {...register("employee.name")} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium">Email</label>
          <input className="border p-2 rounded" {...register("employee.email")} />
        </div>
        {selectedType === "physical" ? (
          <AddressForm register={register} errors={{
            "address.line1": errors.address?.line1,
            "address.city": errors.address?.city,
            "address.state": errors.address?.state,
            "address.pincode": errors.address?.pincode,
          }} />
        ) : null}
        <div className="flex gap-3">
          <GiftCard title="Chocolate Hamper" onSelect={() => { onGiftSelect("g1", "physical"); setGiftModal(true); }} />
          <GiftCard title="Amazon Gift Card" onSelect={() => { onGiftSelect("g3", "digital"); setGiftModal(true); }} />
        </div>
        <VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" onAcknowledged={() => setVideoWatched(true)} />
        <button type="submit" className="px-3 py-2 border rounded bg-black text-white">Open confirm</button>
      </form>
      <GiftModal open={giftModal} title="Confirm gift" onConfirm={() => setGiftModal(false)} onClose={() => setGiftModal(false)} />
      <ConfirmDetailsModal open={confirmOpen} mobile={watch("employee.mobile") || ""} name={watch("employee.name") || ""} email={watch("employee.email") || ""} empId={watch("employee.empId") || ""} onEdit={() => setConfirmOpen(false)} onConfirm={() => setConfirmOpen(false)} onClose={() => setConfirmOpen(false)} />
    </div>
  );
}

export default function ComponentsDemoPage() {
  return (
    <StepperProvider>
      <Demo />
    </StepperProvider>
  );
}


