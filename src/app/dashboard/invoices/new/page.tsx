import { InvoiceForm } from "@/components/invoices/invoice-form";

export default function NewInvoicePage() {
  return (
    <div className="w-full bg-background overflow-hidden">
      <div className="mx-auto py-6">
        <InvoiceForm />
      </div>
    </div>
  );
}
