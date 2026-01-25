import { ClientForm } from "@/components/clients/client-form"

export default function NewClientPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg md:text-2xl">Create New Client</h1>
      </div>
      <ClientForm />
    </div>
  )
}
