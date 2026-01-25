"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Trash2,
  Plus,
  Download,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { invoiceSchema, InvoiceFormValues } from "@/lib/schemas";
import { createInvoice } from "@/app/invoices/actions";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoiceDocument } from "./pdf-document";
import { InvoicePreview } from "./invoice-preview";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClients } from "@/app/clients/actions";
import { getUserMetadata } from "@/app/settings/actions";

export function InvoiceForm({
  defaultValues,
}: {
  defaultValues?: Partial<InvoiceFormValues>;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // Load Clients
      const clientsData = await getClients();
      setClients(clientsData || []);

      // Load Company Details if form is empty (new invoice)
      if (!defaultValues?.fromName) {
        const metadata = await getUserMetadata();
        if (metadata.company_name) {
          form.setValue("fromName", metadata.company_name);
          form.setValue("fromEmail", metadata.company_email || "");
          form.setValue("fromAddress", metadata.company_address || "");
          form.setValue("fromPhone", metadata.company_phone || "");
          form.setValue("fromVat", metadata.company_vat || "");
          form.setValue("fromRegNumber", metadata.company_reg_number || "");
        }
      }
    }
    loadData();
  }, []);

  const DEFAULT_VALUES: InvoiceFormValues = {
    invoiceNumber: "INV-" + Math.floor(Math.random() * 10000),
    date: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    items: [{ description: "Service", quantity: 1, price: 100 }],
    currency: "USD",
    taxRate: 0,
    discount: 0,
    status: "draft",
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    fromPhone: "",
    fromVat: "",
    fromRegNumber: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    toPhone: "",
    toVat: "",
    toRegNumber: "",
  };

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: defaultValues || DEFAULT_VALUES,
  });

  useEffect(() => {
    setIsClient(true);
    const pendingInvoice = localStorage.getItem("pendingInvoice");
    if (pendingInvoice && !defaultValues) {
      try {
        const parsed = JSON.parse(pendingInvoice);
        // Convert date strings back to Date objects
        if (parsed.date) parsed.date = new Date(parsed.date);
        if (parsed.dueDate) parsed.dueDate = new Date(parsed.dueDate);

        // Merge with defaults to ensure missing fields (like dates) are populated
        const mergedValues = {
          ...DEFAULT_VALUES,
          ...parsed,
          // Ensure dates are valid if the merge overwrote them with strings/undefined despite the check above
          date: parsed.date ? new Date(parsed.date) : DEFAULT_VALUES.date,
          dueDate: parsed.dueDate
            ? new Date(parsed.dueDate)
            : DEFAULT_VALUES.dueDate,
        };

        form.reset(mergedValues);
        // Optional: clear it once restored, or keep it until saved
        // localStorage.removeItem("pendingInvoice")
        toast.info("Restored unsaved invoice draft");
      } catch (e) {
        console.error("Failed to parse pending invoice", e);
      }
    }
  }, []);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = useWatch({ control: form.control, name: "items" });
  const taxRate = useWatch({ control: form.control, name: "taxRate" }) || 0;
  const discount = useWatch({ control: form.control, name: "discount" }) || 0;
  console.log(discount);

  // Watch all values for PDF generation
  const values = useWatch({ control: form.control }) as InvoiceFormValues;

  const subtotal =
    items?.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount - (discount > 0 ? discount : 0);

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      form.setValue("clientId", clientId);
      form.setValue("toName", client.name);
      form.setValue("toEmail", client.email || "");
      form.setValue("toAddress", client.address || "");
      form.setValue("toPhone", client.phone || "");
      form.setValue("toVat", client.vat_number || "");
      form.setValue("toRegNumber", client.reg_number || "");
    }
  };

  async function onSubmit(data: InvoiceFormValues) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      localStorage.setItem("pendingInvoice", JSON.stringify(data));
      toast.info("Please login to save your invoice. Redirecting...");
      router.push("/login?redirect=/");
      return;
    }

    const result = await createInvoice(data);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Invoice created successfully");
      localStorage.removeItem("pendingInvoice");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full gap-6 max-h-[90vh]"
      >
        <div className="flex justify-between items-center shrink-0">
          <h2 className="text-3xl font-bold tracking-tight">New Invoice</h2>
          <div className="flex gap-2">
            {isClient && (
              <PDFDownloadLink
                document={<InvoiceDocument data={values} />}
                fileName={`invoice-${values.invoiceNumber || "draft"}.pdf`}
              >
                {({ loading }) => (
                  <Button type="button" variant="outline" disabled={loading}>
                    <Download className="mr-2 h-4 w-4" />
                    {loading ? "Preparing..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
            <Button type="submit">Save Invoice</Button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start flex-1 overflow-hidden min-h-0">
          <div className="flex-1 w-full space-y-6 overflow-y-auto max-h-[79vh] overflow-x-hidden pr-2 custom-scrollbar">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                  {/* Sender Details */}
                  <div className="space-y-6">
                    <div className="pb-3 border-b">
                      <h3 className="font-semibold text-lg text-foreground tracking-tight">
                        Your company details
                      </h3>
                    </div>
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="fromName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">
                              Company Name{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Your Company Name"
                                className="bg-background/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fromAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Street, City, Postal Code"
                                className="bg-background/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="fromEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="email@company.com"
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fromPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">
                                Phone
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="+1 234 567 890"
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="fromVat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">
                                Tax/VAT ID
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="VAT123456"
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="fromRegNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">
                                Registration No.
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="REG987654"
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Client Details */}
                  <div className="space-y-6">
                    <div className="pb-3 border-b flex justify-between items-center">
                      <h3 className="font-semibold text-lg text-foreground tracking-tight">
                        Client company details
                      </h3>
                      <div className="w-[200px]">
                        <Select onValueChange={handleClientChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <FormField
                        control={form.control}
                        name="toName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">
                              Company Name{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Client Company Name"
                                className="bg-background/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="toAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80">
                              Address
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Street, City, Postal Code"
                                className="bg-background/50"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="toEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="client@company.com"
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="toPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">
                                Phone
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="+1 098 765 432"
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="toVat"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">
                                Tax/VAT ID
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="VAT654321"
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="toRegNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground/80">
                                Registration No.
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="REG456789"
                                  className="bg-background/50"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Items</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({ description: "", quantity: 1, price: 0 })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-12 gap-2 items-end"
                      >
                        <div className="col-span-6">
                          <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  className={index !== 0 ? "sr-only" : ""}
                                >
                                  Description
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  className={index !== 0 ? "sr-only" : ""}
                                >
                                  Qty
                                </FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name={`items.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel
                                  className={index !== 0 ? "sr-only" : ""}
                                >
                                  Price
                                </FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                field.onChange(value);
                                return;
                              }
                              const parsed = parseFloat(value);
                              if (parsed < 0) {
                                field.onChange(Math.abs(parsed));
                              } else {
                                field.onChange(value);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e") {
                                e.preventDefault();
                              }
                            }}
                            className={
                              discount > 0 && !form.formState.errors.discount
                                ? "pr-10 border-green-500 focus-visible:ring-green-500"
                                : ""
                            }
                          />
                        </FormControl>
                        {discount > 0 && !form.formState.errors.discount && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-{Number(discount || 0).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="max-h-[79vh] hidden xl:block w-[42%] shrink-0">
            <div className="rounded-xl border bg-muted/50 shadow-sm h-full flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-muted/50 backdrop-blur-sm z-10 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Live Preview</h3>
                </div>
              </div>
              <div className="max-h-[72.5vh] flex-1 h-full overflow-y-auto p-4 custom-scrollbar scroll-smooth transition-all duration-300 ease-in-out overflow-x-hidden">
                <div className="origin-top-left">
                  <InvoicePreview data={values} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
