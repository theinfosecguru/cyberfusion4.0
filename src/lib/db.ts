// Database 
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

import { D1Database } from '@cloudflare/workers-types';
import { 
  Asset, 
  DataSource, 
  Anomaly, 
  RiskScore, 
  Incident, 
  Policy, 
  ComplianceControl, 
  User, 
  Dashboard 
} from './types';

/**
 * Database Service
 * 
 * Provides access to the D1 database for storing and retrieving data.
 * Implements data models and CRUD operations for all entities.
 */
export class DatabaseService {
  private db: D1Database | null = null;

  /**
   * Initialize the database service
   */
  public initialize(db: D1Database): void {
    this.db = db;
    console.log('Database service initialized');
  }

  /**
   * Check if the database is initialized
   */
  private checkInitialized(): void {
    if (!this.db) {
      throw new Error('Database service not initialized');
    }
  }

  /**
   * Data Source Operations
   */
  
  /**
   * Get all data sources
   */
  public async getDataSources(): Promise<DataSource[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM data_sources ORDER BY created_at DESC'
    ).all<DataSource>();
    
    return results.map(this.mapDataSource);
  }

  /**
   * Get a data source by ID
   */
  public async getDataSource(id: string): Promise<DataSource | null> {
    this.checkInitialized();
    
    const result = await this.db!.prepare(
      'SELECT * FROM data_sources WHERE id = ?'
    ).bind(id).first<DataSource>();
    
    return result ? this.mapDataSource(result) : null;
  }

  /**
   * Create a data source
   */
  public async createDataSource(dataSource: Omit<DataSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataSource> {
    this.checkInitialized();
    
    const id = `ds-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await this.db!.prepare(`
      INSERT INTO data_sources (
        id, name, type, environment, connection_details, status, last_sync_time, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      dataSource.name,
      dataSource.type,
      dataSource.environment,
      JSON.stringify(dataSource.connectionDetails),
      dataSource.status,
      dataSource.lastSyncTime?.toISOString() || null,
      now,
      now
    ).run();
    
    return {
      ...dataSource,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  /**
   * Update a data source
   */
  public async updateDataSource(id: string, dataSource: Partial<Omit<DataSource, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DataSource | null> {
    this.checkInitialized();
    
    const existing = await this.getDataSource(id);
    
    if (!existing) {
      return null;
    }
    
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];
    
    if (dataSource.name !== undefined) {
      updates.push('name = ?');
      values.push(dataSource.name);
    }
    
    if (dataSource.type !== undefined) {
      updates.push('type = ?');
      values.push(dataSource.type);
    }
    
    if (dataSource.environment !== undefined) {
      updates.push('environment = ?');
      values.push(dataSource.environment);
    }
    
    if (dataSource.connectionDetails !== undefined) {
      updates.push('connection_details = ?');
      values.push(JSON.stringify(dataSource.connectionDetails));
    }
    
    if (dataSource.status !== undefined) {
      updates.push('status = ?');
      values.push(dataSource.status);
    }
    
    if (dataSource.lastSyncTime !== undefined) {
      updates.push('last_sync_time = ?');
      values.push(dataSource.lastSyncTime.toISOString());
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    await this.db!.prepare(`
      UPDATE data_sources
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...values, id).run();
    
    return {
      ...existing,
      ...dataSource,
      updatedAt: new Date(now),
    };
  }

  /**
   * Delete a data source
   */
  public async deleteDataSource(id: string): Promise<boolean> {
    this.checkInitialized();
    
    const result = await this.db!.prepare(
      'DELETE FROM data_sources WHERE id = ?'
    ).bind(id).run();
    
    return result.success;
  }

  /**
   * Map a data source from the database
   */
  private mapDataSource(data: any): DataSource {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      environment: data.environment,
      connectionDetails: JSON.parse(data.connection_details),
      status: data.status,
      lastSyncTime: data.last_sync_time ? new Date(data.last_sync_time) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Asset Operations
   */
  
  /**
   * Get all assets
   */
  public async getAssets(): Promise<Asset[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM assets ORDER BY created_at DESC'
    ).all<Asset>();
    
    return results.map(this.mapAsset);
  }

  /**
   * Get an asset by ID
   */
  public async getAsset(id: string): Promise<Asset | null> {
    this.checkInitialized();
    
    const result = await this.db!.prepare(
      'SELECT * FROM assets WHERE id = ?'
    ).bind(id).first<Asset>();
    
    if (!result) {
      return null;
    }
    
    const asset = this.mapAsset(result);
    
    // Load related data
    asset.vulnerabilities = await this.getVulnerabilitiesForAsset(id);
    asset.patches = await this.getPatchesForAsset(id);
    asset.configurations = await this.getConfigurationsForAsset(id);
    
    return asset;
  }

  /**
   * Create an asset
   */
  public async createAsset(asset: Omit<Asset, 'id' | 'vulnerabilities' | 'patches' | 'configurations' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    this.checkInitialized();
    
    const id = `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await this.db!.prepare(`
      INSERT INTO assets (
        id, name, type, environment, ip_address, mac_address, location, owner, criticality, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      asset.name,
      asset.type,
      asset.environment,
      asset.ipAddress || null,
      asset.macAddress || null,
      asset.location || null,
      asset.owner || null,
      asset.criticality,
      now,
      now
    ).run();
    
    return {
      ...asset,
      id,
      vulnerabilities: [],
      patches: [],
      configurations: [],
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  /**
   * Update an asset
   */
  public async updateAsset(id: string, asset: Partial<Omit<Asset, 'id' | 'vulnerabilities' | 'patches' | 'configurations' | 'createdAt' | 'updatedAt'>>): Promise<Asset | null> {
    this.checkInitialized();
    
    const existing = await this.getAsset(id);
    
    if (!existing) {
      return null;
    }
    
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];
    
    if (asset.name !== undefined) {
      updates.push('name = ?');
      values.push(asset.name);
    }
    
    if (asset.type !== undefined) {
      updates.push('type = ?');
      values.push(asset.type);
    }
    
    if (asset.environment !== undefined) {
      updates.push('environment = ?');
      values.push(asset.environment);
    }
    
    if (asset.ipAddress !== undefined) {
      updates.push('ip_address = ?');
      values.push(asset.ipAddress || null);
    }
    
    if (asset.macAddress !== undefined) {
      updates.push('mac_address = ?');
      values.push(asset.macAddress || null);
    }
    
    if (asset.location !== undefined) {
      updates.push('location = ?');
      values.push(asset.location || null);
    }
    
    if (asset.owner !== undefined) {
      updates.push('owner = ?');
      values.push(asset.owner || null);
    }
    
    if (asset.criticality !== undefined) {
      updates.push('criticality = ?');
      values.push(asset.criticality);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    await this.db!.prepare(`
      UPDATE assets
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...values, id).run();
    
    return {
      ...existing,
      ...asset,
      updatedAt: new Date(now),
    };
  }

  /**
   * Delete an asset
   */
  public async deleteAsset(id: string): Promise<boolean> {
    this.checkInitialized();
    
    // Delete related data first
    await this.db!.prepare('DELETE FROM vulnerabilities WHERE asset_id = ?').bind(id).run();
    await this.db!.prepare('DELETE FROM patches WHERE asset_id = ?').bind(id).run();
    await this.db!.prepare('DELETE FROM configurations WHERE asset_id = ?').bind(id).run();
    
    // Delete the asset
    const result = await this.db!.prepare(
      'DELETE FROM assets WHERE id = ?'
    ).bind(id).run();
    
    return result.success;
  }

  /**
   * Map an asset from the database
   */
  private mapAsset(data: any): Asset {
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      environment: data.environment,
      ipAddress: data.ip_address,
      macAddress: data.mac_address,
      location: data.location,
      owner: data.owner,
      criticality: data.criticality,
      vulnerabilities: [],
      patches: [],
      configurations: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Get vulnerabilities for an asset
   */
  private async getVulnerabilitiesForAsset(assetId: string): Promise<any[]> {
    const { results } = await this.db!.prepare(
      'SELECT * FROM vulnerabilities WHERE asset_id = ? ORDER BY discovered_at DESC'
    ).bind(assetId).all();
    
    return results.map((data: any) => ({
      id: data.id,
      assetId: data.asset_id,
      cveId: data.cve_id,
      title: data.title,
      description: data.description,
      severity: data.severity,
      cvssScore: data.cvss_score,
      status: data.status,
      remediationPlan: data.remediation_plan,
      discoveredAt: new Date(data.discovered_at),
      updatedAt: new Date(data.updated_at),
    }));
  }

  /**
   * Get patches for an asset
   */
  private async getPatchesForAsset(assetId: string): Promise<any[]> {
    const { results } = await this.db!.prepare(
      'SELECT * FROM patches WHERE asset_id = ? ORDER BY created_at DESC'
    ).bind(assetId).all();
    
    return results.map((data: any) => ({
      id: data.id,
      assetId: data.asset_id,
      name: data.name,
      version: data.version,
      description: data.description,
      status: data.status,
      appliedAt: data.applied_at ? new Date(data.applied_at) : undefined,
      createdAt: new Date(data.created_at),
    }));
  }

  /**
   * Get configurations for an asset
   */
  private async getConfigurationsForAsset(assetId: string): Promise<any[]> {
    const { results } = await this.db!.prepare(
      'SELECT * FROM configurations WHERE asset_id = ? ORDER BY last_checked DESC'
    ).bind(assetId).all();
    
    return results.map((data: any) => ({
      id: data.id,
      assetId: data.asset_id,
      name: data.name,
      value: data.value,
      isCompliant: data.is_compliant === 1,
      complianceStandard: data.compliance_standard,
      lastChecked: new Date(data.last_checked),
    }));
  }

  /**
   * Risk Score Operations
   */
  
  /**
   * Get all risk scores
   */
  public async getRiskScores(): Promise<RiskScore[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM risk_scores ORDER BY calculated_at DESC'
    ).all<RiskScore>();
    
    return results.map(this.mapRiskScore);
  }

  /**
   * Get risk scores by environment
   */
  public async getRiskScoresByEnvironment(environment: string): Promise<RiskScore[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM risk_scores WHERE environment_type = ? ORDER BY calculated_at DESC'
    ).bind(environment).all<RiskScore>();
    
    return results.map(this.mapRiskScore);
  }

  /**
   * Get risk scores by asset
   */
  public async getRiskScoresByAsset(assetId: string): Promise<RiskScore[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM risk_scores WHERE asset_id = ? ORDER BY calculated_at DESC'
    ).bind(assetId).all<RiskScore>();
    
    return results.map(this.mapRiskScore);
  }

  /**
   * Create a risk score
   */
  public async createRiskScore(riskScore: Omit<RiskScore, 'id' | 'calculatedAt'>): Promise<RiskScore> {
    this.checkInitialized();
    
    const id = `risk-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await this.db!.prepare(`
      INSERT INTO risk_scores (
        id, asset_id, environment_type, overall_score, factors, trend, calculated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      riskScore.assetId || null,
      riskScore.environmentType || null,
      riskScore.overallScore,
      JSON.stringify(riskScore.factors),
      riskScore.trend,
      now
    ).run();
    
    return {
      ...riskScore,
      id,
      calculatedAt: new Date(now),
    };
  }

  /**
   * Map a risk score from the database
   */
  private mapRiskScore(data: any): RiskScore {
    return {
      id: data.id,
      assetId: data.asset_id,
      environmentType: data.environment_type,
      overallScore: data.overall_score,
      factors: JSON.parse(data.factors),
      trend: data.trend,
      calculatedAt: new Date(data.calculated_at),
    };
  }

  /**
   * Anomaly Operations
   */
  
  /**
   * Get all anomalies
   */
  public async getAnomalies(): Promise<Anomaly[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM anomalies ORDER BY detected_at DESC'
    ).all<Anomaly>();
    
    return results.map(this.mapAnomaly);
  }

  /**
   * Get anomalies by status
   */
  public async getAnomaliesByStatus(status: string): Promise<Anomaly[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM anomalies WHERE status = ? ORDER BY detected_at DESC'
    ).bind(status).all<Anomaly>();
    
    return results.map(this.mapAnomaly);
  }

  /**
   * Create an anomaly
   */
  public async createAnomaly(anomaly: Omit<Anomaly, 'id' | 'detectedAt' | 'updatedAt'>): Promise<Anomaly> {
    this.checkInitialized();
    
    const id = `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await this.db!.prepare(`
      INSERT INTO anomalies (
        id, asset_id, data_source_id, type, description, severity, confidence, related_events, status, detected_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      anomaly.assetId || null,
      anomaly.dataSourceId || null,
      anomaly.type,
      anomaly.description,
      anomaly.severity,
      anomaly.confidence,
      JSON.stringify(anomaly.relatedEvents),
      anomaly.status,
      now,
      now
    ).run();
    
    return {
      ...anomaly,
      id,
      detectedAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  /**
   * Update an anomaly
   */
  public async updateAnomaly(id: string, anomaly: Partial<Omit<Anomaly, 'id' | 'detectedAt' | 'updatedAt'>>): Promise<Anomaly | null> {
    this.checkInitialized();
    
    const existing = await this.getAnomaly(id);
    
    if (!existing) {
      return null;
    }
    
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];
    
    if (anomaly.status !== undefined) {
      updates.push('status = ?');
      values.push(anomaly.status);
    }
    
    if (anomaly.severity !== undefined) {
      updates.push('severity = ?');
      values.push(anomaly.severity);
    }
    
    if (anomaly.confidence !== undefined) {
      updates.push('confidence = ?');
      values.push(anomaly.confidence);
    }
    
    if (anomaly.description !== undefined) {
      updates.push('description = ?');
      values.push(anomaly.description);
    }
    
    if (anomaly.relatedEvents !== undefined) {
      updates.push('related_events = ?');
      values.push(JSON.stringify(anomaly.relatedEvents));
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    await this.db!.prepare(`
      UPDATE anomalies
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...values, id).run();
    
    return {
      ...existing,
      ...anomaly,
      updatedAt: new Date(now),
    };
  }

  /**
   * Get an anomaly by ID
   */
  public async getAnomaly(id: string): Promise<Anomaly | null> {
    this.checkInitialized();
    
    const result = await this.db!.prepare(
      'SELECT * FROM anomalies WHERE id = ?'
    ).bind(id).first<Anomaly>();
    
    return result ? this.mapAnomaly(result) : null;
  }

  /**
   * Map an anomaly from the database
   */
  private mapAnomaly(data: any): Anomaly {
    return {
      id: data.id,
      assetId: data.asset_id,
      dataSourceId: data.data_source_id,
      type: data.type,
      description: data.description,
      severity: data.severity,
      confidence: data.confidence,
      relatedEvents: JSON.parse(data.related_events),
      status: data.status,
      detectedAt: new Date(data.detected_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Incident Operations
   */
  
  /**
   * Get all incidents
   */
  public async getIncidents(): Promise<Incident[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM incidents ORDER BY created_at DESC'
    ).all<Incident>();
    
    const incidents = await Promise.all(results.map(async (data: any) => {
      const incident = this.mapIncident(data);
      incident.timeline = await this.getIncidentEvents(incident.id);
      return incident;
    }));
    
    return incidents;
  }

  /**
   * Get incidents by status
   */
  public async getIncidentsByStatus(status: string): Promise<Incident[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM incidents WHERE status = ? ORDER BY created_at DESC'
    ).bind(status).all<Incident>();
    
    const incidents = await Promise.all(results.map(async (data: any) => {
      const incident = this.mapIncident(data);
      incident.timeline = await this.getIncidentEvents(incident.id);
      return incident;
    }));
    
    return incidents;
  }

  /**
   * Get an incident by ID
   */
  public async getIncident(id: string): Promise<Incident | null> {
    this.checkInitialized();
    
    const result = await this.db!.prepare(
      'SELECT * FROM incidents WHERE id = ?'
    ).bind(id).first<Incident>();
    
    if (!result) {
      return null;
    }
    
    const incident = this.mapIncident(result);
    incident.timeline = await this.getIncidentEvents(id);
    
    return incident;
  }

  /**
   * Create an incident
   */
  public async createIncident(incident: Omit<Incident, 'id' | 'timeline' | 'createdAt' | 'updatedAt' | 'resolvedAt'>): Promise<Incident> {
    this.checkInitialized();
    
    const id = `incident-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await this.db!.prepare(`
      INSERT INTO incidents (
        id, title, description, severity, status, assigned_to, affected_assets, related_anomalies, created_at, updated_at, resolved_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      incident.title,
      incident.description,
      incident.severity,
      incident.status,
      incident.assignedTo || null,
      JSON.stringify(incident.affectedAssets),
      JSON.stringify(incident.relatedAnomalies),
      now,
      now,
      null
    ).run();
    
    // Create initial event
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db!.prepare(`
      INSERT INTO incident_events (
        id, incident_id, type, description, user, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      eventId,
      id,
      'detection',
      'Incident created',
      null,
      now
    ).run();
    
    return {
      ...incident,
      id,
      timeline: [
        {
          id: eventId,
          incidentId: id,
          type: 'detection',
          description: 'Incident created',
          timestamp: new Date(now),
        }
      ],
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  /**
   * Update an incident
   */
  public async updateIncident(id: string, incident: Partial<Omit<Incident, 'id' | 'timeline' | 'createdAt' | 'updatedAt'>>): Promise<Incident | null> {
    this.checkInitialized();
    
    const existing = await this.getIncident(id);
    
    if (!existing) {
      return null;
    }
    
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];
    
    if (incident.title !== undefined) {
      updates.push('title = ?');
      values.push(incident.title);
    }
    
    if (incident.description !== undefined) {
      updates.push('description = ?');
      values.push(incident.description);
    }
    
    if (incident.severity !== undefined) {
      updates.push('severity = ?');
      values.push(incident.severity);
    }
    
    if (incident.status !== undefined) {
      updates.push('status = ?');
      values.push(incident.status);
      
      // If status is resolved, set resolved_at
      if (incident.status === 'resolved' || incident.status === 'closed') {
        updates.push('resolved_at = ?');
        values.push(now);
      }
    }
    
    if (incident.assignedTo !== undefined) {
      updates.push('assigned_to = ?');
      values.push(incident.assignedTo || null);
    }
    
    if (incident.affectedAssets !== undefined) {
      updates.push('affected_assets = ?');
      values.push(JSON.stringify(incident.affectedAssets));
    }
    
    if (incident.relatedAnomalies !== undefined) {
      updates.push('related_anomalies = ?');
      values.push(JSON.stringify(incident.relatedAnomalies));
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    await this.db!.prepare(`
      UPDATE incidents
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...values, id).run();
    
    // Add status change event if status changed
    if (incident.status !== undefined && incident.status !== existing.status) {
      await this.addIncidentEvent(id, {
        type: 'status_change',
        description: `Status changed from ${existing.status} to ${incident.status}`,
        timestamp: new Date(now),
      });
    }
    
    // Add assignment event if assignee changed
    if (incident.assignedTo !== undefined && incident.assignedTo !== existing.assignedTo) {
      await this.addIncidentEvent(id, {
        type: 'assignment',
        description: `Assigned to ${incident.assignedTo || 'nobody'}`,
        timestamp: new Date(now),
      });
    }
    
    return await this.getIncident(id);
  }

  /**
   * Add an event to an incident
   */
  public async addIncidentEvent(incidentId: string, event: { type: string; description: string; user?: string; timestamp: Date }): Promise<string> {
    this.checkInitialized();
    
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db!.prepare(`
      INSERT INTO incident_events (
        id, incident_id, type, description, user, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      incidentId,
      event.type,
      event.description,
      event.user || null,
      event.timestamp.toISOString()
    ).run();
    
    // Update incident updated_at
    await this.db!.prepare(`
      UPDATE incidents
      SET updated_at = ?
      WHERE id = ?
    `).bind(event.timestamp.toISOString(), incidentId).run();
    
    return id;
  }

  /**
   * Get events for an incident
   */
  private async getIncidentEvents(incidentId: string): Promise<any[]> {
    const { results } = await this.db!.prepare(
      'SELECT * FROM incident_events WHERE incident_id = ? ORDER BY timestamp ASC'
    ).bind(incidentId).all();
    
    return results.map((data: any) => ({
      id: data.id,
      incidentId: data.incident_id,
      type: data.type,
      description: data.description,
      user: data.user,
      timestamp: new Date(data.timestamp),
    }));
  }

  /**
   * Map an incident from the database
   */
  private mapIncident(data: any): Incident {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      severity: data.severity,
      status: data.status,
      assignedTo: data.assigned_to,
      affectedAssets: JSON.parse(data.affected_assets),
      relatedAnomalies: JSON.parse(data.related_anomalies),
      timeline: [],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      resolvedAt: data.resolved_at ? new Date(data.resolved_at) : undefined,
    };
  }

  /**
   * User Operations
   */
  
  /**
   * Get all users
   */
  public async getUsers(): Promise<User[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM users ORDER BY created_at DESC'
    ).all<User>();
    
    return results.map(this.mapUser);
  }

  /**
   * Get a user by ID
   */
  public async getUser(id: string): Promise<User | null> {
    this.checkInitialized();
    
    const result = await this.db!.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(id).first<User>();
    
    return result ? this.mapUser(result) : null;
  }

  /**
   * Get a user by username
   */
  public async getUserByUsername(username: string): Promise<User | null> {
    this.checkInitialized();
    
    const result = await this.db!.prepare(
      'SELECT * FROM users WHERE username = ?'
    ).bind(username).first<User>();
    
    return result ? this.mapUser(result) : null;
  }

  /**
   * Create a user
   */
  public async createUser(user: Omit<User, 'id' | 'lastLogin' | 'createdAt' | 'updatedAt'>): Promise<User> {
    this.checkInitialized();
    
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await this.db!.prepare(`
      INSERT INTO users (
        id, username, email, first_name, last_name, role, permissions, last_login, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      user.username,
      user.email,
      user.firstName,
      user.lastName,
      user.role,
      JSON.stringify(user.permissions),
      null,
      now,
      now
    ).run();
    
    return {
      ...user,
      id,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  /**
   * Update a user
   */
  public async updateUser(id: string, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User | null> {
    this.checkInitialized();
    
    const existing = await this.getUser(id);
    
    if (!existing) {
      return null;
    }
    
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];
    
    if (user.username !== undefined) {
      updates.push('username = ?');
      values.push(user.username);
    }
    
    if (user.email !== undefined) {
      updates.push('email = ?');
      values.push(user.email);
    }
    
    if (user.firstName !== undefined) {
      updates.push('first_name = ?');
      values.push(user.firstName);
    }
    
    if (user.lastName !== undefined) {
      updates.push('last_name = ?');
      values.push(user.lastName);
    }
    
    if (user.role !== undefined) {
      updates.push('role = ?');
      values.push(user.role);
    }
    
    if (user.permissions !== undefined) {
      updates.push('permissions = ?');
      values.push(JSON.stringify(user.permissions));
    }
    
    if (user.lastLogin !== undefined) {
      updates.push('last_login = ?');
      values.push(user.lastLogin.toISOString());
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    await this.db!.prepare(`
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...values, id).run();
    
    return {
      ...existing,
      ...user,
      updatedAt: new Date(now),
    };
  }

  /**
   * Delete a user
   */
  public async deleteUser(id: string): Promise<boolean> {
    this.checkInitialized();
    
    const result = await this.db!.prepare(
      'DELETE FROM users WHERE id = ?'
    ).bind(id).run();
    
    return result.success;
  }

  /**
   * Map a user from the database
   */
  private mapUser(data: any): User {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      permissions: JSON.parse(data.permissions),
      lastLogin: data.last_login ? new Date(data.last_login) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  /**
   * Dashboard Operations
   */
  
  /**
   * Get all dashboards
   */
  public async getDashboards(): Promise<Dashboard[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM dashboards ORDER BY created_at DESC'
    ).all<Dashboard>();
    
    const dashboards = await Promise.all(results.map(async (data: any) => {
      const dashboard = this.mapDashboard(data);
      dashboard.widgets = await this.getDashboardWidgets(dashboard.id);
      return dashboard;
    }));
    
    return dashboards;
  }

  /**
   * Get dashboards by owner
   */
  public async getDashboardsByOwner(owner: string): Promise<Dashboard[]> {
    this.checkInitialized();
    
    const { results } = await this.db!.prepare(
      'SELECT * FROM dashboards WHERE owner = ? ORDER BY created_at DESC'
    ).bind(owner).all<Dashboard>();
    
    const dashboards = await Promise.all(results.map(async (data: any) => {
      const dashboard = this.mapDashboard(data);
      dashboard.widgets = await this.getDashboardWidgets(dashboard.id);
      return dashboard;
    }));
    
    return dashboards;
  }

  /**
   * Get a dashboard by ID
   */
  public async getDashboard(id: string): Promise<Dashboard | null> {
    this.checkInitialized();
    
    const result = await this.db!.prepare(
      'SELECT * FROM dashboards WHERE id = ?'
    ).bind(id).first<Dashboard>();
    
    if (!result) {
      return null;
    }
    
    const dashboard = this.mapDashboard(result);
    dashboard.widgets = await this.getDashboardWidgets(id);
    
    return dashboard;
  }

  /**
   * Create a dashboard
   */
  public async createDashboard(dashboard: Omit<Dashboard, 'id' | 'widgets' | 'createdAt' | 'updatedAt'>): Promise<Dashboard> {
    this.checkInitialized();
    
    const id = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    await this.db!.prepare(`
      INSERT INTO dashboards (
        id, name, description, type, owner, is_public, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      dashboard.name,
      dashboard.description,
      dashboard.type,
      dashboard.owner,
      dashboard.isPublic ? 1 : 0,
      now,
      now
    ).run();
    
    return {
      ...dashboard,
      id,
      widgets: [],
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  /**
   * Update a dashboard
   */
  public async updateDashboard(id: string, dashboard: Partial<Omit<Dashboard, 'id' | 'widgets' | 'createdAt' | 'updatedAt'>>): Promise<Dashboard | null> {
    this.checkInitialized();
    
    const existing = await this.getDashboard(id);
    
    if (!existing) {
      return null;
    }
    
    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];
    
    if (dashboard.name !== undefined) {
      updates.push('name = ?');
      values.push(dashboard.name);
    }
    
    if (dashboard.description !== undefined) {
      updates.push('description = ?');
      values.push(dashboard.description);
    }
    
    if (dashboard.type !== undefined) {
      updates.push('type = ?');
      values.push(dashboard.type);
    }
    
    if (dashboard.owner !== undefined) {
      updates.push('owner = ?');
      values.push(dashboard.owner);
    }
    
    if (dashboard.isPublic !== undefined) {
      updates.push('is_public = ?');
      values.push(dashboard.isPublic ? 1 : 0);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    
    await this.db!.prepare(`
      UPDATE dashboards
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...values, id).run();
    
    return await this.getDashboard(id);
  }

  /**
   * Delete a dashboard
   */
  public async deleteDashboard(id: string): Promise<boolean> {
    this.checkInitialized();
    
    // Delete widgets first
    await this.db!.prepare('DELETE FROM dashboard_widgets WHERE dashboard_id = ?').bind(id).run();
    
    // Delete the dashboard
    const result = await this.db!.prepare(
      'DELETE FROM dashboards WHERE id = ?'
    ).bind(id).run();
    
    return result.success;
  }

  /**
   * Add a widget to a dashboard
   */
  public async addDashboardWidget(dashboardId: string, widget: Omit<any, 'id' | 'dashboardId'>): Promise<string> {
    this.checkInitialized();
    
    const id = `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db!.prepare(`
      INSERT INTO dashboard_widgets (
        id, dashboard_id, type, title, configuration, position_x, position_y, position_width, position_height
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      dashboardId,
      widget.type,
      widget.title,
      JSON.stringify(widget.configuration),
      widget.position.x,
      widget.position.y,
      widget.position.width,
      widget.position.height
    ).run();
    
    // Update dashboard updated_at
    await this.db!.prepare(`
      UPDATE dashboards
      SET updated_at = ?
      WHERE id = ?
    `).bind(new Date().toISOString(), dashboardId).run();
    
    return id;
  }

  /**
   * Update a dashboard widget
   */
  public async updateDashboardWidget(id: string, widget: Partial<Omit<any, 'id' | 'dashboardId'>>): Promise<boolean> {
    this.checkInitialized();
    
    const updates: string[] = [];
    const values: any[] = [];
    
    if (widget.type !== undefined) {
      updates.push('type = ?');
      values.push(widget.type);
    }
    
    if (widget.title !== undefined) {
      updates.push('title = ?');
      values.push(widget.title);
    }
    
    if (widget.configuration !== undefined) {
      updates.push('configuration = ?');
      values.push(JSON.stringify(widget.configuration));
    }
    
    if (widget.position !== undefined) {
      if (widget.position.x !== undefined) {
        updates.push('position_x = ?');
        values.push(widget.position.x);
      }
      
      if (widget.position.y !== undefined) {
        updates.push('position_y = ?');
        values.push(widget.position.y);
      }
      
      if (widget.position.width !== undefined) {
        updates.push('position_width = ?');
        values.push(widget.position.width);
      }
      
      if (widget.position.height !== undefined) {
        updates.push('position_height = ?');
        values.push(widget.position.height);
      }
    }
    
    if (updates.length === 0) {
      return true;
    }
    
    const result = await this.db!.prepare(`
      UPDATE dashboard_widgets
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...values, id).run();
    
    // Get dashboard ID
    const widget_data = await this.db!.prepare(
      'SELECT dashboard_id FROM dashboard_widgets WHERE id = ?'
    ).bind(id).first();
    
    if (widget_data) {
      // Update dashboard updated_at
      await this.db!.prepare(`
        UPDATE dashboards
        SET updated_at = ?
        WHERE id = ?
      `).bind(new Date().toISOString(), widget_data.dashboard_id).run();
    }
    
    return result.success;
  }

  /**
   * Delete a dashboard widget
   */
  public async deleteDashboardWidget(id: string): Promise<boolean> {
    this.checkInitialized();
    
    // Get dashboard ID
    const widget_data = await this.db!.prepare(
      'SELECT dashboard_id FROM dashboard_widgets WHERE id = ?'
    ).bind(id).first();
    
    const result = await this.db!.prepare(
      'DELETE FROM dashboard_widgets WHERE id = ?'
    ).bind(id).run();
    
    if (widget_data && result.success) {
      // Update dashboard updated_at
      await this.db!.prepare(`
        UPDATE dashboards
        SET updated_at = ?
        WHERE id = ?
      `).bind(new Date().toISOString(), widget_data.dashboard_id).run();
    }
    
    return result.success;
  }

  /**
   * Get widgets for a dashboard
   */
  private async getDashboardWidgets(dashboardId: string): Promise<any[]> {
    const { results } = await this.db!.prepare(
      'SELECT * FROM dashboard_widgets WHERE dashboard_id = ?'
    ).bind(dashboardId).all();
    
    return results.map((data: any) => ({
      id: data.id,
      dashboardId: data.dashboard_id,
      type: data.type,
      title: data.title,
      configuration: JSON.parse(data.configuration),
      position: {
        x: data.position_x,
        y: data.position_y,
        width: data.position_width,
        height: data.position_height,
      },
    }));
  }

  /**
   * Map a dashboard from the database
   */
  private mapDashboard(data: any): Dashboard {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type,
      widgets: [],
      owner: data.owner,
      isPublic: data.is_public === 1,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

// Export a singleton instance
export const databaseService = new DatabaseService();

// Initialize the database service with the D1 database
export function initializeDatabase(db: D1Database): void {
  databaseService.initialize(db);
}
