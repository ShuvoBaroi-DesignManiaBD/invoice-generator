"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Settings, Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/theme-toggle"

/**
 * Navigation routes configuration
 */
const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Invoices",
    icon: FileText,
    href: "/invoices",
    color: "text-violet-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-pink-700",
  },
]

/**
 * Header component providing application navigation and theme switching.
 * Includes a responsive mobile menu and a desktop navigation bar.
 */
export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile Menu Trigger */}
        <div className="mr-4 md:hidden">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
        </div>

        {/* Desktop Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                IG
            </div>
            <span className="hidden font-bold sm:inline-block">
              Invoice Generator
            </span>
          </Link>
          {/* Desktop Nav */}
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === route.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Logo (Center or Left if desired, but sticking to simple left align next to hamburger) */}
        <div className="flex md:hidden flex-1">
             <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                    IG
                </div>
                <span className="font-bold">
                    Invoice Generator
                </span>
            </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
             <ModeToggle />
          </nav>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
          <div className="md:hidden border-b bg-background p-4 absolute top-16 left-0 w-full z-40 animate-in slide-in-from-top-5 fade-in-20">
              <nav className="flex flex-col gap-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                    )}
                  >
                    <route.icon className={cn("h-4 w-4", route.color)} />
                    {route.label}
                  </Link>
                ))}
              </nav>
          </div>
      )}
    </header>
  )
}
