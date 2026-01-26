"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { companyDetailsSchema, CompanyDetailsValues } from "@/lib/schemas";
import { updateCompanyDetails } from "@/app/dashboard/settings/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CompanyForm({
  initialData,
}: {
  initialData: Partial<CompanyDetailsValues>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CompanyDetailsValues>({
    resolver: zodResolver(companyDetailsSchema),
    defaultValues: {
      companyName: initialData.companyName || "",
      companyEmail: initialData.companyEmail || "",
      companyAddress: initialData.companyAddress || "",
      companyPhone: initialData.companyPhone || "",
      companyVat: initialData.companyVat || "",
      companyRegNumber: initialData.companyRegNumber || "",
    },
  });

  async function onSubmit(data: CompanyDetailsValues) {
    setIsLoading(true);
    const result = await updateCompanyDetails(data);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Company details saved");
      router.refresh();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your company details</CardTitle>
        <CardDescription>
          Manage your company information used in invoices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street, City, Postal Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyVat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax/VAT ID</FormLabel>
                    <FormControl>
                      <Input placeholder="VAT123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyRegNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration No.</FormLabel>
                    <FormControl>
                      <Input placeholder="REG987654" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save details"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
