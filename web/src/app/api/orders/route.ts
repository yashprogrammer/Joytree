export async function POST() {
  return Response.json({ orderId: "mock-order-id" });
}

export async function GET() {
  return Response.json({ orders: [] });
}


