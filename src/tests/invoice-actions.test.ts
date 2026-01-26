import { describe, it, expect, vi, beforeEach } from "vitest";
import { createInvoice } from "../app/dashboard/invoices/actions";
import * as supabaseServer from "@/utils/supabase/server";
import { redirect } from "next/navigation";

vi.mock("@/utils/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("createInvoice Action", () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
      from: vi.fn(() => mockSupabase),
      insert: vi.fn(() => mockSupabase),
    };

    vi.mocked(supabaseServer.createClient).mockResolvedValue(mockSupabase);
  });

  it("should create an invoice with client_id", async () => {
    const mockUser = { id: "user-123" };
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    mockSupabase.insert.mockResolvedValue({ error: null });

    const validData = {
      invoiceNumber: "INV-001",
      date: new Date(),
      dueDate: new Date(),
      fromName: "My Company",
      toName: "Client Company",
      clientId: "client-123", // Testing this field
      items: [{ description: "Item 1", quantity: 1, price: 100 }],
      currency: "USD",
      status: "draft",
      taxRate: 0,
      discount: 0,
    };

    await createInvoice(validData as any);

    expect(mockSupabase.from).toHaveBeenCalledWith("invoices");
    expect(mockSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "user-123",
        client_id: "client-123",
        client_name: "Client Company",
        amount: 100,
      }),
    );
  });

  it("should handle missing client_id (create as new client implicitly)", async () => {
    const mockUser = { id: "user-123" };
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });
    mockSupabase.insert.mockResolvedValue({ error: null });

    const validData = {
      invoiceNumber: "INV-002",
      date: new Date(),
      dueDate: new Date(),
      fromName: "My Company",
      toName: "New Client",
      // No clientId
      items: [{ description: "Item 1", quantity: 1, price: 100 }],
      currency: "USD",
      status: "draft",
      taxRate: 0,
      discount: 0,
    };

    await createInvoice(validData as any);

    expect(mockSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        client_id: null,
        client_name: "New Client",
      }),
    );
  });
});
