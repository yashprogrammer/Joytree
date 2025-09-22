import { campaigns, gifts as giftDb } from "@/mocks/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const existing = campaigns.find((c) => c.slug === slug);
  const campaign = existing ?? { id: `cmp-${slug}`, slug, title: slug, companyId: "c1", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" } as (typeof campaigns)[number];
  const campaignGifts = existing ? giftDb.filter((g) => g.campaignId === campaign.id) : giftDb;
  return Response.json({ gifts: campaignGifts, campaign: { id: campaign.id, slug: campaign.slug, title: campaign.title, videoUrl: campaign.videoUrl } });
}


