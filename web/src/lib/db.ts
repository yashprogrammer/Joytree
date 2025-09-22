import { sql, createClient } from "@vercel/postgres";

export type OrderRecord = {
  id: string;
  created_at: string;
  campaign_slug: string;
  gift_id: string;
  gift_title: string | null;
  gift_image_url: string | null;
  selected_gift_type: "physical" | "digital" | null;
  employee_name: string | null;
  employee_email: string | null;
  employee_emp_id: string | null;
  employee_mobile: string;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_state: string | null;
  address_pincode: string | null;
};

export async function ensureOrdersTable(): Promise<void> {
  await runSql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL,
      campaign_slug TEXT NOT NULL,
      gift_id TEXT NOT NULL,
      gift_title TEXT,
      gift_image_url TEXT,
      selected_gift_type TEXT,
      employee_name TEXT,
      employee_email TEXT,
      employee_emp_id TEXT,
      employee_mobile TEXT NOT NULL,
      address_line1 TEXT,
      address_line2 TEXT,
      address_city TEXT,
      address_state TEXT,
      address_pincode TEXT
    )
  `;
}

export async function insertOrder(record: OrderRecord): Promise<void> {
  await ensureOrdersTable();
  await runSql`
    INSERT INTO orders (
      id, created_at, campaign_slug, gift_id, gift_title, gift_image_url,
      selected_gift_type, employee_name, employee_email, employee_emp_id,
      employee_mobile, address_line1, address_line2, address_city, address_state, address_pincode
    ) VALUES (
      ${record.id}, ${record.created_at}, ${record.campaign_slug}, ${record.gift_id}, ${record.gift_title}, ${record.gift_image_url},
      ${record.selected_gift_type}, ${record.employee_name}, ${record.employee_email}, ${record.employee_emp_id},
      ${record.employee_mobile}, ${record.address_line1}, ${record.address_line2}, ${record.address_city}, ${record.address_state}, ${record.address_pincode}
    )
    ON CONFLICT (id) DO NOTHING
  `;
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  await ensureOrdersTable();
  const { rows } = await runSql<OrderRecord>`SELECT * FROM orders ORDER BY created_at DESC`;
  return rows;
}

type SqlTagged = (<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]) => Promise<{ rows: T[] }>);

async function runSql<T = unknown>(strings: TemplateStringsArray, ...values: unknown[]): Promise<{ rows: T[] }> {
  try {
    return await (sql as unknown as SqlTagged)<T>(strings, ...values);
  } catch (err) {
    // Fallback to direct client if pooled connection string is not configured
    const code = typeof err === "object" && err && "code" in err ? (err as { code?: string }).code : undefined;
    if (code !== "invalid_connection_string") throw err;
    const client = createClient();
    await client.connect();
    try {
      const result = await (client.sql as unknown as SqlTagged)<T>(strings, ...values);
      return result;
    } finally {
      try { await client.end(); } catch { /* noop */ }
    }
  }
}


