import { describe, it, expect } from 'vitest';
import { clientSchema } from '../lib/schemas';

describe('Client Schema Validation', () => {
  const validBaseClient = {
    name: 'Client Company',
    email: 'client@example.com',
    address: '123 Client St',
    phone: '123-456-7890',
    vatNumber: 'VAT123',
    regNumber: 'REG123'
  };

  it('should validate a valid client', () => {
    const result = clientSchema.safeParse(validBaseClient);
    expect(result.success).toBe(true);
  });

  it('should fail when name is missing', () => {
    const invalidClient = {
      ...validBaseClient,
      name: ''
    };
    const result = clientSchema.safeParse(invalidClient);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('name');
    }
  });

  it('should fail when email is invalid', () => {
    const invalidClient = {
      ...validBaseClient,
      email: 'invalid-email'
    };
    const result = clientSchema.safeParse(invalidClient);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('should allow optional fields to be empty', () => {
    const validClient = {
      name: 'Client Company'
      // Other fields are optional
    };
    const result = clientSchema.safeParse(validClient);
    expect(result.success).toBe(true);
  });
});
