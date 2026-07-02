import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../shared/api.service';
import { VizService } from '../shared/viz.service';
import { AuditMetrics, Audit, Client, PaginatedResponse } from '@lsp/shared';
import { AuditStatus, FindingSeverity, FindingCategory, AuditScope } from '@lsp/shared';
import { forkJoin } from 'rxjs';
import type { BarChartData, RadarChartData } from '@lsp/viz';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styles: [`
    .page-title { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .page-subtitle { color: var(--brand-text-secondary); margin-bottom: 24px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: var(--brand-surface); border: 1px solid var(--brand-border); border-radius: 8px; padding: 20px; }
    .kpi-card h3 { font-size: 13px; font-weight: 500; color: var(--brand-text-secondary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-value { font-size: 28px; font-weight: 700; color: var(--brand-text); }
    .kpi-sub { font-size: 13px; color: var(--brand-text-secondary); margin-top: 4px; }
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .chart-card { background: var(--brand-surface); border: 1px solid var(--brand-border); border-radius: 8px; padding: 20px; }
    .chart-card h2 { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: var(--brand-text); }
    .viz-container { width: 100%; height: 300px; position: relative; }
    .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 200px; padding-bottom: 24px; position: relative; }
    .bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; }
    .bar { width: 100%; max-width: 48px; border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.4s ease; }
    .bar-label { font-size: 11px; color: var(--brand-text-secondary); margin-top: 8px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
    .bar-count { font-size: 13px; font-weight: 600; color: var(--brand-text); margin-bottom: 4px; }
    .donut-wrap { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
    .donut { width: 160px; height: 160px; border-radius: 50%; flex-shrink: 0; }
    .donut-legend { display: flex; flex-direction: column; gap: 8px; }
    .donut-legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--brand-text); }
    .donut-legend-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .donut-legend-count { font-weight: 600; margin-left: auto; }
    .section-card { background: var(--brand-surface); border: 1px solid var(--brand-border); border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .section-card h2 { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: var(--brand-text); }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--brand-border); font-size: 14px; }
    th { font-weight: 600; color: var(--brand-text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { color: var(--brand-text); }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .badge-draft { background: #e5e7eb; color: #374151; }
    .badge-in_progress { background: #dbeafe; color: #1e40af; }
    .badge-review { background: #fef3c7; color: #92400e; }
    .badge-completed { background: #d1fae5; color: #065f46; }
    .badge-archived { background: #e5e7eb; color: #374151; }
    .error-state { text-align: center; padding: 48px 16px; color: #dc2626; }
    .skeleton { background: linear-gradient(90deg, var(--brand-border) 25%, var(--brand-surface-hover) 50%, var(--brand-border) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
    .skeleton-kpi { height: 80px; }
    .skeleton-chart { height: 240px; }
    .skeleton-table { height: 200px; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    @media (max-width: 900px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } .charts-grid { grid-template-columns: 1fr; } }
    @media (max-width: 500px) { .kpi-grid { grid-template-columns: 1fr; } }
  `],
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  loading = true;
  error = '';
  metrics: AuditMetrics | null = null;
  totalClients = 0;
  recentAudits: Audit[] = [];
  statusDistribution: { status: string; count: number; percent: number }[] = [];

  readonly severityOrder = [FindingSeverity.CRITICAL, FindingSeverity.HIGH, FindingSeverity.MEDIUM, FindingSeverity.LOW, FindingSeverity.INFO];
  readonly categoryOrder = [FindingCategory.AI_READINESS, FindingCategory.PROCESS_EFFICIENCY, FindingCategory.TOOLING, FindingCategory.WORKFLOW_AUTOMATION, FindingCategory.DATA_QUALITY, FindingCategory.COST_OPTIMIZATION];

  constructor(private api: ApiService, private viz: VizService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    this.viz.dispose('severityChart');
    this.viz.dispose('categoryChart');
  }

  private fetchData(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      metrics: this.api.get<AuditMetrics>('/audits/metrics'),
      clients: this.api.get<PaginatedResponse<Client>>('/clients'),
      audits: this.api.get<PaginatedResponse<Audit>>('/audits', { limit: 100 }),
    }).subscribe({
      next: (res) => {
        if (res.metrics.data) this.metrics = res.metrics.data;
        if (res.clients.data) this.totalClients = res.clients.data.total;
        if (res.audits.data) {
          this.recentAudits = res.audits.data.data.slice(0, 5);
          this.computeStatusDistribution(res.audits.data.data);
        }
        this.loading = false;
        setTimeout(() => this.createCharts(), 0);
      },
      error: () => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      },
    });
  }

  private createCharts(): void {
    if (!this.metrics) return;

    const severityData: BarChartData = {
      labels: this.severityOrder.map((s) => this.severityLabel(s)),
      values: this.severityOrder.map((s) => this.metrics!.findingsBySeverity[s] || 0),
      colors: this.severityOrder.map((s) => this.severityColor(s)),
    };
    this.viz.createBarChart('severityChart', severityData);

    const categoryData: RadarChartData = {
      categories: this.categoryOrder.map((c) => this.categoryLabel(c)),
      series: [{
        label: 'Findings',
        values: this.categoryOrder.map((c) => this.metrics!.findingsByCategory[c] || 0),
      }],
    };
    this.viz.createRadarChart('categoryChart', categoryData);
  }

  private computeStatusDistribution(audits: Audit[]): void {
    const counts: Record<string, number> = {};
    for (const a of audits) {
      counts[a.status] = (counts[a.status] || 0) + 1;
    }
    const total = audits.length || 1;
    this.statusDistribution = Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      percent: Math.round((count / total) * 100),
    }));
  }

  statusBadge(s: string): string {
    return `badge badge-${s.toLowerCase()}`;
  }

  severityColor(severity: FindingSeverity): string {
    const map: Record<string, string> = {
      [FindingSeverity.CRITICAL]: '#dc2626',
      [FindingSeverity.HIGH]: '#ea580c',
      [FindingSeverity.MEDIUM]: '#ca8a04',
      [FindingSeverity.LOW]: '#65a30d',
      [FindingSeverity.INFO]: '#6b7280',
    };
    return map[severity] || '#6b7280';
  }

  severityLabel(s: FindingSeverity): string {
    return s.charAt(0) + s.slice(1).toLowerCase();
  }

  categoryLabel(cat: FindingCategory): string {
    return cat
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  scopeLabel(scope: AuditScope): string {
    return (scope as string)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  barHeight(count: number, max: number): number {
    return max > 0 ? (count / max) * 100 : 0;
  }

  donutGradient(): string {
    if (this.statusDistribution.length === 0) return '';
    const colors: string[] = ['#6b7280', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
    let cumulative = 0;
    const parts = this.statusDistribution.map((s, i) => {
      const start = cumulative;
      cumulative += s.percent;
      return `${colors[i % colors.length]} ${start}% ${cumulative}%`;
    });
    return `conic-gradient(${parts.join(', ')})`;
  }

  donutColor(status: string): string {
    const map: Record<string, string> = {
      [AuditStatus.DRAFT]: '#6b7280',
      [AuditStatus.IN_PROGRESS]: '#3b82f6',
      [AuditStatus.REVIEW]: '#f59e0b',
      [AuditStatus.COMPLETED]: '#10b981',
      [AuditStatus.ARCHIVED]: '#8b5cf6',
    };
    return map[status] || '#6b7280';
  }

  statusLabel(s: string): string {
    return s
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  maxSeverityCount(): number {
    if (!this.metrics) return 1;
    return Math.max(...this.severityOrder.map((s) => this.metrics!.findingsBySeverity[s] || 0), 1);
  }

  maxCategoryCount(): number {
    if (!this.metrics) return 1;
    return Math.max(...this.categoryOrder.map((c) => this.metrics!.findingsByCategory[c] || 0), 1);
  }
}
