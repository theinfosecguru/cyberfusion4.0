// Types 
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

// Environment Types
export type EnvironmentType = 'IT' | 'OT' | 'Cloud';

// Data Source Types
export interface DataSource {
  id: string;
  name: string;
  type: 'SIEM' | 'IDS/IPS' | 'Firewall' | 'EDR' | 'SCADA' | 'PLC' | 'HMI' | 'CloudAPI' | 'Other';
  environment: EnvironmentType;
  connectionDetails: {
    protocol: 'MQTT' | 'OPC-UA' | 'REST' | 'SNMP' | 'Syslog' | 'Other';
    endpoint: string;
    credentials?: {
      type: 'API_KEY' | 'OAUTH' | 'BASIC' | 'CERTIFICATE';
      value: string;
    };
    pollingInterval?: number; // in seconds
  };
  status: 'active' | 'inactive' | 'error';
  lastSyncTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Asset Types
export interface Asset {
  id: string;
  name: string;
  type: 'Server' | 'Workstation' | 'Network Device' | 'PLC' | 'HMI' | 'RTU' | 'Sensor' | 'Cloud Instance' | 'Container' | 'Other';
  environment: EnvironmentType;
  ipAddress?: string;
  macAddress?: string;
  location?: string;
  owner?: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  vulnerabilities: Vulnerability[];
  patches: Patch[];
  configurations: Configuration[];
  createdAt: Date;
  updatedAt: Date;
}

// Vulnerability Types
export interface Vulnerability {
  id: string;
  assetId: string;
  cveId?: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvssScore?: number;
  status: 'open' | 'in_progress' | 'mitigated' | 'resolved' | 'accepted';
  remediationPlan?: string;
  discoveredAt: Date;
  updatedAt: Date;
}

// Patch Types
export interface Patch {
  id: string;
  assetId: string;
  name: string;
  version: string;
  description: string;
  status: 'pending' | 'applied' | 'failed';
  appliedAt?: Date;
  createdAt: Date;
}

// Configuration Types
export interface Configuration {
  id: string;
  assetId: string;
  name: string;
  value: string;
  isCompliant: boolean;
  complianceStandard?: string;
  lastChecked: Date;
}

// Risk Score Types
export interface RiskScore {
  id: string;
  assetId?: string;
  environmentType?: EnvironmentType;
  overallScore: number; // 0-100
  factors: {
    vulnerabilities: number;
    threats: number;
    compliance: number;
    exposure: number;
  };
  trend: 'increasing' | 'decreasing' | 'stable';
  calculatedAt: Date;
}

// Anomaly Types
export interface Anomaly {
  id: string;
  assetId?: string;
  dataSourceId?: string;
  type: 'network' | 'user' | 'system' | 'application' | 'ot' | 'cloud';
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  relatedEvents: string[];
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  detectedAt: Date;
  updatedAt: Date;
}

// Compliance Types
export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  description: string;
  controls: ComplianceControl[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceControl {
  id: string;
  frameworkId: string;
  controlId: string; // e.g., "AC-1", "ID.AM-1"
  name: string;
  description: string;
  requirements: string;
  status: 'compliant' | 'non_compliant' | 'partially_compliant' | 'not_applicable';
  evidence?: string;
  lastAssessedAt: Date;
}

// Incident Types
export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'assigned' | 'investigating' | 'contained' | 'remediated' | 'resolved' | 'closed';
  assignedTo?: string;
  affectedAssets: string[]; // Asset IDs
  relatedAnomalies: string[]; // Anomaly IDs
  timeline: IncidentEvent[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface IncidentEvent {
  id: string;
  incidentId: string;
  type: 'detection' | 'assignment' | 'status_change' | 'comment' | 'action' | 'evidence';
  description: string;
  user?: string;
  timestamp: Date;
}

// Policy Types
export interface Policy {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'compliance' | 'operational';
  environment: EnvironmentType | 'all';
  rules: PolicyRule[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyRule {
  id: string;
  policyId: string;
  name: string;
  description: string;
  condition: string; // JSON or DSL representation of the condition
  actions: PolicyAction[];
  status: 'active' | 'inactive';
}

export interface PolicyAction {
  id: string;
  ruleId: string;
  type: 'alert' | 'block' | 'isolate' | 'remediate' | 'notify' | 'custom';
  parameters: Record<string, any>;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'analyst' | 'engineer' | 'executive' | 'auditor';
  permissions: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Types
export interface Dashboard {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'analyst' | 'engineer' | 'custom';
  widgets: DashboardWidget[];
  owner: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardWidget {
  id: string;
  dashboardId: string;
  type: 'metric' | 'chart' | 'table' | 'alert' | 'map' | 'custom';
  title: string;
  configuration: Record<string, any>;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
}
