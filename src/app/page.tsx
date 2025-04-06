//Home Page
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Shield, Activity, Cog } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6" />
            <span>CyberFusion 4.0</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/executive-dashboard">
              <Button variant="ghost">Executive</Button>
            </Link>
            <Link href="/analyst-dashboard">
              <Button variant="ghost">Analyst</Button>
            </Link>
            <Link href="/engineer-dashboard">
              <Button variant="ghost">Engineer</Button>
            </Link>
            <Button>Login</Button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  CyberFusion 4.0: Securing Convergence, Empowering Innovation
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  The unified security platform for converged IT, OT, and Cloud environments. 
                  Protect your entire digital ecosystem with advanced threat detection, 
                  automated response, and comprehensive visibility.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/executive-dashboard">
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white text-xl font-bold">
                  <Shield className="h-16 w-16 mr-4" />
                  CyberFusion 4.0
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Role-Based Dashboards
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Tailored views for different stakeholders in your organization
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 mb-2" />
                  <CardTitle>Executive Dashboard</CardTitle>
                  <CardDescription>
                    High-level overview for decision makers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Get a comprehensive view of your organization's security posture with risk scores, compliance rates, and critical alerts.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/executive-dashboard" className="w-full">
                    <Button className="w-full">
                      View Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <Activity className="h-10 w-10 mb-2" />
                  <CardTitle>Analyst Dashboard</CardTitle>
                  <CardDescription>
                    Detailed view for security analysts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Monitor and respond to security incidents, analyze anomalies, and leverage threat intelligence to protect your environment.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/analyst-dashboard" className="w-full">
                    <Button className="w-full">
                      View Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <Cog className="h-10 w-10 mb-2" />
                  <CardTitle>Engineer Dashboard</CardTitle>
                  <CardDescription>
                    Operational view for OT engineers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Manage OT devices, schedule maintenance, and ensure security compliance across your operational technology infrastructure.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/engineer-dashboard" className="w-full">
                    <Button className="w-full">
                      View Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 OryxForge Labs LLC. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
          </p>
        </div>
      </footer>
    </div>
  )
}
