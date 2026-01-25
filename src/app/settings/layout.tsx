import { Separator } from "@/components/ui/separator"
import { SettingsNav } from "./components/settings-nav"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and set e-mail preferences.",
}

const sidebarNavItems = [
  {
    title: "Account",
    href: "/settings/account",
  },
  {
    title: "My Company",
    href: "/settings/my-company",
  },
  {
    title: "Appearance",
    href: "/settings/appearance",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SettingsNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
