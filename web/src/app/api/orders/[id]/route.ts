export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return Response.json({
    id,
    campaign: { id: "", slug: "", title: "" },
    gift: { id: "", campaignId: "", title: "", imageUrl: "", type: "digital" },
    status: "PLACED",
  });
}


