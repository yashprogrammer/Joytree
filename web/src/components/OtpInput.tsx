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
      <label htmlFor={id} className="label">
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
        className="input tracking-widest text-center"
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


