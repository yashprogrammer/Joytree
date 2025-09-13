import { StepperProvider } from "@/components/StepperContext";
import ClientFlow from "@/app/c/[slug]/ClientFlow";

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <StepperProvider>
      <div className="p-6 grid gap-4">
        <h1 className="text-2xl font-bold">Campaign: {slug}</h1>
        <ClientFlow slug={slug} />
      </div>
    </StepperProvider>
  );
}


