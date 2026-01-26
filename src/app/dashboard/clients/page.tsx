import { ClientList } from "@/components/clients/client-list"

export default function ClientsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-8 md:py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-2xl">Clients</h1>
      </div>
      <ClientList />
    </div>
  )
}
