import { Injectable, OnDestroy, Optional, Inject, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, interval, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface PerformanceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  throughput: number;
  timestamp: Date;
}

export interface LatencyDistribution {
  p50: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface PerformanceThresholds {
  maxLatencyMs: number;
  minThroughput: number;
  maxErrorRate: number;
}

export interface PerformanceAlert {
  type: 'latency' | 'throughput' | 'error-rate' | 'circuit-breaker';
  message: string;
  value: number;
  threshold: number;
  timestamp: Date;
}

export const PERFORMANCE_THRESHOLDS = new InjectionToken<PerformanceThresholds>('PERFORMANCE_THRESHOLDS');
export const PERFORMANCE_WINDOW_SIZE = new InjectionToken<number>('PERFORMANCE_WINDOW_SIZE');
export const PERFORMANCE_MAX_LATENCY_RECORDS = new InjectionToken<number>('PERFORMANCE_MAX_LATENCY_RECORDS');

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService implements OnDestroy {
  private requestLatencies: number[] = [];
  private requestTimestamps: number[] = [];
  private successfulRequests = 0;
  private failedRequests = 0;
  private totalRequests = 0;
  
  private metricsSubject = new BehaviorSubject<PerformanceMetrics>(this.getInitialMetrics());
  private alertsSubject = new BehaviorSubject<PerformanceAlert[]>([]);
  private monitoringSubscription: Subscription | null = null;
  
  private defaultThresholds: PerformanceThresholds = {
    maxLatencyMs: 200,
    minThroughput: 100,
    maxErrorRate: 0.05
  };
  
  private thresholds: PerformanceThresholds;
  private windowSizeMs: number;
  private maxLatencyRecords: number;

  constructor(
    @Optional() @Inject(PERFORMANCE_THRESHOLDS) thresholds?: PerformanceThresholds,
    @Optional() @Inject(PERFORMANCE_WINDOW_SIZE) private windowSizeMsConfig: number | null = null,
    @Optional() @Inject(PERFORMANCE_MAX_LATENCY_RECORDS) private maxLatencyRecordsConfig: number | null = null
  ) {
    this.thresholds = { ...this.defaultThresholds, ...thresholds };
    this.windowSizeMs = this.windowSizeMsConfig ?? 60000;
    this.maxLatencyRecords = this.maxLatencyRecordsConfig ?? 10000;
  }

  startMonitoring(intervalMs: number = 1000): void {
    if (this.monitoringSubscription) {
      return;
    }

    this.monitoringSubscription = interval(intervalMs).subscribe(() => {
      this.calculateMetrics();
      this.checkThresholds();
    });
  }

  stopMonitoring(): void {
    if (this.monitoringSubscription) {
      this.monitoringSubscription.unsubscribe();
      this.monitoringSubscription = null;
    }
  }

  recordRequest(latencyMs: number, success: boolean): void {
    const now = Date.now();
    
    this.requestLatencies.push(latencyMs);
    this.requestTimestamps.push(now);
    this.totalRequests++;
    
    if (success) {
      this.successfulRequests++;
    } else {
      this.failedRequests++;
    }

    if (this.requestLatencies.length > this.maxLatencyRecords) {
      this.requestLatencies = this.requestLatencies.slice(-this.maxLatencyRecords);
      this.requestTimestamps = this.requestTimestamps.slice(-this.maxLatencyRecords);
    }

    this.cleanupOldData();
  }

  getMetrics(): Observable<PerformanceMetrics> {
    return this.metricsSubject.asObservable();
  }

  getAlerts(): Observable<PerformanceAlert[]> {
    return this.alertsSubject.asObservable();
  }

  getLatencyDistribution(): LatencyDistribution {
    if (this.requestLatencies.length === 0) {
      return { p50: 0, p90: 0, p95: 0, p99: 0 };
    }

    const sorted = [...this.requestLatencies].sort((a, b) => a - b);
    const n = sorted.length;

    return {
      p50: this.percentile(sorted, n, 0.50),
      p90: this.percentile(sorted, n, 0.90),
      p95: this.percentile(sorted, n, 0.95),
      p99: this.percentile(sorted, n, 0.99)
    };
  }

  reset(): void {
    this.requestLatencies = [];
    this.requestTimestamps = [];
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.totalRequests = 0;
    this.metricsSubject.next(this.getInitialMetrics());
    this.alertsSubject.next([]);
  }

  updateThresholds(newThresholds: Partial<PerformanceThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  private calculateMetrics(): void {
    this.cleanupOldData();
    
    const now = Date.now();
    const windowStart = now - this.windowSizeMs;
    const requestsInWindow = this.requestTimestamps.filter(t => t >= windowStart).length;
    
    const latenciesInWindow = this.requestLatencies.filter((_, i) => 
      this.requestTimestamps[i] >= windowStart
    );
    
    const avgLatency = latenciesInWindow.length > 0
      ? latenciesInWindow.reduce((a, b) => a + b, 0) / latenciesInWindow.length
      : 0;
    
    const minLatency = latenciesInWindow.length > 0 ? Math.min(...latenciesInWindow) : 0;
    const maxLatency = latenciesInWindow.length > 0 ? Math.max(...latenciesInWindow) : 0;
    
    const windowSeconds = this.windowSizeMs / 1000;
    const throughput = requestsInWindow / windowSeconds;

    const metrics: PerformanceMetrics = {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      averageLatencyMs: avgLatency,
      minLatencyMs: minLatency,
      maxLatencyMs: maxLatency,
      throughput,
      timestamp: new Date()
    };

    this.metricsSubject.next(metrics);
  }

  private checkThresholds(): void {
    const metrics = this.metricsSubject.getValue();
    const alerts: PerformanceAlert[] = [];

    if (metrics.averageLatencyMs > this.thresholds.maxLatencyMs) {
      alerts.push({
        type: 'latency',
        message: `Latencia promedio ${metrics.averageLatencyMs.toFixed(2)}ms excede el umbral de ${this.thresholds.maxLatencyMs}ms`,
        value: metrics.averageLatencyMs,
        threshold: this.thresholds.maxLatencyMs,
        timestamp: new Date()
      });
    }

    if (metrics.throughput < this.thresholds.minThroughput) {
      alerts.push({
        type: 'throughput',
        message: `Throughput ${metrics.throughput.toFixed(2)} req/s está por debajo del umbral de ${this.thresholds.minThroughput} req/s`,
        value: metrics.throughput,
        threshold: this.thresholds.minThroughput,
        timestamp: new Date()
      });
    }

    const errorRate = this.totalRequests > 0 
      ? this.failedRequests / this.totalRequests 
      : 0;
    
    if (errorRate > this.thresholds.maxErrorRate) {
      alerts.push({
        type: 'error-rate',
        message: `Tasa de error ${(errorRate * 100).toFixed(2)}% excede el umbral de ${(this.thresholds.maxErrorRate * 100).toFixed(2)}%`,
        value: errorRate,
        threshold: this.thresholds.maxErrorRate,
        timestamp: new Date()
      });
    }

    if (alerts.length > 0) {
      const currentAlerts = this.alertsSubject.getValue();
      this.alertsSubject.next([...currentAlerts.slice(-9), ...alerts]);
    }
  }

  private cleanupOldData(): void {
    const cutoffTime = Date.now() - this.windowSizeMs;
    const validIndices = this.requestTimestamps
      .map((t, i) => t >= cutoffTime ? i : -1)
      .filter(i => i >= 0);
    
    if (validIndices.length < this.requestTimestamps.length) {
      this.requestLatencies = validIndices.map(i => this.requestLatencies[i]);
      this.requestTimestamps = validIndices.map(i => this.requestTimestamps[i]);
    }
  }

  private percentile(sortedArray: number[], n: number, p: number): number {
    const index = Math.ceil(n * p) - 1;
    return sortedArray[Math.max(0, index)];
  }

  private getInitialMetrics(): PerformanceMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatencyMs: 0,
      minLatencyMs: 0,
      maxLatencyMs: 0,
      throughput: 0,
      timestamp: new Date()
    };
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
  }
}