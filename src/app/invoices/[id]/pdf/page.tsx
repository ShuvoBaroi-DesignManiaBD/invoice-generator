import { PDFViewerWrapper } from "@/components/invoices/pdf-viewer-wrapper"
import { getInvoice } from "@/lib/data"
import { notFound } from "next/navigation"

export default async function InvoicePDFPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const invoice = await getInvoice(id)

  if (!invoice) {
    notFound()
  }

  return (
    <div className="h-full">
      <PDFViewerWrapper data={invoice} />
    </div>
  )
}
