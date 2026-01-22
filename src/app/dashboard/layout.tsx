import { Header } from "@/components/layout/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto py-8">
        {children}
      </main>
    </div>
  )
}

