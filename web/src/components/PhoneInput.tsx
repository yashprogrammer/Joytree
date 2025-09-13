import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const PhoneInput = forwardRef<HTMLInputElement, Props>(function PhoneInput(
  { id = "mobile", label = "Mobile", error, ...rest },
  ref
) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-foreground)]">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="9876543210"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="border border-[var(--color-border)] p-2 rounded w-full bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default PhoneInput;


