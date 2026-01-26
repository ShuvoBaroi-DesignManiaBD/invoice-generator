import { z } from "zod"

export const invoiceSchema = z.object({
  id: z.string().optional(),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.coerce.date(),
  dueDate: z.coerce.date(),
  
  // Sender Details
  fromName: z.string().min(1, "Company name is required"),
  fromEmail: z.string().email().optional().or(z.literal('')),
  fromAddress: z.string().optional(),
  fromPhone: z.string().optional(),
  fromVat: z.string().optional(),
  fromRegNumber: z.string().optional(),

  // Client Details
  clientId: z.string().optional(),
  toName: z.string().min(1, "Client company name is required"),
  toEmail: z.string().email().optional().or(z.literal('')),
  toAddress: z.string().optional(),
  toPhone: z.string().optional(),
  toVat: z.string().optional(),
  toRegNumber: z.string().optional(),

  items: z.array(z.object({
    description: z.string().min(1, "Description is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    price: z.coerce.number().min(0, "Price must be positive"),
  })).min(1, "At least one item is required"),
  
  taxRate: z.coerce.number().min(0).max(100).optional(),
  discount: z.coerce.number().min(0).optional(),
  currency: z.string().default('USD'),
  status: z.enum(['draft', 'pending', 'paid', 'overdue']).default('draft'),
}).refine((data) => {
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const taxRate = data.taxRate || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
  return (data.discount || 0) <= total;
}, {
  message: "Discount cannot exceed the total amount",
  path: ["discount"],
})

export type InvoiceFormValues = z.infer<typeof invoiceSchema>

export const companyDetailsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyEmail: z.string().email().optional().or(z.literal('')),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyVat: z.string().optional(),
  companyRegNumber: z.string().optional(),
})

export type CompanyDetailsValues = z.infer<typeof companyDetailsSchema>

export const accountSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
})

export type AccountValues = z.infer<typeof accountSchema>

export const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  phone: z.string().optional(),
  vatNumber: z.string().optional(),
  regNumber: z.string().optional(),
})

export type ClientFormValues = z.infer<typeof clientSchema>

