import { SignupForm } from "@/components/auth/signup-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free Invoice Generator account. Start creating professional invoices today.",
}

export default function SignupPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <SignupForm />
    </div>
  )
}
