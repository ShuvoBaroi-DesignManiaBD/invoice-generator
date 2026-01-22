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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { accountSchema, AccountValues } from "@/lib/schemas"
import { updateAccountSettings } from "@/app/settings/actions"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function AccountForm({ initialData }: { initialData: Partial<AccountValues> }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: initialData.fullName || "",
      password: "",
    },
  })

  async function onSubmit(data: AccountValues) {
    setIsLoading(true)
    const result = await updateAccountSettings(data)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Account settings updated")
      form.reset({ ...data, password: "" })
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Manage your account information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Leave blank to keep current" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
