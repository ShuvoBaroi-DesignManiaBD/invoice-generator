import { InvoiceForm } from "@/components/invoices/invoice-form"
import { getInvoice } from "@/lib/data"
import { notFound } from "next/navigation"

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await getInvoice(id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto">
      <InvoiceForm defaultValues={invoice} />
    </div>
  )
}
