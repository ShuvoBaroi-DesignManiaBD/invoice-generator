'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Invoice } from "@/lib/data"
import { deleteInvoice } from "@/app/invoices/actions"
import { Edit, Trash, FileText, Loader2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useTransition } from "react"
import { toast } from "sonner" 

export function DashboardTable({ invoices }: { invoices: Invoice[] }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
      // Basic confirmation
      if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this invoice?')) {
          return
      }

      startTransition(async () => {
          const result = await deleteInvoice(id)
          if (result?.error) {
              toast.error(result.error)
          } else {
              toast.success('Invoice deleted successfully')
          }
      })
  }

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.client_name}</TableCell>
            <TableCell>{format(new Date(invoice.created_at), "MMM d, yyyy")}</TableCell>
            <TableCell>
              <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
            </TableCell>
            <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/invoices/${invoice.id}/edit`}>
                        <Edit className="h-4 w-4" />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href={`/invoices/${invoice.id}/pdf`}>
                        <FileText className="h-4 w-4" />
                    </Link>
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(invoice.id)}
                    disabled={isPending}
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
