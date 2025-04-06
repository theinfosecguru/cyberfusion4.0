// Sidebar 
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

'use client'

import { Dispatch, SetStateAction } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { 
  Shield, 
  Activity, 
  Cog, 
  BarChart, 
  AlertTriangle, 
  FileText, 
  Settings, 
  Users, 
  Database, 
  X 
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname()
  
  const routes = [
    {
      label: 'Dashboards',
      routes: [
        {
          label: 'Executive',
          href: '/executive-dashboard',
          icon: BarChart,
        },
        {
          label: 'Security Analyst',
          href: '/analyst-dashboard',
          icon: Activity,
        },
        {
          label: 'OT Engineer',
          href: '/engineer-dashboard',
          icon: Cog,
        },
      ],
    },
    {
      label: 'Security',
      routes: [
        {
          label: 'Incidents',
          href: '/incidents',
          icon: AlertTriangle,
        },
        {
          label: 'Compliance',
          href: '/compliance',
          icon: FileText,
        },
        {
          label: 'Policies',
          href: '/policies',
          icon: Shield,
        },
      ],
    },
    {
      label: 'Administration',
      routes: [
        {
          label: 'Settings',
          href: '/settings',
          icon: Settings,
        },
        {
          label: 'Users',
          href: '/users',
          icon: Users,
        },
        {
          label: 'Data Sources',
          href: '/data-sources',
          icon: Database,
        },
      ],
    },
  ]
  
  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/" className="flex items-center gap-2 font-bold">
                <Shield className="h-6 w-6" />
                <span>CyberFusion 4.0</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="px-2 py-4">
                <SidebarRoutes routes={routes} pathname={pathname} />
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-r md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Shield className="h-6 w-6" />
            <span>CyberFusion 4.0</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-2 py-4">
            <SidebarRoutes routes={routes} pathname={pathname} />
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}

interface SidebarRoutesProps {
  routes: {
    label: string
    routes: {
      label: string
      href: string
      icon: React.ComponentType<{ className?: string }>
    }[]
  }[]
  pathname: string
}

function SidebarRoutes({ routes, pathname }: SidebarRoutesProps) {
  return (
    <div className="space-y-4">
      {routes.map((group, i) => (
        <div key={i} className="space-y-2">
          <h3 className="px-4 text-sm font-medium text-muted-foreground">
            {group.label}
          </h3>
          <div className="space-y-1">
            {group.routes.map((route, j) => {
              const Icon = route.icon
              return (
                <Link key={j} href={route.href}>
                  <Button
                    variant={pathname === route.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === route.href && "bg-secondary"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
