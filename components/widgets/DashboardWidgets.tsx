// Dashboard Widgets 
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUp, ArrowDown, Minus, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'

// Sample data for tables and lists
const alertsData = [
  { id: 1, severity: 'critical', title: 'Ransomware Detected', source: 'IT Network', timestamp: new Date(2025, 2, 15, 14, 30) },
  { id: 2, severity: 'high', title: 'Unusual Admin Access', source: 'Cloud Environment', timestamp: new Date(2025, 2, 15, 12, 45) },
  { id: 3, severity: 'critical', title: 'OT Protocol Violation', source: 'Manufacturing Line', timestamp: new Date(2025, 2, 15, 10, 15) },
  { id: 4, severity: 'medium', title: 'Failed Login Attempts', source: 'VPN Gateway', timestamp: new Date(2025, 2, 15, 9, 20) },
]

const incidentsData = [
  { id: 101, status: 'open', title: 'Ransomware Attack', severity: 'critical', assignee: 'John Smith', created: new Date(2025, 2, 15, 14, 30) },
  { id: 102, status: 'investigating', title: 'Data Exfiltration Attempt', severity: 'high', assignee: 'Emma Johnson', created: new Date(2025, 2, 14, 16, 45) },
  { id: 103, status: 'remediated', title: 'Phishing Campaign', severity: 'medium', assignee: 'Michael Brown', created: new Date(2025, 2, 13, 11, 20) },
  { id: 104, status: 'closed', title: 'Misconfigured Firewall', severity: 'low', assignee: 'Sarah Davis', created: new Date(2025, 2, 12, 9, 15) },
  { id: 105, status: 'open', title: 'PLC Communication Failure', severity: 'high', assignee: 'Robert Wilson', created: new Date(2025, 2, 15, 8, 30) },
]

const complianceData = [
  { id: 201, framework: 'NIST CSF', control: 'ID.AM-1', description: 'Physical devices inventory', status: 'compliant', lastAssessed: new Date(2025, 2, 10) },
  { id: 202, framework: 'NIST CSF', control: 'ID.AM-2', status: 'non-compliant', description: 'Software platforms inventory', lastAssessed: new Date(2025, 2, 10) },
  { id: 203, framework: 'ISO 27001', control: 'A.8.1.1', description: 'Asset inventory', status: 'compliant', lastAssessed: new Date(2025, 2, 5) },
  { id: 204, framework: 'IEC 62443', control: 'SR 1.1', description: 'Security policy and procedures', status: 'partially-compliant', lastAssessed: new Date(2025, 2, 8) },
  { id: 205, framework: 'GDPR', control: 'Art. 30', description: 'Records of processing activities', status: 'compliant', lastAssessed: new Date(2025, 2, 12) },
]

const anomaliesData = [
  { id: 301, type: 'network', description: 'Unusual outbound traffic', confidence: 87, detected: new Date(2025, 2, 15, 15, 10) },
  { id: 302, type: 'user', description: 'Off-hours admin activity', confidence: 92, detected: new Date(2025, 2, 15, 14, 25) },
  { id: 303, type: 'system', description: 'Unexpected process execution', confidence: 78, detected: new Date(2025, 2, 15, 13, 40) },
  { id: 304, type: 'ot', description: 'Abnormal PLC programming', confidence: 95, detected: new Date(2025, 2, 15, 12, 15) },
  { id: 305, type: 'cloud', description: 'Unusual API calls', confidence: 83, detected: new Date(2025, 2, 15, 11, 30) },
]

const devicesData = [
  { id: 401, name: 'PLC-PROD-001', type: 'PLC', location: 'Manufacturing Line 1', status: 'online', lastSeen: new Date(2025, 2, 15, 16, 0) },
  { id: 402, name: 'HMI-PROD-002', type: 'HMI', location: 'Control Room', status: 'online', lastSeen: new Date(2025, 2, 15, 16, 0) },
  { id: 403, name: 'RTU-FIELD-003', type: 'RTU', location: 'Field Station 3', status: 'offline', lastSeen: new Date(2025, 2, 15, 10, 15) },
  { id: 404, name: 'SCADA-SRV-001', type: 'Server', location: 'Server Room', status: 'online', lastSeen: new Date(2025, 2, 15, 16, 0) },
  { id: 405, name: 'SENSOR-TEMP-004', type: 'Sensor', location: 'Manufacturing Line 2', status: 'maintenance', lastSeen: new Date(2025, 2, 15, 14, 30) },
]

const playbooksData = [
  { id: 501, name: 'Ransomware Response', description: 'Automated response to ransomware detection', status: 'active', lastRun: new Date(2025, 2, 15, 14, 35) },
  { id: 502, name: 'Phishing Remediation', description: 'Steps to contain and remediate phishing attacks', status: 'active', lastRun: new Date(2025, 2, 13, 11, 25) },
  { id: 503, name: 'OT Incident Response', description: 'Protocol for handling OT security incidents', status: 'active', lastRun: null },
  { id: 504, name: 'Cloud Access Control', description: 'Automated response to cloud access violations', status: 'inactive', lastRun: new Date(2025, 2, 10, 9, 15) },
]

const activitiesData = [
  { id: 601, action: 'Incident Created', user: 'System', target: 'Incident #101', timestamp: new Date(2025, 2, 15, 14, 30) },
  { id: 602, action: 'Playbook Executed', user: 'System', target: 'Ransomware Response', timestamp: new Date(2025, 2, 15, 14, 35) },
  { id: 603, action: 'Comment Added', user: 'John Smith', target: 'Incident #101', timestamp: new Date(2025, 2, 15, 14, 40) },
  { id: 604, action: 'Status Changed', user: 'John Smith', target: 'Incident #101', timestamp: new Date(2025, 2, 15, 14, 45) },
  { id: 605, action: 'Evidence Collected', user: 'System', target: 'Incident #101', timestamp: new Date(2025, 2, 15, 14, 50) },
]

const threatFeedData = [
  { id: 701, source: 'Threat Intel Provider', title: 'New Ransomware Variant', severity: 'high', published: new Date(2025, 2, 15, 10, 0) },
  { id: 702, source: 'CISA', title: 'Critical Infrastructure Advisory', severity: 'critical', published: new Date(2025, 2, 14, 16, 30) },
  { id: 703, source: 'Internal Research', title: 'OT Protocol Vulnerability', severity: 'high', published: new Date(2025, 2, 14, 14, 15) },
  { id: 704, source: 'Partner Share', title: 'APT Campaign Targeting Manufacturing', severity: 'critical', published: new Date(2025, 2, 13, 11, 45) },
  { id: 705, source: 'Open Source', title: 'New Zero-Day in Common Library', severity: 'medium', published: new Date(2025, 2, 13, 9, 20) },
]

const iocData = [
  { id: 801, type: 'IP', value: '192.168.1.100', context: 'Command & Control Server', added: new Date(2025, 2, 15, 15, 0) },
  { id: 802, type: 'Domain', value: 'malicious-domain.com', context: 'Phishing Campaign', added: new Date(2025, 2, 14, 16, 45) },
  { id: 803, type: 'Hash', value: 'a1b2c3d4e5f6...', context: 'Ransomware Binary', added: new Date(2025, 2, 14, 14, 30) },
  { id: 804, type: 'URL', value: 'https://malicious-site.com/payload', context: 'Malware Distribution', added: new Date(2025, 2, 13, 12, 0)  },
  { id: 805, type: 'Email', value: 'attacker@phishing-domain.com', context: 'Phishing Campaign', added: new Date(2025, 2, 13, 10, 15) },
]

const threatActorsData = [
  { id: 901, name: 'APT-29', motivation: 'Espionage', targetedIndustries: 'Manufacturing, Energy', attribution: 'Nation State', lastActivity: new Date(2025, 2, 14) },
  { id: 902, name: 'Ransomware Group A', motivation: 'Financial', targetedIndustries: 'Healthcare, Manufacturing', attribution: 'Criminal', lastActivity: new Date(2025, 2, 15) },
  { id: 903, name: 'Hacktivist Group B', motivation: 'Ideological', targetedIndustries: 'Energy, Oil & Gas', attribution: 'Hacktivist', lastActivity: new Date(2025, 2, 13) },
  { id: 904, name: 'Insider Threat', motivation: 'Various', targetedIndustries: 'All', attribution: 'Internal', lastActivity: new Date(2025, 2, 12) },
]

const maintenanceScheduleData = [
  { id: 1001, device: 'PLC-PROD-002', type: 'Firmware Update', scheduled: new Date(2025, 2, 16, 10, 0), duration: '2 hours', assignee: 'Robert Wilson' },
  { id: 1002, device: 'HMI-PROD-003', type: 'Hardware Inspection', scheduled: new Date(2025, 2, 17, 14, 0), duration: '1 hour', assignee: 'Sarah Davis' },
  { id: 1003, device: 'RTU-FIELD-001', type: 'Configuration Change', scheduled: new Date(2025, 2, 18, 9, 0), duration: '3 hours', assignee: 'Michael Brown' },
  { id: 1004, device: 'SENSOR-TEMP-005', type: 'Replacement', scheduled: new Date(2025, 2, 19, 11, 0), duration: '1 hour', assignee: 'Emma Johnson' },
]

const maintenanceHistoryData = [
  { id: 1101, device: 'PLC-PROD-001', type: 'Firmware Update', completed: new Date(2025, 2, 10, 11, 30), duration: '2 hours', technician: 'Robert Wilson' },
  { id: 1102, device: 'HMI-PROD-001', type: 'Hardware Inspection', completed: new Date(2025, 2, 12, 15, 45), duration: '1 hour', technician: 'Sarah Davis' },
  { id: 1103, device: 'SCADA-SRV-001', type: 'Security Patch', completed: new Date(2025, 2, 13, 10, 15), duration: '4 hours', technician: 'John Smith' },
  { id: 1104, device: 'SENSOR-TEMP-002', type: 'Calibration', completed: new Date(2025, 2, 14, 9, 30), duration: '1 hour', technician: 'Emma Johnson' },
]

const maintenanceRequestsData = [
  { id: 1201, device: 'RTU-FIELD-002', type: 'Firmware Update', requested: new Date(2025, 2, 15, 9, 0), priority: 'high', requestor: 'Michael Brown', status: 'pending' },
  { id: 1202, device: 'SENSOR-PRESS-001', type: 'Calibration', requested: new Date(2025, 2, 14, 16, 30), priority: 'medium', requestor: 'Sarah Davis', status: 'approved' },
  { id: 1203, device: 'PLC-PROD-003', type: 'Configuration Change', requested: new Date(2025, 2, 14, 14, 15), priority: 'low', requestor: 'Robert Wilson', status: 'pending' },
  { id: 1204, device: 'HMI-PROD-004', type: 'Hardware Inspection', requested: new Date(2025, 2, 13, 11, 45), priority: 'high', requestor: 'Emma Johnson', status: 'rejected' },
]

const policiesData = [
  { id: 1301, name: 'OT Network Segmentation', description: 'Policy for OT network isolation', status: 'active', lastUpdated: new Date(2025, 2, 10) },
  { id: 1302, name: 'Remote Access Control', description: 'Policy for secure remote access to OT systems', status: 'active', lastUpdated: new Date(2025, 2, 12) },
  { id: 1303, name: 'Firmware Update Process', description: 'Policy for OT firmware updates', status: 'active', lastUpdated: new Date(2025, 2, 14) },
  { id: 1304, name: 'Incident Response', description: 'Policy for OT security incidents', status: 'active', lastUpdated: new Date(2025, 2, 15) },
]

const vulnerabilitiesData = [
  { id: 1401, device: 'PLC-PROD-002', cve: 'CVE-2025-1234', description: 'Buffer overflow vulnerability', severity: 'critical', remediation: 'Apply firmware update' },
  { id: 1402, device: 'HMI-PROD-003', cve: 'CVE-2025-2345', description: 'Authentication bypass', severity: 'high', remediation: 'Apply security patch' },
  { id: 1403, device: 'SCADA-SRV-001', cve: 'CVE-2025-3456', description: 'Privilege escalation', severity: 'medium', remediation: 'Update software to latest version' },
  { id: 1404, device: 'RTU-FIELD-001', cve: 'CVE-2025-4567', description: 'Denial of service', severity: 'high', remediation: 'Apply firmware update' },
]

const securityZonesData = [
  { id: 1501, name: 'IT Network', devices: 120, status: 'secure', lastAssessed: new Date(2025, 2, 15) },
  { id: 1502, name: 'OT Level 3', devices: 45, status: 'secure', lastAssessed: new Date(2025, 2, 14) },
  { id: 1503, name: 'OT Level 2', devices: 30, status: 'warning', lastAssessed: new Date(2025, 2, 13) },
  { id: 1504, name: 'OT Level 1', devices: 25, status: 'secure', lastAssessed: new Date(2025, 2, 12) },
  { id: 1505, name: 'OT Level 0', devices: 28, status: 'secure', lastAssessed: new Date(2025, 2, 11) },
]

// Widget Components
export const DashboardWidgets = {
  // Metric Card Widget
  MetricCard: ({ title, value, description, trend }: { title: string, value: string, description: string, trend: 'up' | 'down' | 'neutral' }) => {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {trend === 'up' && <ArrowUp className="h-4 w-4 text-destructive" />}
            {trend === 'down' && <ArrowDown className="h-4 w-4 text-green-500" />}
            {trend === 'neutral' && <Minus className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-3xl font-bold">{value}</h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    )
  },
  
  // Alert Table Widget
  AlertTable: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Severity</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Alert</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Source</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Time</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {alertsData.map((alert) => (
                <tr key={alert.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle">
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'high' ? 'default' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle font-medium">{alert.title}</td>
                  <td className="p-4 align-middle">{alert.source}</td>
                  <td className="p-4 align-middle">{formatDateTime(alert.timestamp)}</td>
                  <td className="p-4 align-middle">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Incident Table Widget
  IncidentTable: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Severity</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Assignee</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Created</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {incidentsData.map((incident) => (
                <tr key={incident.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">#{incident.id}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={
                      incident.status === 'open' ? 'destructive' : 
                      incident.status === 'investigating' ? 'default' : 
                      incident.status === 'remediated' ? 'secondary' : 
                      'outline'
                    }>
                      {incident.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{incident.title}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={
                      incident.severity === 'critical' ? 'destructive' : 
                      incident.severity === 'high' ? 'default' : 
                      incident.severity === 'medium' ? 'secondary' : 
                      'outline'
                    }>
                      {incident.severity}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{incident.assignee}</td>
                  <td className="p-4 align-middle">{formatDateTime(incident.created)}</td>
                  <td className="p-4 align-middle">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Compliance Table Widget
  ComplianceTable: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Framework</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Control</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Last Assessed</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {complianceData.map((control) => (
                <tr key={control.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{control.framework}</td>
                  <td className="p-4 align-middle">{control.control}</td>
                  <td className="p-4 align-middle">{control.description}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={
                      control.status === 'compliant' ? 'outline' : 
                      control.status === 'non-compliant' ? 'destructive' : 
                      'secondary'
                    }>
                      {control.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{formatDate(control.lastAssessed)}</td>
                  <td className="p-4 align-middle">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Anomaly Table Widget
  AnomalyTable: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Confidence</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Detected</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {anomaliesData.map((anomaly) => (
                <tr key={anomaly.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{anomaly.type}</td>
                  <td className="p-4 align-middle">{anomaly.description}</td>
                  <td className="p-4 align-middle">{anomaly.confidence}%</td>
                  <td className="p-4 align-middle">{formatDateTime(anomaly.detected)}</td>
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Investigate</Button>
                      <Button variant="outline" size="sm">Dismiss</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Device Table Widget
  DeviceTable: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Location</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Last Seen</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {devicesData.map((device) => (
                <tr key={device.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{device.name}</td>
                  <td className="p-4 align-middle">{device.type}</td>
                  <td className="p-4 align-middle">{device.location}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={
                      device.status === 'online' ? 'outline' : 
                      device.status === 'offline' ? 'destructive' : 
                      'secondary'
                    }>
                      {device.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{formatDateTime(device.lastSeen)}</td>
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Playbook List Widget
  PlaybookList: () => {
    return (
      <div className="space-y-4">
        {playbooksData.map((playbook) => (
          <div key={playbook.id} className="flex items-start space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{playbook.name}</p>
                <Badge variant={playbook.status === 'active' ? 'outline' : 'secondary'}>
                  {playbook.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{playbook.description}</p>
              {playbook.lastRun && (
                <p className="text-xs text-muted-foreground">Last run: {formatDateTime(playbook.lastRun)}</p>
              )}
            </div>
            <Button variant="outline" size="sm">Run</Button>
          </div>
        ))}
      </div>
    )
  },
  
  // Activity Feed Widget
  ActivityFeed: () => {
    return (
      <div className="space-y-4">
        {activitiesData.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className="mt-1 rounded-full bg-primary/10 p-1">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.action}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{activity.user}</span>
                <span className="mx-1">•</span>
                <span>{activity.target}</span>
                <span className="mx-1">•</span>
                <span>{formatDateTime(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  },
  
  // Threat Feed Widget
  ThreatFeed: () => {
    return (
      <div className="space-y-4">
        {threatFeedData.map((threat) => (
          <div key={threat.id} className="flex items-start space-x-4 rounded-md border p-4">
            <div className="mt-1 rounded-full bg-primary/10 p-1">
              <AlertTriangle className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{threat.title}</p>
                <Badge variant={
                  threat.severity === 'critical' ? 'destructive' : 
                  threat.severity === 'high' ? 'default' : 
                  'secondary'
                }>
                  {threat.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Source: {threat.source}</p>
              <p className="text-xs text-muted-foreground">Published: {formatDateTime(threat.published)}</p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
        ))}
      </div>
    )
  },
  
  // IOC Table Widget
  IOCTable: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Value</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Context</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Added</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {iocData.map((ioc) => (
                <tr key={ioc.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{ioc.type}</td>
                  <td className="p-4 align-middle">{ioc.value}</td>
                  <td className="p-4 align-middle">{ioc.context}</td>
                  <td className="p-4 align-middle">{formatDate(ioc.added)}</td>
                  <td className="p-4 align-middle">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Threat Actor List Widget
  ThreatActorList: () => {
    return (
      <div className="space-y-4">
        {threatActorsData.map((actor) => (
          <div key={actor.id} className="flex items-start space-x-4 rounded-md border p-4">
            <div className="mt-1 rounded-full bg-primary/10 p-1">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{actor.name}</p>
              <p className="text-sm text-muted-foreground">Motivation: {actor.motivation}</p>
              <p className="text-sm text-muted-foreground">Targeted Industries: {actor.targetedIndustries}</p>
              <p className="text-xs text-muted-foreground">Attribution: {actor.attribution}</p>
              <p className="text-xs text-muted-foreground">Last Activity: {formatDate(actor.lastActivity)}</p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
        ))}
      </div>
    )
  },
  
  // Maintenance Schedule Widget
  MaintenanceSchedule: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Device</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Scheduled</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Duration</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Assignee</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {maintenanceScheduleData.map((maintenance) => (
                <tr key={maintenance.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{maintenance.device}</td>
                  <td className="p-4 align-middle">{maintenance.type}</td>
                  <td className="p-4 align-middle">{formatDateTime(maintenance.scheduled)}</td>
                  <td className="p-4 align-middle">{maintenance.duration}</td>
                  <td className="p-4 align-middle">{maintenance.assignee}</td>
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">Cancel</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Maintenance History Widget
  MaintenanceHistory: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Device</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Completed</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Duration</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Technician</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {maintenanceHistoryData.map((maintenance) => (
                <tr key={maintenance.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{maintenance.device}</td>
                  <td className="p-4 align-middle">{maintenance.type}</td>
                  <td className="p-4 align-middle">{formatDateTime(maintenance.completed)}</td>
                  <td className="p-4 align-middle">{maintenance.duration}</td>
                  <td className="p-4 align-middle">{maintenance.technician}</td>
                  <td className="p-4 align-middle">
                    <Button variant="outline" size="sm">View Report</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Maintenance Requests Widget
  MaintenanceRequests: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Device</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Type</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Requested</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Priority</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Requestor</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {maintenanceRequestsData.map((request) => (
                <tr key={request.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{request.device}</td>
                  <td className="p-4 align-middle">{request.type}</td>
                  <td className="p-4 align-middle">{formatDateTime(request.requested)}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={
                      request.priority === 'high' ? 'destructive' : 
                      request.priority === 'medium' ? 'default' : 
                      'secondary'
                    }>
                      {request.priority}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{request.requestor}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={
                      request.status === 'approved' ? 'outline' : 
                      request.status === 'rejected' ? 'destructive' : 
                      'secondary'
                    }>
                      {request.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Approve</Button>
                      <Button variant="outline" size="sm">Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Policy Table Widget
  PolicyTable: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Last Updated</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {policiesData.map((policy) => (
                <tr key={policy.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{policy.name}</td>
                  <td className="p-4 align-middle">{policy.description}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={policy.status === 'active' ? 'outline' : 'secondary'}>
                      {policy.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{formatDate(policy.lastUpdated)}</td>
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Vulnerability Table Widget
  VulnerabilityTable: () => {
    return (
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium">Device</th>
                <th className="h-12 px-4 text-left align-middle font-medium">CVE</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Severity</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Remediation</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {vulnerabilitiesData.map((vulnerability) => (
                <tr key={vulnerability.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <td className="p-4 align-middle font-medium">{vulnerability.device}</td>
                  <td className="p-4 align-middle">{vulnerability.cve}</td>
                  <td className="p-4 align-middle">{vulnerability.description}</td>
                  <td className="p-4 align-middle">
                    <Badge variant={
                      vulnerability.severity === 'critical' ? 'destructive' : 
                      vulnerability.severity === 'high' ? 'default' : 
                      'secondary'
                    }>
                      {vulnerability.severity}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{vulnerability.remediation}</td>
                  <td className="p-4 align-middle">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Remediate</Button>
                      <Button variant="outline" size="sm">Defer</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  
  // Security Zones Widget
  SecurityZones: () => {
    return (
      <div className="space-y-4">
        {securityZonesData.map((zone) => (
          <div key={zone.id} className="flex items-start space-x-4 rounded-md border p-4">
            <div className="mt-1 rounded-full bg-primary/10 p-1">
              {zone.status === 'secure' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{zone.name}</p>
                <Badge variant={zone.status === 'secure' ? 'outline' : 'secondary'}>
                  {zone.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Devices: {zone.devices}</p>
              <p className="text-xs text-muted-foreground">Last Assessed: {formatDate(zone.lastAssessed)}</p>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
        ))}
      </div>
    )
  },
}
