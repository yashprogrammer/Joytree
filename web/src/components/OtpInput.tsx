import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const OtpInput = forwardRef<HTMLInputElement, Props>(function OtpInput(
  { id = "otp", label = "OTP", error, ...rest },
  ref
) {
  return (
    <div className="grid gap-1">
      <label htmlFor={id} className="text-sm font-medium">
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
        className="border p-2 rounded w-full tracking-widest text-center"
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default OtpInput;


