import { STEPS } from "@/lib/steps";
import { useStepper } from "./StepperContext";

export default function Stepper() {
  const { currentStep } = useStepper();
  return (
    <ol className="flex items-center gap-3" aria-label="Steps">
      {STEPS.map((s) => (
        <li key={s} className={`text-sm ${s === currentStep ? "font-bold" : "text-gray-500"}`}>{s}</li>
      ))}
    </ol>
  );
}


