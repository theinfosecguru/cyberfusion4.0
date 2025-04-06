// Analytics 
/**
 * Copyright (c) 2025 OryxForge Labs LLC
 * CyberFusion 4.0 - "Securing Convergence, Empowering Innovation"
 * All rights reserved.
 */

import { dataProcessingService, NormalizedData, ProcessedData } from './dataProcessing';
import { Anomaly, RiskScore, Asset, ComplianceControl, EnvironmentType } from './types';

/**
 * Analytics Layer
 * 
 * Responsible for risk scoring, anomaly detection, and compliance monitoring.
 * Analyzes processed data to identify security issues and generate insights.
 */
export class AnalyticsService {
  private riskScoreEngines: Map<string, RiskScoreEngine> = new Map();
  private anomalyDetectors: Map<string, AnomalyDetector> = new Map();
  private complianceMonitors: Map<string, ComplianceMonitor> = new Map();
  private analyticsCallbacks: ((analyticsResult: AnalyticsResult) => void)[] = [];
  
  // Cache for risk scores and anomalies
  private riskScores: Map<string, RiskScore> = new Map();
  private anomalies: Map<string, Anomaly> = new Map();
  private complianceStatus: Map<string, ComplianceControl> = new Map();

  constructor() {
    // Register for data processing events
    dataProcessingService.onProcessedData(this.handleProcessedData.bind(this));
  }

  /**
   * Handle processed data from the processing layer
   */
  private handleProcessedData(processedData: ProcessedData): void {
    // Analyze the data
    const analyticsResult = this.analyzeData(processedData);
    
    // Notify callbacks
    this.notifyAnalyticsCallbacks(analyticsResult);
  }

  /**
   * Analyze data to generate risk scores, detect anomalies, and check compliance
   */
  private analyzeData(processedData: ProcessedData): AnalyticsResult {
    const { environment, sourceType, data } = processedData;
    
    // Calculate risk scores
    const riskScores = this.calculateRiskScores(environment, sourceType, data);
    
    // Detect anomalies
    const anomalies = this.detectAnomalies(environment, sourceType, data);
    
    // Check compliance
    const complianceResults = this.checkCompliance(environment, sourceType, data);
    
    return {
      environment,
      sourceType,
      timestamp: new Date(),
      riskScores,
      anomalies,
      complianceResults,
    };
  }

  /**
   * Calculate risk scores
   */
  private calculateRiskScores(environment: EnvironmentType, sourceType: string, data: NormalizedData[]): RiskScore[] {
    const riskScores: RiskScore[] = [];
    
    // Find appropriate risk score engine
    const engineKey = `${environment}:${sourceType}`;
    const engine = this.riskScoreEngines.get(engineKey) || 
                   this.riskScoreEngines.get(environment) || 
                   this.defaultRiskScoreEngine;
    
    // Calculate risk scores
    const newScores = engine.calculateRiskScores(data);
    
    // Update cache and return
    for (const score of newScores) {
      this.riskScores.set(score.id, score);
      riskScores.push(score);
    }
    
    return riskScores;
  }

  /**
   * Detect anomalies
   */
  private detectAnomalies(environment: EnvironmentType, sourceType: string, data: NormalizedData[]): Anomaly[] {
    const anomalies: Anomaly[] = [];
    
    // Find appropriate anomaly detector
    const detectorKey = `${environment}:${sourceType}`;
    const detector = this.anomalyDetectors.get(detectorKey) || 
                     this.anomalyDetectors.get(environment) || 
                     this.defaultAnomalyDetector;
    
    // Detect anomalies
    const newAnomalies = detector.detectAnomalies(data);
    
    // Update cache and return
    for (const anomaly of newAnomalies) {
      this.anomalies.set(anomaly.id, anomaly);
      anomalies.push(anomaly);
    }
    
    return anomalies;
  }

  /**
   * Check compliance
   */
  private checkCompliance(environment: EnvironmentType, sourceType: string, data: NormalizedData[]): ComplianceResult[] {
    const complianceResults: ComplianceResult[] = [];
    
    // Find appropriate compliance monitor
    const monitorKey = `${environment}:${sourceType}`;
    const monitor = this.complianceMonitors.get(monitorKey) || 
                    this.complianceMonitors.get(environment) || 
                    this.defaultComplianceMonitor;
    
    // Check compliance
    const results = monitor.checkCompliance(data);
    
    // Update cache and return
    for (const result of results) {
      if (result.control) {
        this.complianceStatus.set(result.control.id, result.control);
      }
      complianceResults.push(result);
    }
    
    return complianceResults;
  }

  /**
   * Register a risk score engine
   */
  public registerRiskScoreEngine(key: string, engine: RiskScoreEngine): void {
    this.riskScoreEngines.set(key, engine);
    console.log(`Registered risk score engine: ${key}`);
  }

  /**
   * Register an anomaly detector
   */
  public registerAnomalyDetector(key: string, detector: AnomalyDetector): void {
    this.anomalyDetectors.set(key, detector);
    console.log(`Registered anomaly detector: ${key}`);
  }

  /**
   * Register a compliance monitor
   */
  public registerComplianceMonitor(key: string, monitor: ComplianceMonitor): void {
    this.complianceMonitors.set(key, monitor);
    console.log(`Registered compliance monitor: ${key}`);
  }

  /**
   * Register a callback for analytics results
   */
  public onAnalyticsResult(callback: (analyticsResult: AnalyticsResult) => void): void {
    this.analyticsCallbacks.push(callback);
  }

  /**
   * Notify all callbacks of analytics results
   */
  private notifyAnalyticsCallbacks(analyticsResult: AnalyticsResult): void {
    for (const callback of this.analyticsCallbacks) {
      try {
        callback(analyticsResult);
      } catch (error) {
        console.error('Error in analytics callback:', error);
      }
    }
  }

  /**
   * Get all risk scores
   */
  public getRiskScores(): RiskScore[] {
    return Array.from(this.riskScores.values());
  }

  /**
   * Get a specific risk score
   */
  public getRiskScore(id: string): RiskScore | undefined {
    return this.riskScores.get(id);
  }

  /**
   * Get all anomalies
   */
  public getAnomalies(): Anomaly[] {
    return Array.from(this.anomalies.values());
  }

  /**
   * Get a specific anomaly
   */
  public getAnomaly(id: string): Anomaly | undefined {
    return this.anomalies.get(id);
  }

  /**
   * Get compliance status
   */
  public getComplianceStatus(): ComplianceControl[] {
    return Array.from(this.complianceStatus.values());
  }

  /**
   * Default risk score engine
   */
  private defaultRiskScoreEngine: RiskScoreEngine = {
    calculateRiskScores(data: NormalizedData[]): RiskScore[] {
      // Group data by environment
      const environmentData: Record<string, NormalizedData[]> = {};
      
      for (const item of data) {
        const env = item.data.environment || 'unknown';
        environmentData[env] = environmentData[env] || [];
        environmentData[env].push(item);
      }
      
      // Calculate risk scores for each environment
      const riskScores: RiskScore[] = [];
      
      for (const [env, envData] of Object.entries(environmentData)) {
        // Calculate factors
        const vulnerabilityFactor = Math.min(100, Math.floor(Math.random() * 50) + 20);
        const threatFactor = Math.min(100, Math.floor(Math.random() * 40) + 10);
        const complianceFactor = Math.min(100, Math.floor(Math.random() * 30) + 40);
        const exposureFactor = Math.min(100, Math.floor(Math.random() * 20) + 30);
        
        // Calculate overall score (weighted average)
        const overallScore = Math.floor(
          (vulnerabilityFactor * 0.3) +
          (threatFactor * 0.3) +
          (complianceFactor * 0.2) +
          (exposureFactor * 0.2)
        );
        
        // Determine trend
        const trend = ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable';
        
        riskScores.push({
          id: `risk-${env}-${Date.now()}`,
          environmentType: env as EnvironmentType,
          overallScore,
          factors: {
            vulnerabilities: vulnerabilityFactor,
            threats: threatFactor,
            compliance: complianceFactor,
            exposure: exposureFactor,
          },
          trend,
          calculatedAt: new Date(),
        });
      }
      
      return riskScores;
    }
  };

  /**
   * Default anomaly detector
   */
  private defaultAnomalyDetector: AnomalyDetector = {
    detectAnomalies(data: NormalizedData[]): Anomaly[] {
      const anomalies: Anomaly[] = [];
      
      // Simple random anomaly detection (for simulation)
      // In a real implementation, this would use statistical or ML-based detection
      
      for (const item of data) {
        // 5% chance of detecting an anomaly
        if (Math.random() < 0.05) {
          const anomalyTypes = ['network', 'user', 'system', 'application', 'ot', 'cloud'];
          const severities = ['critical', 'high', 'medium', 'low'];
          
          anomalies.push({
            id: `anomaly-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            dataSourceId: item.source.id,
            type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)] as any,
            description: `Unusual activity detected in ${item.source.name}`,
            severity: severities[Math.floor(Math.random() * severities.length)] as any,
            confidence: Math.floor(Math.random() * 30) + 70, // 70-100
            relatedEvents: [item.id],
            status: 'new',
            detectedAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
      
      return anomalies;
    }
  };

  /**
   * Default compliance monitor
   */
  private defaultComplianceMonitor: ComplianceMonitor = {
    checkCompliance(data: NormalizedData[]): ComplianceResult[] {
      const results: ComplianceResult[] = [];
      
      // Simple compliance checking (for simulation)
      // In a real implementation, this would check against actual compliance rules
      
      const frameworks = [
        { id: 'nist-csf', name: 'NIST CSF', version: '1.1' },
        { id: 'iso-27001', name: 'ISO 27001', version: '2013' },
        { id: 'iec-62443', name: 'IEC 62443', version: '2020' },
      ];
      
      const controls = [
        { frameworkId: 'nist-csf', controlId: 'ID.AM-1', name: 'Physical devices inventory' },
        { frameworkId: 'nist-csf', controlId: 'ID.AM-2', name: 'Software platforms inventory' },
        { frameworkId: 'iso-27001', controlId: 'A.8.1.1', name: 'Asset inventory' },
        { frameworkId: 'iec-62443', controlId: 'SR 1.1', name: 'Security policy and procedures' },
      ];
      
      // Check a random control for compliance
      if (data.length > 0 && Math.random() < 0.1) {
        const control = controls[Math.floor(Math.random() * controls.length)];
        const statuses = ['compliant', 'non_compliant', 'partially_compliant', 'not_applicable'];
        const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
        
        results.push({
          compliant: status === 'compliant',
          control: {
            id: `${control.frameworkId}-${control.controlId}`,
            frameworkId: control.frameworkId,
            controlId: control.controlId,
            name: control.name,
            description: `Compliance control for ${control.name}`,
            requirements: `Requirements for ${control.name}`,
            status,
            lastAssessedAt: new Date(),
          },
          details: `Compliance check for ${control.name} resulted in ${status}`,
        });
      }
      
      return results;
    }
  };
}

/**
 * Risk Score Engine Interface
 */
export interface RiskScoreEngine {
  calculateRiskScores(data: NormalizedData[]): RiskScore[];
}

/**
 * Anomaly Detector Interface
 */
export interface AnomalyDetector {
  detectAnomalies(data: NormalizedData[]): Anomaly[];
}

/**
 * Compliance Monitor Interface
 */
export interface ComplianceMonitor {
  checkCompliance(data: NormalizedData[]): ComplianceResult[];
}

/**
 * Compliance Result Interface
 */
export interface ComplianceResult {
  compliant: boolean;
  control?: ComplianceControl;
  details: string;
}

/**
 * Analytics Result Interface
 */
export interface AnalyticsResult {
  environment: EnvironmentType;
  sourceType: string;
  timestamp: Date;
  riskScores: RiskScore[];
  anomalies: Anomaly[];
  complianceResults: ComplianceResult[];
}

// Export a singleton instance
export const analyticsService = new AnalyticsService();

// Register environment-specific analytics engines
analyticsService.registerRiskScoreEngine('IT', {
  calculateRiskScores(data: NormalizedData[]): RiskScore[] {
    // IT-specific risk scoring logic
    const vulnerabilityFactor = Math.min(100, Math.floor(Math.random() * 50) + 20);
    const threatFactor = Math.min(100, Math.floor(Math.random() * 40) + 30);
    const complianceFactor = Math.min(100, Math.floor(Math.random() * 30) + 40);
    const exposureFactor = Math.min(100, Math.floor(Math.random() * 20) + 30);
    
    const overallScore = Math.floor(
      (vulnerabilityFactor * 0.3) +
      (threatFactor * 0.3) +
      (complianceFactor * 0.2) +
      (exposureFactor * 0.2)
    );
    
    const trend = ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable';
    
    return [{
      id: `risk-IT-${Date.now()}`,
      environmentType: 'IT',
      overallScore,
      factors: {
        vulnerabilities: vulnerabilityFactor,
        threats: threatFactor,
        compliance: complianceFactor,
        exposure: exposureFactor,
      },
      trend,
      calculatedAt: new Date(),
    }];
  }
});

analyticsService.registerRiskScoreEngine('OT', {
  calculateRiskScores(data: NormalizedData[]): RiskScore[] {
    // OT-specific risk scoring logic
    const vulnerabilityFactor = Math.min(100, Math.floor(Math.random() * 40) + 10);
    const threatFactor = Math.min(100, Math.floor(Math.random() * 30) + 20);
    const complianceFactor = Math.min(100, Math.floor(Math.random() * 40) + 30);
    const exposureFactor = Math.min(100, Math.floor(Math.random() * 50) + 20);
    
    const overallScore = Math.floor(
      (vulnerabilityFactor * 0.2) +
      (threatFactor * 0.2) +
      (complianceFactor * 0.3) +
      (exposureFactor * 0.3)
    );
    
    const trend = ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable';
    
    return [{
      id: `risk-OT-${Date.now()}`,
      environmentType: 'OT',
      overallScore,
      factors: {
        vulnerabilities: vulnerabilityFactor,
        threats: threatFactor,
        compliance: complianceFactor,
        exposure: exposureFactor,
      },
      trend,
      calculatedAt: new Date(),
    }];
  }
});

analyticsService.registerRiskScoreEngine('Cloud', {
  calculateRiskScores(data: NormalizedData[]): RiskScore[] {
    // Cloud-specific risk scoring logic
    const vulnerabilityFactor = Math.min(100, Math.floor(Math.random() * 30) + 20);
    const threatFactor = Math.min(100, Math.floor(Math.random() * 40) + 20);
    const complianceFactor = Math.min(100, Math.floor(Math.random() * 50) + 30);
    const exposureFactor = Math.min(100, Math.floor(Math.random() * 30) + 40);
    
    const overallScore = Math.floor(
      (vulnerabilityFactor * 0.2) +
      (threatFactor * 0.3) +
      (complianceFactor * 0.3) +
      (exposureFactor * 0.2)
    );
    
    const trend = ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable';
    
    return [{
      id: `risk-Cloud-${Date.now()}`,
      environmentType: 'Cloud',
      overallScore,
      factors: {
        vulnerabilities: vulnerabilityFactor,
        threats: threatFactor,
        compliance: complianceFactor,
        exposure: exposureFactor,
      },
      trend,
      calculatedAt: new Date(),
    }];
  }
});
