// Analyst Dashboard 
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DashboardWidgets } from '@/components/widgets/DashboardWidgets'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Sample data for charts
const anomalyTrendData = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 8 },
  { day: 'Thu', count: 15 },
  { day: 'Fri', count: 23 },
  { day: 'Sat', count: 10 },
  { day: 'Sun', count: 5 },
]

export default function AnalystDashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Security Analyst Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Create Incident</Button>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>
      
      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="threats">Threat Intelligence</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incidents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardWidgets.MetricCard 
              title="Active Incidents" 
              value="12" 
              description="4 critical, 8 moderate"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Avg. Response Time" 
              value="28 min" 
              description="15% improvement from last month"
              trend="down"
            />
            <DashboardWidgets.MetricCard 
              title="Incidents This Week" 
              value="18" 
              description="3 more than last week"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Resolved Today" 
              value="5" 
              description="2 critical, 3 moderate"
              trend="neutral"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Active Incidents</CardTitle>
              <CardDescription>
                Currently active security incidents requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardWidgets.IncidentTable />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Incident Response Playbooks</CardTitle>
                <CardDescription>
                  Automated response procedures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgets.PlaybookList />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Recent actions taken on incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgets.ActivityFeed />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="anomalies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardWidgets.MetricCard 
              title="Detected Today" 
              value="23" 
              description="8 high, 15 medium"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="False Positives" 
              value="12%" 
              description="3% decrease from last week"
              trend="down"
            />
            <DashboardWidgets.MetricCard 
              title="ML Confidence" 
              value="87%" 
              description="2% increase from last week"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Avg. Detection Time" 
              value="4.5 min" 
              description="10% improvement"
              trend="down"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Trend</CardTitle>
              <CardDescription>
                7-day anomaly detection trend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={anomalyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Anomalies</CardTitle>
              <CardDescription>
                Recently detected anomalous activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardWidgets.AnomalyTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="threats" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardWidgets.MetricCard 
              title="Active Threats" 
              value="8" 
              description="3 critical, 5 moderate"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Threat Intel Sources" 
              value="12" 
              description="2 new sources added"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="IOCs Detected" 
              value="34" 
              description="15% increase from last week"
              trend="up"
            />
            <DashboardWidgets.MetricCard 
              title="Blocked Attacks" 
              value="156" 
              description="23 in the last hour"
              trend="up"
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Threat Intelligence Feed</CardTitle>
              <CardDescription>
                Latest threat intelligence information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardWidgets.ThreatFeed />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>IOC Watchlist</CardTitle>
                <CardDescription>
                  Indicators of compromise being monitored
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgets.IOCTable />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Threat Actors</CardTitle>
                <CardDescription>
                  Known threat actors targeting your industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardWidgets.ThreatActorList />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
