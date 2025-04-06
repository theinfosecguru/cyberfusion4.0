// Data Processing 
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

import { dataIngestionService } from './dataIngestion';
import { EnvironmentType } from './types';

/**
 * Data Processing Layer
 * 
 * Responsible for normalizing, enriching, and transforming data collected from various sources.
 * Prepares data for analysis and storage.
 */
export class DataProcessingService {
  private processors: Map<string, DataProcessor> = new Map();
  private enrichers: Map<string, DataEnricher> = new Map();
  private processingCallbacks: ((processedData: ProcessedData) => void)[] = [];

  constructor() {
    // Register for data ingestion events
    dataIngestionService.onData(this.handleNewData.bind(this));
  }

  /**
   * Handle new data from the ingestion layer
   */
  private handleNewData(sourceId: string, data: any[]): void {
    const dataSource = dataIngestionService.getDataSource(sourceId);
    
    if (!dataSource) {
      console.warn(`Received data for unknown source: ${sourceId}`);
      return;
    }
    
    // Process the data
    const processedData = this.processData(dataSource.environment, dataSource.type, data);
    
    // Notify callbacks
    this.notifyProcessingCallbacks(processedData);
  }

  /**
   * Process data based on environment and source type
   */
  private processData(environment: EnvironmentType, sourceType: string, data: any[]): ProcessedData {
    // Find appropriate processor
    const processorKey = `${environment}:${sourceType}`;
    const processor = this.processors.get(processorKey) || this.processors.get(environment) || this.defaultProcessor;
    
    // Normalize the data
    const normalizedData = processor.normalize(data);
    
    // Enrich the data
    let enrichedData = normalizedData;
    for (const enricher of this.enrichers.values()) {
      if (enricher.canEnrich(environment, sourceType)) {
        enrichedData = enricher.enrich(enrichedData);
      }
    }
    
    return {
      environment,
      sourceType,
      originalCount: data.length,
      normalizedCount: normalizedData.length,
      enrichedCount: enrichedData.length,
      data: enrichedData,
      timestamp: new Date(),
    };
  }

  /**
   * Register a data processor
   */
  public registerProcessor(key: string, processor: DataProcessor): void {
    this.processors.set(key, processor);
    console.log(`Registered data processor: ${key}`);
  }

  /**
   * Register a data enricher
   */
  public registerEnricher(key: string, enricher: DataEnricher): void {
    this.enrichers.set(key, enricher);
    console.log(`Registered data enricher: ${key}`);
  }

  /**
   * Register a callback for processed data
   */
  public onProcessedData(callback: (processedData: ProcessedData) => void): void {
    this.processingCallbacks.push(callback);
  }

  /**
   * Notify all callbacks of processed data
   */
  private notifyProcessingCallbacks(processedData: ProcessedData): void {
    for (const callback of this.processingCallbacks) {
      try {
        callback(processedData);
      } catch (error) {
        console.error('Error in processing callback:', error);
      }
    }
  }

  /**
   * Default data processor
   */
  private defaultProcessor: DataProcessor = {
    normalize(data: any[]): NormalizedData[] {
      return data.map(item => ({
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: item.timestamp || new Date(),
        source: {
          id: item.sourceId || 'unknown',
          name: item.sourceName || 'Unknown Source',
          type: item.sourceType || 'unknown',
        },
        data: item,
        normalized: true,
      }));
    }
  };
}

/**
 * Data Processor Interface
 */
export interface DataProcessor {
  normalize(data: any[]): NormalizedData[];
}

/**
 * Data Enricher Interface
 */
export interface DataEnricher {
  canEnrich(environment: EnvironmentType, sourceType: string): boolean;
  enrich(data: NormalizedData[]): NormalizedData[];
}

/**
 * Normalized Data Structure
 */
export interface NormalizedData {
  id: string;
  timestamp: Date;
  source: {
    id: string;
    name: string;
    type: string;
  };
  data: any;
  normalized: boolean;
  enriched?: boolean;
  enrichments?: Record<string, any>;
}

/**
 * Processed Data Structure
 */
export interface ProcessedData {
  environment: EnvironmentType;
  sourceType: string;
  originalCount: number;
  normalizedCount: number;
  enrichedCount: number;
  data: NormalizedData[];
  timestamp: Date;
}

// Export a singleton instance
export const dataProcessingService = new DataProcessingService();

// Register default processors
dataProcessingService.registerProcessor('IT', {
  normalize(data: any[]): NormalizedData[] {
    return data.map(item => ({
      id: `it-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: item.timestamp || new Date(),
      source: {
        id: item.sourceId || 'unknown',
        name: item.sourceName || 'Unknown Source',
        type: item.sourceType || 'unknown',
      },
      data: {
        ...item,
        environment: 'IT',
      },
      normalized: true,
    }));
  }
});

dataProcessingService.registerProcessor('OT', {
  normalize(data: any[]): NormalizedData[] {
    return data.map(item => ({
      id: `ot-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: item.timestamp || new Date(),
      source: {
        id: item.sourceId || 'unknown',
        name: item.sourceName || 'Unknown Source',
        type: item.sourceType || 'unknown',
      },
      data: {
        ...item,
        environment: 'OT',
      },
      normalized: true,
    }));
  }
});

dataProcessingService.registerProcessor('Cloud', {
  normalize(data: any[]): NormalizedData[] {
    return data.map(item => ({
      id: `cloud-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: item.timestamp || new Date(),
      source: {
        id: item.sourceId || 'unknown',
        name: item.sourceName || 'Unknown Source',
        type: item.sourceType || 'unknown',
      },
      data: {
        ...item,
        environment: 'Cloud',
      },
      normalized: true,
    }));
  }
});

// Register default enrichers
dataProcessingService.registerEnricher('threat-intel', {
  canEnrich(environment: EnvironmentType, sourceType: string): boolean {
    // Can enrich all data
    return true;
  },
  
  enrich(data: NormalizedData[]): NormalizedData[] {
    return data.map(item => {
      // Simulate threat intelligence enrichment
      const hasIpAddress = item.data.sourceIP || item.data.destinationIP;
      
      if (hasIpAddress) {
        return {
          ...item,
          enriched: true,
          enrichments: {
            ...item.enrichments,
            threatIntel: {
              malicious: Math.random() < 0.1, // 10% chance of being malicious
              score: Math.floor(Math.random() * 100),
              categories: Math.random() < 0.1 ? ['malware', 'c2', 'botnet'].slice(0, Math.floor(Math.random() * 3) + 1) : [],
            }
          }
        };
      }
      
      return item;
    });
  }
});

dataProcessingService.registerEnricher('asset-context', {
  canEnrich(environment: EnvironmentType, sourceType: string): boolean {
    // Can enrich all data
    return true;
  },
  
  enrich(data: NormalizedData[]): NormalizedData[] {
    return data.map(item => {
      // Simulate asset context enrichment
      const deviceId = item.data.deviceId || item.data.resource;
      
      if (deviceId) {
        return {
          ...item,
          enriched: true,
          enrichments: {
            ...item.enrichments,
            assetContext: {
              criticality: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
              owner: `Department ${Math.floor(Math.random() * 5) + 1}`,
              location: `Location ${Math.floor(Math.random() * 3) + 1}`,
            }
          }
        };
      }
      
      return item;
    });
  }
});
