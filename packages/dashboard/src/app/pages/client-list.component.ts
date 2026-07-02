import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { Client, PaginatedResponse } from '@lsp/shared';
import { LSPType } from '@lsp/shared';
import { DEFAULT_PAGINATION } from '@lsp/shared';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './client-list.component.html',
  styles: [`
    .page-title { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .page-subtitle { color: var(--brand-text-secondary); margin-bottom: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .btn-primary { display: inline-block; background: var(--brand-primary); color: #fff; padding: 10px 20px; border-radius: 6px; font-weight: 500; text-decoration: none; }
    .btn-primary:hover { background: var(--brand-primary-dark); text-decoration: none; }
    .search-bar { margin-bottom: 16px; }
    .search-bar input { width: 100%; max-width: 400px; padding: 10px 14px; border: 1px solid var(--brand-border); border-radius: 6px; background: var(--brand-surface); color: var(--brand-text); font-size: 14px; box-sizing: border-box; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--brand-border); font-size: 14px; }
    th { font-weight: 600; color: var(--brand-text-secondary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { color: var(--brand-text); }
    tbody tr { cursor: pointer; }
    tbody tr:hover td { background: var(--brand-surface-hover); }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .badge-translation_agency { background: #dbeafe; color: #1e40af; }
    .badge-interpretation_service { background: #d1fae5; color: #065f46; }
    .badge-localization_firm { background: #fef3c7; color: #92400e; }
    .badge-language_consultancy { background: #ede9fe; color: #5b21b6; }
    .pagination { display: flex; align-items: center; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
    .pagination button { padding: 6px 14px; border: 1px solid var(--brand-border); border-radius: 6px; background: var(--brand-surface); color: var(--brand-text); cursor: pointer; font-size: 13px; }
    .pagination button:disabled { opacity: 0.4; cursor: default; }
    .pagination button.active { background: var(--brand-primary); color: #fff; border-color: var(--brand-primary); }
    .pagination span { font-size: 13px; color: var(--brand-text-secondary); }
    .empty-state, .error-state, .loading-state { text-align: center; padding: 48px 16px; color: var(--brand-text-secondary); }
    .error-state { color: #dc2626; }
    .language-count { font-size: 13px; color: var(--brand-text-secondary); }
  `],
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = true;
  error = '';
  search = '';
  page = 1;
  limit = DEFAULT_PAGINATION.limit;
  total = 0;
  totalPages = 0;
  pages: number[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.loading = true;
    this.error = '';
    const params: Record<string, string | number> = { page: this.page, limit: this.limit };
    if (this.search.trim()) params['search'] = this.search.trim();
    this.api.get<PaginatedResponse<Client>>('/clients', params).subscribe({
      next: (res) => {
        if (res.data) {
          this.clients = res.data.data;
          this.total = res.data.total;
          this.totalPages = res.data.totalPages;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load clients';
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    this.page = 1;
    this.fetchClients();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.fetchClients();
  }

  typeBadge(t: LSPType): string {
    return `badge badge-${t.toLowerCase()}`;
  }

  rowClick(id: string): void {
    this.router.navigate(['/dashboard/clients', id]);
  }
}
