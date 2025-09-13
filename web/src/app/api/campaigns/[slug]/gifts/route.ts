export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  // Delegate to MSW in development; this endpoint remains as a safety net
  return Response.json({ gifts: [], campaign: { id: `cmp-${slug}`, slug, title: slug } });
}


