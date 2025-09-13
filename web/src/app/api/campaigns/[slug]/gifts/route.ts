export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  // Forward to MSW by simply returning shape; MSW will intercept
  return Response.json({ gifts: [], campaign: { id: "", slug, title: "" } });
}


