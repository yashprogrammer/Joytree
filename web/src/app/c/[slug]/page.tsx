import { StepperProvider, useStepper } from "@/components/StepperContext";

function StepperControls() {
  const { currentStep, canGoPrev, canGoNext, goPrev, goNext } = useStepper();
  return (
    <div className="mt-4 flex gap-2">
      <button className="px-3 py-2 border rounded disabled:opacity-50" onClick={goPrev} disabled={!canGoPrev}>
        Prev
      </button>
      <span className="text-sm text-gray-500">Current: {currentStep}</span>
      <button className="px-3 py-2 border rounded disabled:opacity-50" onClick={goNext} disabled={!canGoNext}>
        Next
      </button>
    </div>
  );
}

export default function CampaignPage({ params }: { params: { slug: string } }) {
  return (
    <StepperProvider>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Campaign: {params.slug}</h1>
        <p className="text-sm text-gray-500">Stepper will render here.</p>
        <StepperControls />
      </div>
    </StepperProvider>
  );
}


