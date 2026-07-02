import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { Client, Audit } from '@lsp/shared';
import { LSPType } from '@lsp/shared';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-detail.component.html',
  styles: [`
    .page-title { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .page-subtitle { color: var(--brand-text-secondary); margin-bottom: 24px; }
    .back-link { display: inline-block; margin-bottom: 16px; color: var(--brand-text-secondary); font-size: 14px; }
    .card { background: var(--brand-surface); border: 1px solid var(--brand-border); border-radius: 8px; padding: 24px; margin-bottom: 24px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .detail-item label { font-size: 12px; font-weight: 500; color: var(--brand-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; display: block; }
    .detail-item p { font-size: 14px; color: var(--brand-text); margin: 0; }
    .detail-full { grid-column: 1 / -1; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .badge-translation_agency { background: #dbeafe; color: #1e40af; }
    .badge-interpretation_service { background: #d1fae5; color: #065f46; }
    .badge-localization_firm { background: #fef3c7; color: #92400e; }
    .badge-language_consultancy { background: #ede9fe; color: #5b21b6; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: var(--brand-surface); border: 1px solid var(--brand-border); border-radius: 8px; padding: 20px; text-align: center; }
    .stat-card .stat-value { font-size: 28px; font-weight: 700; color: var(--brand-text); }
    .stat-card .stat-label { font-size: 12px; color: var(--brand-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
    .actions { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; text-decoration: none; }
    .btn-sm { padding: 4px 12px; font-size: 12px; }
    .btn-primary { background: var(--brand-primary); color: #fff; }
    .btn-primary:hover { background: var(--brand-primary-dark); }
    .btn-danger { background: #dc2626; color: #fff; }
    .btn-danger:hover { background: #b91c1c; }
    .btn-secondary { background: transparent; color: var(--brand-text-secondary); border: 1px solid var(--brand-border); }
    .section-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 16px; border-bottom: 1px solid var(--brand-border); font-size: 14px; }
    th { font-weight: 600; color: var(--brand-text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { color: var(--brand-text); }
    .empty-state { text-align: center; padding: 32px; color: var(--brand-text-secondary); }
    .error-state { color: #dc2626; text-align: center; padding: 32px; }
    .loading-state { text-align: center; padding: 32px; color: var(--brand-text-secondary); }
    .language-tag { display: inline-block; background: var(--brand-surface); border: 1px solid var(--brand-border); border-radius: 4px; padding: 2px 8px; font-size: 12px; margin: 2px 4px 2px 0; }
    .website-link { color: var(--brand-primary); text-decoration: none; }
    .website-link:hover { text-decoration: underline; }
  `],
})
export class ClientDetailComponent implements OnInit {
  client: Client | null = null;
  audits: Audit[] = [];
  loading = true;
  error = '';
  totalAudits = 0;
  completedAudits = 0;
  findingsCount = 0;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get<Client>(`/clients/${id}`).subscribe({
        next: (res) => {
          if (res.data) {
            this.client = res.data;
            this.loadAudits(id);
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load client';
          this.loading = false;
        },
      });
    }
  }

  loadAudits(clientId: string): void {
    this.api.get<{ data: Audit[]; total: number }>('/audits', { clientId }).subscribe({
      next: (res) => {
        if (res.data) {
          this.audits = res.data.data || [];
          this.totalAudits = res.data.total || this.audits.length;
          this.completedAudits = this.audits.filter((a) => a.status === 'COMPLETED').length;
          this.findingsCount = this.audits.reduce((sum, a) => sum + (a.findings?.length || 0), 0);
        }
      },
    });
  }

  editClient(): void {
    this.router.navigate(['/dashboard/clients', this.client?.id, 'edit']);
  }

  deleteClient(): void {
    if (!this.client) return;
    if (!confirm(`Are you sure you want to delete "${this.client.name}"? This action cannot be undone.`)) return;
    this.api.delete(`/clients/${this.client.id}`).subscribe({
      next: () => this.router.navigate(['/dashboard/clients']),
      error: () => { this.error = 'Failed to delete client'; },
    });
  }

  typeBadge(t: LSPType): string {
    return `badge badge-${t.toLowerCase()}`;
  }

  rowClick(auditId: string): void {
    this.router.navigate(['/dashboard/audits', auditId]);
  }
}
