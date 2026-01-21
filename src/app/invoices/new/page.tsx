import { InvoiceForm } from "@/components/invoices/invoice-form"

export default function NewInvoicePage() {
  return (
    <div className="h-screen w-full bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto h-full p-6">
        <InvoiceForm />
      </div>
    </div>
  )
}
