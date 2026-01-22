import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { getInvoices } from "@/lib/data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function InvoicesPage() {
  const invoices = await getInvoices()

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button asChild>
            <Link href="/invoices/new">
                <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Link>
        </Button>
      </div>
      <DashboardTable invoices={invoices} />
    </div>
  )
}
