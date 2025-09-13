type Props = {
  register: any;
  errors?: Record<string, { message?: string }>;
};

export default function AddressForm({ register, errors = {} }: Props) {
  return (
    <div className="grid gap-2">
      <div className="grid gap-1">
        <label htmlFor="line1" className="text-sm font-medium text-[var(--color-foreground)]">Address line 1</label>
        <input id="line1" className="border border-[var(--color-border)] p-2 rounded bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" {...register("address.line1")} aria-invalid={!!errors["address.line1"]} aria-describedby={errors["address.line1"] ? "line1-error" : undefined} />
        {errors["address.line1"]?.message && <p id="line1-error" className="text-sm text-[var(--color-danger)]">{errors["address.line1"].message}</p>}
      </div>
      <div className="grid gap-1">
        <label htmlFor="line2" className="text-sm font-medium text-[var(--color-foreground)]">Address line 2</label>
        <input id="line2" className="border border-[var(--color-border)] p-2 rounded bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" {...register("address.line2")} />
      </div>
      <div className="grid gap-1">
        <label htmlFor="city" className="text-sm font-medium text-[var(--color-foreground)]">City</label>
        <input id="city" className="border border-[var(--color-border)] p-2 rounded bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" {...register("address.city")} aria-invalid={!!errors["address.city"]} aria-describedby={errors["address.city"] ? "city-error" : undefined} />
        {errors["address.city"]?.message && <p id="city-error" className="text-sm text-[var(--color-danger)]">{errors["address.city"].message}</p>}
      </div>
      <div className="grid gap-1">
        <label htmlFor="state" className="text-sm font-medium text-[var(--color-foreground)]">State</label>
        <input id="state" className="border border-[var(--color-border)] p-2 rounded bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" {...register("address.state")} aria-invalid={!!errors["address.state"]} aria-describedby={errors["address.state"] ? "state-error" : undefined} />
        {errors["address.state"]?.message && <p id="state-error" className="text-sm text-[var(--color-danger)]">{errors["address.state"].message}</p>}
      </div>
      <div className="grid gap-1">
        <label htmlFor="pincode" className="text-sm font-medium text-[var(--color-foreground)]">Pincode</label>
        <input id="pincode" className="border border-[var(--color-border)] p-2 rounded bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]" inputMode="numeric" {...register("address.pincode")} aria-invalid={!!errors["address.pincode"]} aria-describedby={errors["address.pincode"] ? "pincode-error" : undefined} />
        {errors["address.pincode"]?.message && <p id="pincode-error" className="text-sm text-[var(--color-danger)]">{errors["address.pincode"].message}</p>}
      </div>
    </div>
  );
}


