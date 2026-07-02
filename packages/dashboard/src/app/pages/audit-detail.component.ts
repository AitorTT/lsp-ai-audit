import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { Audit, Finding, Report } from '@lsp/shared';
import { AuditStatus, FindingSeverity } from '@lsp/shared';
import { AUDIT_STATUS_FLOW } from '@lsp/shared';

@Component({
  selector: 'app-audit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './audit-detail.component.html',
  styles: [`
    .page-title { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .page-subtitle { color: var(--brand-text-secondary); margin-bottom: 24px; }
    .back-link { display: inline-block; margin-bottom: 16px; color: var(--brand-text-secondary); font-size: 14px; }
    .card { background: var(--brand-surface); border: 1px solid var(--brand-border); border-radius: 8px; padding: 24px; margin-bottom: 24px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .detail-item label { font-size: 12px; font-weight: 500; color: var(--brand-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: block; }
    .detail-item p { font-size: 14px; color: var(--brand-text); margin: 0; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .badge-draft { background: #e5e7eb; color: #374151; }
    .badge-in_progress { background: #dbeafe; color: #1e40af; }
    .badge-review { background: #fef3c7; color: #92400e; }
    .badge-completed { background: #d1fae5; color: #065f46; }
    .badge-archived { background: #e5e7eb; color: #374151; }
    .badge-critical { background: #fef2f2; color: #991b1b; }
    .badge-high { background: #fff7ed; color: #9a3412; }
    .badge-medium { background: #fefce8; color: #854d0e; }
    .badge-low { background: #f0fdf4; color: #166534; }
    .badge-info { background: #eff6ff; color: #1e40af; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 16px; border-bottom: 1px solid var(--brand-border); font-size: 14px; }
    th { font-weight: 600; color: var(--brand-text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { color: var(--brand-text); }
    .btn { display: inline-block; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; text-decoration: none; }
    .btn-sm { padding: 4px 12px; font-size: 12px; }
    .btn-primary { background: var(--brand-primary); color: #fff; }
    .btn-primary:hover { background: var(--brand-primary-dark); }
    .btn-secondary { background: transparent; color: var(--brand-text-secondary); border: 1px solid var(--brand-border); }
    .btn-success { background: #059669; color: #fff; }
    .btn-warning { background: #d97706; color: #fff; }
    .actions { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
    .section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    .empty-state { text-align: center; padding: 32px; color: var(--brand-text-secondary); }
    .error-state { color: #dc2626; text-align: center; padding: 32px; }
    .loading-state { text-align: center; padding: 32px; color: var(--brand-text-secondary); }
    .report-summary { margin-top: 16px; padding: 16px; background: var(--brand-surface); border: 1px solid var(--brand-border); border-radius: 8px; }
    .report-summary h4 { margin: 0 0 8px; font-size: 15px; }
    .report-summary p { margin: 0 0 8px; font-size: 14px; color: var(--brand-text-secondary); }
    .report-score { font-size: 24px; font-weight: 700; color: var(--brand-text); }
    .detail-full { grid-column: 1 / -1; }
  `],
})
export class AuditDetailComponent implements OnInit {
  audit: Audit | null = null;
  report: Report | null = null;
  loading = true;
  error = '';
  statusTransitions: AuditStatus[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get<Audit>(`/audits/${id}`).subscribe({
        next: (res) => {
          if (res.data) {
            this.audit = res.data;
            this.statusTransitions = AUDIT_STATUS_FLOW[res.data.status] || [];
            this.loadReport(id);
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load audit';
          this.loading = false;
        },
      });
    }
  }

  loadReport(auditId: string): void {
    this.api.get<Report>(`/reports/audit/${auditId}`).subscribe({
      next: (res) => { if (res.data) this.report = res.data; },
    });
  }

  changeStatus(status: AuditStatus): void {
    if (!this.audit) return;
    this.api.put<Audit>(`/audits/${this.audit.id}`, { status }).subscribe({
      next: (res) => {
        if (res.data) {
          this.audit = res.data;
          this.statusTransitions = AUDIT_STATUS_FLOW[res.data.status] || [];
        }
      },
    });
  }

  generateReport(): void {
    if (!this.audit) return;
    this.api.post<Report>('/reports/generate', { auditId: this.audit.id }).subscribe({
      next: (res) => {
        if (res.data) this.report = res.data;
      },
    });
  }

  addFinding(): void {
    this.router.navigate(['/dashboard/audits', this.audit?.id, 'findings', 'new']);
  }

  statusBadge(s: AuditStatus): string {
    return `badge badge-${s.toLowerCase()}`;
  }

  severityBadge(s: FindingSeverity): string {
    return `badge badge-${s.toLowerCase()}`;
  }
}
