// Engineer Dashboard 
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DashboardWidgets } from '@/components/widgets/DashboardWidgets'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Sample data for charts
const deviceStatusData = [
  { time: '00:00', online: 95, offline: 5, maintenance: 2 },
  { time: '04:00', online: 94, offline: 6, maintenance: 3 },
  { time: '08:00', online: 96, offline: 4, maintenance: 1 },
  { time: '12:00', online: 97, offline: 3, maintenance: 2 },
  { time: '16:00', online: 93, offline: 7, maintenance: 4 },
  { time: '20:00', online: 95, offline: 5, maintenance: 3 },
]

export default function EngineerDashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">OT Engineer Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Schedule Maintenance</Button>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>
      
      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardWidgets.MetricCard 
              title="Total Devices" 
              value="248" 
              description="12 new devices added"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Online Devices" 
              value="235" 
              description="95% availability"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Offline Devices" 
              value="13" 
              description="5% of total devices"
              trend="down"
            />
            <DashboardWidgets.MetricCard 
              title="In Maintenance" 
              value="8" 
              description="3% of total devices"
              trend="neutral"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Device Status Trend</CardTitle>
              <CardDescription>
                24-hour device status trend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={deviceStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="online" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="offline" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Device Inventory</CardTitle>
              <CardDescription>
                Complete list of OT devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardWidgets.DeviceTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardWidgets.MetricCard 
              title="Scheduled Maintenance" 
              value="12" 
              description="For next 7 days"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Completed Tasks" 
              value="8" 
              description="In the last 7 days"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Pending Approvals" 
              value="5" 
              description="Awaiting authorization"
              trend="neutral"
            />
            <DashboardWidgets.MetricCard 
              title="Maintenance Efficiency" 
              value="92%" 
              description="3% improvement"
              trend="up"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Maintenance</CardTitle>
                <CardDescription>
                  Scheduled maintenance activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgets.MaintenanceSchedule />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
                <CardDescription>
                  Recently completed maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgets.MaintenanceHistory />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
              <CardDescription>
                Pending maintenance requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardWidgets.MaintenanceRequests />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardWidgets.MetricCard 
              title="OT Risk Score" 
              value="45/100" 
              description="5% decrease from last month"
              trend="down"
            />
            <DashboardWidgets.MetricCard 
              title="Security Incidents" 
              value="3" 
              description="In the last 30 days"
              trend="down"
            />
            <DashboardWidgets.MetricCard 
              title="Vulnerable Devices" 
              value="18" 
              description="7% of total devices"
              trend="down"
            />
            <DashboardWidgets.MetricCard 
              title="Patch Compliance" 
              value="86%" 
              description="4% improvement"
              trend="up"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>
                Active security policies for OT environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardWidgets.PolicyTable />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Management</CardTitle>
                <CardDescription>
                  Open vulnerabilities requiring remediation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgets.VulnerabilityTable />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Zones</CardTitle>
                <CardDescription>
                  OT network segmentation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgets.SecurityZones />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
