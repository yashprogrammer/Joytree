import { readOrdersCsv, emptyOrdersCsv } from "@/lib/csv-server";

export async function GET() {
  const csv = await readOrdersCsv();
  const body = csv ?? emptyOrdersCsv();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=orders.csv",
      "Cache-Control": "no-store",
    },
  });
}


