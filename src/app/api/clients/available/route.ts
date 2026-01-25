import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "name";
  const order = searchParams.get("order") || "asc";

  const supabase = await createClient();

  // Verify authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (userId && userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // Try fetching with invoice count
    // Note: Using 'invoices(count)' without space to avoid potential parsing issues
    let query = supabase
      .from("clients")
      .select("*, invoices(count)", { count: "exact" })
      .eq("user_id", user.id);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (["name", "email", "created_at"].includes(sort)) {
      query = query.order(sort, { ascending: order === "asc" });
    } else {
      query = query.order("name", { ascending: true });
    }

    const { data: clients, error, count } = await query.range(from, to);

    if (error) {
      // Throw to catch block for any error, including relationship issues
      throw error;
    }

    const clientsWithCounts = clients.map((client: any) => ({
      ...client,
      invoice_count: client.invoices?.[0]?.count || 0,
    }));

    return NextResponse.json({
      data: clientsWithCounts,
      metadata: {
        total: count,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    });
  } catch (err: any) {
    console.error("Fetch with count failed, falling back:", err.message);

    // Fallback: Fetch clients without invoice count
    let query = supabase
      .from("clients")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (["name", "email", "created_at"].includes(sort)) {
      query = query.order(sort, { ascending: order === "asc" });
    } else {
      query = query.order("name", { ascending: true });
    }

    const { data: clients, error, count } = await query.range(from, to);

    if (error) {
      console.error("Fallback fetch failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const clientsWithCounts = clients.map((client: any) => ({
      ...client,
      invoice_count: 0,
    }));

    return NextResponse.json({
      data: clientsWithCounts,
      metadata: {
        total: count,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    });
  }
}
