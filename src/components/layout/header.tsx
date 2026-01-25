"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FileText, Settings, Menu, X, LogOut, User as UserIcon, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

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
    label: "Clients",
    icon: Users,
    href: "/clients",
    color: "text-orange-500",
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
export function Header({ user }: { user: User | null }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const router = useRouter()
  
  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center">
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

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs font-bold">
                IG
            </div>
            <span className="hidden font-bold sm:inline-block">
              Invoice Generator
            </span>
          </Link>
        </div>

        {/* Desktop Nav and Actions (Right Side) */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
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
          
          <div className="flex items-center space-x-2">
             <ModeToggle />
             {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url || ""} alt={user.email || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                            <UserIcon className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             ) : (
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild size="sm">
                        <Link href="/login">Log in</Link>
                    </Button>
                     <Button asChild size="sm">
                        <Link href="/signup">Sign up</Link>
                    </Button>
                 </div>
             )}
          </div>
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
