"use client"

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer'
import { InvoiceDocument } from './pdf-document'
import { InvoiceFormValues } from '@/lib/schemas'
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function PDFViewerWrapper({ data }: { data: InvoiceFormValues }) {
    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-100px)]">
            <div className="flex justify-end">
                <PDFDownloadLink document={<InvoiceDocument data={data} />} fileName={`invoice-${data.invoiceNumber}.pdf`}>
                    {({ loading }) => (
                        <Button disabled={loading}>
                            <Download className="mr-2 h-4 w-4" />
                            {loading ? 'Generating PDF...' : 'Download PDF'}
                        </Button>
                    )}
                </PDFDownloadLink>
            </div>
            <PDFViewer width="100%" height="100%" className="rounded-md border">
                <InvoiceDocument data={data} />
            </PDFViewer>
        </div>
    )
}
