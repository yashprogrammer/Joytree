import type { UseFormRegister } from "react-hook-form";
import type { OrderInput } from "@/lib/validators";

type Props = {
  register: UseFormRegister<OrderInput>;
  errors?: Record<string, { message?: string } | undefined>;
};

export default function AddressForm({ register, errors = {} }: Props) {
  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <label htmlFor="line1" className="text-sm font-medium">Address line 1</label>
        <input id="line1" className="border p-2 rounded" {...register("address.line1")} aria-invalid={!!errors["address.line1"]} aria-describedby={errors["address.line1"] ? "line1-error" : undefined} />
        {errors["address.line1"]?.message && <p id="line1-error" className="text-sm text-red-600">{errors["address.line1"].message}</p>}
      </div>
      <div className="grid gap-1">
        <label htmlFor="line2" className="text-sm font-medium">Address line 2</label>
        <input id="line2" className="border p-2 rounded" {...register("address.line2")} />
      </div>
      <div className="grid gap-1">
        <label htmlFor="city" className="text-sm font-medium">City</label>
        <input id="city" className="border p-2 rounded" {...register("address.city")} aria-invalid={!!errors["address.city"]} aria-describedby={errors["address.city"] ? "city-error" : undefined} />
        {errors["address.city"]?.message && <p id="city-error" className="text-sm text-red-600">{errors["address.city"].message}</p>}
      </div>
      <div className="grid gap-1">
        <label htmlFor="state" className="text-sm font-medium">State</label>
        <input id="state" className="border p-2 rounded" {...register("address.state")} aria-invalid={!!errors["address.state"]} aria-describedby={errors["address.state"] ? "state-error" : undefined} />
        {errors["address.state"]?.message && <p id="state-error" className="text-sm text-red-600">{errors["address.state"].message}</p>}
      </div>
      <div className="grid gap-1">
        <label htmlFor="pincode" className="text-sm font-medium">Pincode</label>
        <input id="pincode" className="border p-2 rounded" inputMode="numeric" {...register("address.pincode")} aria-invalid={!!errors["address.pincode"]} aria-describedby={errors["address.pincode"] ? "pincode-error" : undefined} />
        {errors["address.pincode"]?.message && <p id="pincode-error" className="text-sm text-red-600">{errors["address.pincode"].message}</p>}
      </div>
    </div>
  );
}


