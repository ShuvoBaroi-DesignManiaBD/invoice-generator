import { z } from "zod"

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.date(),
  dueDate: z.date(),
  
  // Sender Details
  fromName: z.string().min(1, "Company name is required"),
  fromEmail: z.string().email().optional().or(z.literal('')),
  fromAddress: z.string().optional(),
  fromPhone: z.string().optional(),
  fromVat: z.string().optional(),
  fromRegNumber: z.string().optional(),

  // Client Details
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
})

export type InvoiceFormValues = z.infer<typeof invoiceSchema>
