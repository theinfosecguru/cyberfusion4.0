// Data Ingestion 
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

import { DataSource, EnvironmentType } from './types';

/**
 * Data Ingestion Layer
 * 
 * Responsible for collecting data from various sources across IT, OT, and Cloud environments.
 * Handles data collection, buffering, and initial validation.
 */
export class DataIngestionService {
  private dataSources: Map<string, DataSource> = new Map();
  private collectionIntervals: Map<string, NodeJS.Timeout> = new Map();
  private dataBuffer: Map<string, any[]> = new Map();
  private bufferSize: number = 1000;
  private dataCallbacks: ((sourceId: string, data: any[]) => void)[] = [];

  /**
   * Register a new data source
   */
  public registerDataSource(dataSource: DataSource): void {
    this.dataSources.set(dataSource.id, dataSource);
    this.dataBuffer.set(dataSource.id, []);
    
    if (dataSource.status === 'active' && dataSource.connectionDetails.pollingInterval) {
      this.startCollection(dataSource.id);
    }
    
    console.log(`Registered data source: ${dataSource.name} (${dataSource.id})`);
  }

  /**
   * Update an existing data source
   */
  public updateDataSource(dataSource: DataSource): void {
    const existingSource = this.dataSources.get(dataSource.id);
    
    if (!existingSource) {
      throw new Error(`Data source with ID ${dataSource.id} not found`);
    }
    
    // Stop collection if it's running
    if (this.collectionIntervals.has(dataSource.id)) {
      this.stopCollection(dataSource.id);
    }
    
    // Update the data source
    this.dataSources.set(dataSource.id, dataSource);
    
    // Restart collection if active
    if (dataSource.status === 'active' && dataSource.connectionDetails.pollingInterval) {
      this.startCollection(dataSource.id);
    }
    
    console.log(`Updated data source: ${dataSource.name} (${dataSource.id})`);
  }

  /**
   * Remove a data source
   */
  public removeDataSource(dataSourceId: string): void {
    if (this.collectionIntervals.has(dataSourceId)) {
      this.stopCollection(dataSourceId);
    }
    
    this.dataSources.delete(dataSourceId);
    this.dataBuffer.delete(dataSourceId);
    
    console.log(`Removed data source: ${dataSourceId}`);
  }

  /**
   * Start data collection for a specific source
   */
  public startCollection(dataSourceId: string): void {
    const dataSource = this.dataSources.get(dataSourceId);
    
    if (!dataSource) {
      throw new Error(`Data source with ID ${dataSourceId} not found`);
    }
    
    if (this.collectionIntervals.has(dataSourceId)) {
      this.stopCollection(dataSourceId);
    }
    
    const interval = setInterval(() => {
      this.collectData(dataSourceId);
    }, (dataSource.connectionDetails.pollingInterval || 60) * 1000);
    
    this.collectionIntervals.set(dataSourceId, interval);
    console.log(`Started collection for data source: ${dataSource.name} (${dataSourceId})`);
  }

  /**
   * Stop data collection for a specific source
   */
  public stopCollection(dataSourceId: string): void {
    const interval = this.collectionIntervals.get(dataSourceId);
    
    if (interval) {
      clearInterval(interval);
      this.collectionIntervals.delete(dataSourceId);
      console.log(`Stopped collection for data source: ${dataSourceId}`);
    }
  }

  /**
   * Collect data from a specific source
   */
  private async collectData(dataSourceId: string): Promise<void> {
    const dataSource = this.dataSources.get(dataSourceId);
    
    if (!dataSource) {
      throw new Error(`Data source with ID ${dataSourceId} not found`);
    }
    
    try {
      // Simulate data collection based on source type
      const collectedData = await this.simulateDataCollection(dataSource);
      
      // Add to buffer
      const buffer = this.dataBuffer.get(dataSourceId) || [];
      buffer.push(...collectedData);
      
      // Trim buffer if it exceeds the maximum size
      if (buffer.length > this.bufferSize) {
        buffer.splice(0, buffer.length - this.bufferSize);
      }
      
      this.dataBuffer.set(dataSourceId, buffer);
      
      // Notify callbacks
      this.notifyDataCallbacks(dataSourceId, collectedData);
      
      // Update last sync time
      const updatedSource = { ...dataSource, lastSyncTime: new Date() };
      this.dataSources.set(dataSourceId, updatedSource);
      
      console.log(`Collected ${collectedData.length} records from ${dataSource.name} (${dataSourceId})`);
    } catch (error) {
      console.error(`Error collecting data from ${dataSource.name} (${dataSourceId}):`, error);
      
      // Update status to error
      const updatedSource = { ...dataSource, status: 'error' as const };
      this.dataSources.set(dataSourceId, updatedSource);
    }
  }

  /**
   * Simulate data collection based on source type
   */
  private async simulateDataCollection(dataSource: DataSource): Promise<any[]> {
    // In a real implementation, this would connect to the actual data source
    // For simulation, we'll generate random data based on the source type
    
    const count = Math.floor(Math.random() * 10) + 1; // 1-10 records
    const records = [];
    
    for (let i = 0; i < count; i++) {
      const timestamp = new Date();
      let record: any = { timestamp, sourceId: dataSource.id, sourceName: dataSource.name };
      
      switch (dataSource.type) {
        case 'SIEM':
          record = {
            ...record,
            eventType: ['alert', 'log', 'audit'][Math.floor(Math.random() * 3)],
            severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
            message: `SIEM event from ${dataSource.name}`,
          };
          break;
        case 'IDS/IPS':
          record = {
            ...record,
            eventType: 'intrusion',
            protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS'][Math.floor(Math.random() * 4)],
            sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            destinationIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
          };
          break;
        case 'Firewall':
          record = {
            ...record,
            action: ['allow', 'deny', 'drop'][Math.floor(Math.random() * 3)],
            protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
            sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            destinationIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            sourcePort: Math.floor(Math.random() * 65535),
            destinationPort: Math.floor(Math.random() * 65535),
          };
          break;
        case 'SCADA':
        case 'PLC':
        case 'HMI':
          record = {
            ...record,
            deviceId: `DEV-${Math.floor(Math.random() * 1000)}`,
            parameter: ['temperature', 'pressure', 'level', 'flow', 'status'][Math.floor(Math.random() * 5)],
            value: Math.random() * 100,
            unit: ['C', 'PSI', '%', 'L/s', 'ON/OFF'][Math.floor(Math.random() * 5)],
          };
          break;
        case 'CloudAPI':
          record = {
            ...record,
            service: ['EC2', 'S3', 'Lambda', 'Azure VM', 'GCP Compute'][Math.floor(Math.random() * 5)],
            action: ['create', 'read', 'update', 'delete'][Math.floor(Math.random() * 4)],
            resource: `resource-${Math.floor(Math.random() * 1000)}`,
            user: `user-${Math.floor(Math.random() * 100)}`,
            status: ['success', 'failure'][Math.floor(Math.random() * 2)],
          };
          break;
        default:
          record = {
            ...record,
            type: 'generic',
            data: `Sample data from ${dataSource.name}`,
          };
      }
      
      records.push(record);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
    
    return records;
  }

  /**
   * Register a callback for new data
   */
  public onData(callback: (sourceId: string, data: any[]) => void): void {
    this.dataCallbacks.push(callback);
  }

  /**
   * Notify all callbacks of new data
   */
  private notifyDataCallbacks(sourceId: string, data: any[]): void {
    for (const callback of this.dataCallbacks) {
      try {
        callback(sourceId, data);
      } catch (error) {
        console.error('Error in data callback:', error);
      }
    }
  }

  /**
   * Get all registered data sources
   */
  public getDataSources(): DataSource[] {
    return Array.from(this.dataSources.values());
  }

  /**
   * Get a specific data source
   */
  public getDataSource(dataSourceId: string): DataSource | undefined {
    return this.dataSources.get(dataSourceId);
  }

  /**
   * Get buffered data for a specific source
   */
  public getBufferedData(dataSourceId: string): any[] {
    return this.dataBuffer.get(dataSourceId) || [];
  }

  /**
   * Clear the buffer for a specific source
   */
  public clearBuffer(dataSourceId: string): void {
    this.dataBuffer.set(dataSourceId, []);
  }

  /**
   * Set the maximum buffer size
   */
  public setBufferSize(size: number): void {
    this.bufferSize = size;
  }
}

// Export a singleton instance
export const dataIngestionService = new DataIngestionService();

// Helper functions for common data source types
export const dataSourceHelpers = {
  createSIEMDataSource(name: string, endpoint: string, pollingInterval: number = 60): DataSource {
    return {
      id: `siem-${Date.now()}`,
      name,
      type: 'SIEM',
      environment: 'IT',
      connectionDetails: {
        protocol: 'REST',
        endpoint,
        pollingInterval,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
  
  createFirewallDataSource(name: string, endpoint: string, pollingInterval: number = 60): DataSource {
    return {
      id: `firewall-${Date.now()}`,
      name,
      type: 'Firewall',
      environment: 'IT',
      connectionDetails: {
        protocol: 'SNMP',
        endpoint,
        pollingInterval,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
  
  createSCADADataSource(name: string, endpoint: string, pollingInterval: number = 30): DataSource {
    return {
      id: `scada-${Date.now()}`,
      name,
      type: 'SCADA',
      environment: 'OT',
      connectionDetails: {
        protocol: 'OPC-UA',
        endpoint,
        pollingInterval,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
  
  createCloudDataSource(name: string, endpoint: string, credentials: { type: 'API_KEY' | 'OAUTH'; value: string }, pollingInterval: number = 60): DataSource {
    return {
      id: `cloud-${Date.now()}`,
      name,
      type: 'CloudAPI',
      environment: 'Cloud',
      connectionDetails: {
        protocol: 'REST',
        endpoint,
        credentials,
        pollingInterval,
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  },
};
