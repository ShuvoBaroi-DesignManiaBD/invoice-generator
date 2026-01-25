
import { describe, it, expect } from 'vitest';
import { invoiceSchema } from '../lib/schemas';

describe('Invoice Schema Validation', () => {
  const validBaseInvoice = {
    invoiceNumber: 'INV-001',
    date: new Date(),
    dueDate: new Date(),
    fromName: 'My Company',
    toName: 'Client Company',
    items: [
      { description: 'Item 1', quantity: 1, price: 100 },
      { description: 'Item 2', quantity: 2, price: 50 }
    ],
    currency: 'USD',
    status: 'draft',
    taxRate: 0,
    discount: 0
  };

  it('should validate a valid invoice with valid discount', () => {
    const validInvoice = {
      ...validBaseInvoice,
      discount: 50 // Total is 200, discount 50 is valid
    };
    const result = invoiceSchema.safeParse(validInvoice);
    expect(result.success).toBe(true);
  });

  it('should fail when discount is negative', () => {
    const invalidInvoice = {
      ...validBaseInvoice,
      discount: -10
    };
    const result = invoiceSchema.safeParse(invalidInvoice);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('discount');
    }
  });

  it('should fail when discount exceeds total amount', () => {
    // Total = 1*100 + 2*50 = 200
    const invalidInvoice = {
      ...validBaseInvoice,
      discount: 201
    };
    const result = invoiceSchema.safeParse(invalidInvoice);
    expect(result.success).toBe(false);
    if (!result.success) {
      // The refinement error usually comes with a specific message
      expect(result.error.issues[0].message).toBe("Discount cannot exceed the total amount");
      expect(result.error.issues[0].path).toContain('discount');
    }
  });

  it('should validate correctly with tax included', () => {
    // Subtotal = 200, Tax 10% = 20, Total = 220
    const invoiceWithTax = {
      ...validBaseInvoice,
      taxRate: 10,
      discount: 210 // Valid, less than 220
    };
    const result = invoiceSchema.safeParse(invoiceWithTax);
    expect(result.success).toBe(true);
  });

  it('should fail when discount exceeds total with tax included', () => {
    // Subtotal = 200, Tax 10% = 20, Total = 220
    const invoiceWithTax = {
      ...validBaseInvoice,
      taxRate: 10,
      discount: 221 // Invalid, greater than 220
    };
    const result = invoiceSchema.safeParse(invoiceWithTax);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Discount cannot exceed the total amount");
    }
  });
  
  it('should handle zero discount correctly', () => {
    const validInvoice = {
      ...validBaseInvoice,
      discount: 0
    };
    const result = invoiceSchema.safeParse(validInvoice);
    expect(result.success).toBe(true);
  });
});
