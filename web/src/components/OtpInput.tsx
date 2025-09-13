import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const OtpInput = forwardRef<HTMLInputElement, Props>(function OtpInput(
  { id = "otp", label = "OTP", error, ...rest },
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
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="123456"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="border border-[var(--color-border)] p-2 rounded w-full tracking-widest text-center bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
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

export default OtpInput;


