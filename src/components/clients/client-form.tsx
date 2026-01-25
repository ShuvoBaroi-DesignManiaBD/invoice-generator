"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { clientSchema, ClientFormValues } from "@/lib/schemas"
import { createClientAction, updateClientAction } from "@/app/clients/actions"
import { toast } from "sonner"
import { useState } from "react"

interface ClientFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: ClientFormValues & { id?: string }
}

export function ClientForm({ onSuccess, onCancel, initialData }: ClientFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
      vatNumber: initialData?.vatNumber || "",
      regNumber: initialData?.regNumber || "",
    },
  })

  async function onSubmit(data: ClientFormValues) {
    setIsLoading(true)
    
    let result
    if (initialData?.id) {
      result = await updateClientAction(initialData.id, data)
    } else {
      result = await createClientAction(data)
    }
    
    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    } else {
      toast.success(initialData?.id ? "Client updated successfully" : "Client created successfully")
      if (onSuccess) {
        onSuccess()
      }
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Client Company Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
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
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input placeholder="client@company.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                    <Input placeholder="+1 098 765 432" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="vatNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tax/VAT ID</FormLabel>
                <FormControl>
                    <Input placeholder="VAT654321" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="regNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Registration No.</FormLabel>
                <FormControl>
                    <Input placeholder="REG456789" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (initialData?.id ? "Saving..." : "Creating...") 
              : (initialData?.id ? "Save Client" : "Create Client")}
            </Button>
        </div>
      </form>
    </Form>
  )
}
