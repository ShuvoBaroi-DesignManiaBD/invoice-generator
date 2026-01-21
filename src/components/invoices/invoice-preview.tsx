
import { InvoiceFormValues } from "@/lib/schemas"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function InvoicePreview({ data }: { data: InvoiceFormValues }) {
  const subtotal = data.items.reduce((acc, item) => acc + (Number(item.quantity || 0) * Number(item.price || 0)), 0)
  const taxRate = Number(data.taxRate || 0)
  const discount = Number(data.discount || 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount - discount

  return (
    <Card className="h-full border-none shadow-none bg-white text-black print:shadow-none">
      <CardContent className="p-8 min-h-[29.7cm] w-full bg-white text-sm">
        <div className="flex justify-between mb-8">
            <div>
                 {/* Empty for logo if needed */}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
                <h3 className="font-bold text-gray-700 mb-2">From:</h3>
                <div className="space-y-1 text-gray-600">
                    <p className="font-semibold text-gray-900">{data.fromName || 'Your Company'}</p>
                    {data.fromAddress && <p>{data.fromAddress}</p>}
                    {data.fromEmail && <p>{data.fromEmail}</p>}
                    {data.fromPhone && <p>{data.fromPhone}</p>}
                    {data.fromVat && <p>VAT: {data.fromVat}</p>}
                    {data.fromRegNumber && <p>Reg: {data.fromRegNumber}</p>}
                </div>
            </div>
            <div className="text-right">
                <h3 className="font-bold text-gray-700 mb-2">To:</h3>
                <div className="space-y-1 text-gray-600">
                    <p className="font-semibold text-gray-900">{data.toName || 'Client Company'}</p>
                    {data.toAddress && <p>{data.toAddress}</p>}
                    {data.toEmail && <p>{data.toEmail}</p>}
                    {data.toPhone && <p>{data.toPhone}</p>}
                    {data.toVat && <p>VAT: {data.toVat}</p>}
                    {data.toRegNumber && <p>Reg: {data.toRegNumber}</p>}
                </div>
            </div>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-6 mb-8">
            <div className="space-y-1">
                <p><span className="font-bold text-gray-700">Invoice #:</span> {data.invoiceNumber}</p>
                <p><span className="font-bold text-gray-700">Date:</span> {data.date ? format(data.date, "MMM d, yyyy") : ''}</p>
                <p><span className="font-bold text-gray-700">Due Date:</span> {data.dueDate ? format(data.dueDate, "MMM d, yyyy") : ''}</p>
            </div>
            <div className="text-right">
                 {/* Status or other info could go here */}
            </div>
        </div>

        <div className="mb-8">
            <div className="grid grid-cols-12 gap-4 border-b-2 border-gray-800 pb-2 font-bold text-gray-700">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
            </div>
            {data.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 py-2 border-b border-gray-100 text-gray-600">
                    <div className="col-span-6">{item.description}</div>
                    <div className="col-span-2 text-center">{item.quantity}</div>
                    <div className="col-span-2 text-right">{Number(item.price || 0).toFixed(2)}</div>
                    <div className="col-span-2 text-right">{(Number(item.quantity || 0) * Number(item.price || 0)).toFixed(2)}</div>
                </div>
            ))}
        </div>

        <div className="flex justify-end">
            <div className="w-1/2 space-y-2">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax ({data.taxRate || 0}%)</span>
                    <span>{taxAmount.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-gray-600">
                    <span>Discount</span>
                    <span>-{Number(data.discount || 0).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total</span>
                    <span>{data.currency} {total.toFixed(2)}</span>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
