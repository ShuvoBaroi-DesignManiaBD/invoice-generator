"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/lib/data";
import {
  deleteInvoice,
  updateInvoiceStatus,
} from "@/app/dashboard/invoices/actions";
import { Edit, Trash, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useTransition, useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DashboardTable({
  invoices,
  clients,
}: {
  invoices: Invoice[];
  clients?: { id: string; name: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;
      const matchesClient =
        clientFilter === "all" ||
        invoice.client_id === clientFilter ||
        (clientFilter === "all" && true);
      return matchesStatus && matchesClient;
    });
  }, [invoices, statusFilter, clientFilter]);

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateInvoiceStatus(id, newStatus as any);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Status updated to ${newStatus}`);
      }
    });
  };

  const handleDelete = (id: string) => {
    // Basic confirmation
    if (
      typeof window !== "undefined" &&
      !window.confirm("Are you sure you want to delete this invoice?")
    ) {
      return;
    }

    startTransition(async () => {
      const result = await deleteInvoice(id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Invoice deleted successfully");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {clients && (
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          {filteredInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell>{invoice.client_name}</TableCell>
              <TableCell>
                {format(new Date(invoice.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={invoice.status}
                  onValueChange={(val) => handleStatusChange(invoice.id, val)}
                >
                  <SelectTrigger
                    className={`w-[120px] h-8 border-none shadow-none ${
                      invoice.status === "paid"
                        ? "text-green-600 bg-green-100 hover:bg-green-200"
                        : invoice.status === "overdue"
                          ? "text-red-600 bg-red-100 hover:bg-red-200"
                          : invoice.status === "pending"
                            ? "text-yellow-600 bg-yellow-100 hover:bg-yellow-200"
                            : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: invoice.currency,
                }).format(invoice.amount)}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/dashboard/invoices/${invoice.id}/pdf`}>
                    <FileText className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(invoice.id)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
