export async function POST(req: Request) {
  const { code } = (await req.json()) as { code?: string };
  if (code !== "123456") {
    return Response.json({ error: "INVALID_CODE" }, { status: 401 });
  }
  return Response.json({ token: "mock-token" });
}


