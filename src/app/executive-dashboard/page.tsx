// Executive Dashboard 
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// Sample data for charts
const riskTrendData = [
  { month: 'Jan', IT: 65, OT: 45, Cloud: 35 },
  { month: 'Feb', IT: 59, OT: 48, Cloud: 38 },
  { month: 'Mar', IT: 80, OT: 50, Cloud: 40 },
  { month: 'Apr', IT: 81, OT: 55, Cloud: 35 },
  { month: 'May', IT: 56, OT: 60, Cloud: 30 },
  { month: 'Jun', IT: 55, OT: 45, Cloud: 25 },
]

const complianceData = [
  { name: 'NIST', value: 85 },
  { name: 'ISO 27001', value: 78 },
  { name: 'IEC 62443', value: 65 },
  { name: 'GDPR', value: 90 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function ExecutiveDashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Executive Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Export Report</Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardWidgets.MetricCard 
              title="Overall Risk Score" 
              value="68/100" 
              description="3% increase from last month"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Active Incidents" 
              value="12" 
              description="4 critical, 8 moderate"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Compliance Rate" 
              value="82%" 
              description="5% increase from last quarter"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Detected Anomalies" 
              value="28" 
              description="12% decrease from last week"
              trend="down"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Score Trends</CardTitle>
                <CardDescription>
                  6-month trend across environments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="IT" fill="#8884d8" />
                    <Bar dataKey="OT" fill="#82ca9d" />
                    <Bar dataKey="Cloud" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Environment Risk Distribution</CardTitle>
                <CardDescription>
                  Current risk allocation by environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={complianceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {complianceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
              <CardDescription>
                High-priority security alerts requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardWidgets.AlertTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardWidgets.MetricCard 
              title="NIST CSF" 
              value="85%" 
              description="3% increase from last assessment"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="ISO 27001" 
              value="78%" 
              description="2% increase from last assessment"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="IEC 62443" 
              value="65%" 
              description="5% increase from last assessment"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="GDPR" 
              value="90%" 
              description="1% increase from last assessment"
              trend="up"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Compliance Controls Status</CardTitle>
              <CardDescription>
                Status of key compliance controls across frameworks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardWidgets.ComplianceTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="incidents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardWidgets.MetricCard 
              title="Open Incidents" 
              value="12" 
              description="4 critical, 8 moderate"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Avg. Resolution Time" 
              value="4.2 days" 
              description="12% improvement from last quarter"
              trend="down"
            />
            <DashboardWidgets.MetricCard 
              title="Incidents This Month" 
              value="28" 
              description="15% decrease from last month"
              trend="down"
            />
            <DashboardWidgets.MetricCard 
              title="Automated Responses" 
              value="65%" 
              description="10% increase from last quarter"
              trend="up"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>
                Details of recent security incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardWidgets.IncidentTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
