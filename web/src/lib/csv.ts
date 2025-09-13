export function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) =>
    String(v ?? "").replace(/"/g, '""');
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => `"${escape(row[h])}"`).join(","));
  }
  return lines.join("\n");
}


