import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { Audit, Client } from '@lsp/shared';
import { AUDIT_SCOPES } from '@lsp/shared';

@Component({
  selector: 'app-audit-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './audit-form.component.html',
  styles: [`
    .page-title { font-size: 24px; font-weight: 700; margin-bottom: 24px; }
    .back-link { display: inline-block; margin-bottom: 16px; color: var(--brand-text-secondary); font-size: 14px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: var(--brand-text); }
    .form-control { width: 100%; padding: 10px 14px; border: 1px solid var(--brand-border); border-radius: 6px; background: var(--brand-surface); color: var(--brand-text); font-size: 14px; box-sizing: border-box; }
    .form-control:focus { outline: none; border-color: var(--brand-primary); }
    textarea.form-control { min-height: 100px; resize: vertical; }
    .form-error { font-size: 12px; color: #dc2626; margin-top: 4px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .btn-primary { background: var(--brand-primary); color: #fff; padding: 10px 24px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 14px; }
    .btn-primary:disabled { opacity: 0.5; cursor: default; }
    .btn-secondary { background: transparent; color: var(--brand-text-secondary); padding: 10px 24px; border: 1px solid var(--brand-border); border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 14px; margin-left: 8px; text-decoration: none; display: inline-block; }
    .card { background: var(--brand-surface); border: 1px solid var(--brand-border); border-radius: 8px; padding: 24px; }
    .error-banner { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 12px 16px; color: #dc2626; font-size: 14px; margin-bottom: 16px; }
  `],
})
export class AuditFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  auditId = '';
  clients: Client[] = [];
  scopes = AUDIT_SCOPES;
  loading = false;
  submitting = false;
  error = '';
  pageTitle = 'New Audit';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      clientId: ['', Validators.required],
      scope: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.api.get<Client[]>('/clients').subscribe({
      next: (res) => { if (res.data) this.clients = res.data; },
    });
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.auditId = id;
        this.pageTitle = 'Edit Audit';
        this.loading = true;
        this.api.get<Audit>(`/audits/${id}`).subscribe({
          next: (res) => {
            if (res.data) {
              this.form.patchValue({
                title: res.data.title,
                description: res.data.description,
                clientId: res.data.clientId,
                scope: res.data.scope,
                startDate: res.data.startDate ? res.data.startDate.toString().split('T')[0] : '',
                endDate: res.data.endDate ? res.data.endDate.toString().split('T')[0] : '',
              });
            }
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load audit';
            this.loading = false;
          },
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;
    this.error = '';
    const body = { ...this.form.value };
    const req = this.isEdit
      ? this.api.put<Audit>(`/audits/${this.auditId}`, body)
      : this.api.post<Audit>('/audits', body);
    req.subscribe({
      next: () => this.router.navigate(['/dashboard/audits']),
      error: () => {
        this.error = 'Failed to save audit';
        this.submitting = false;
      },
    });
  }
}
