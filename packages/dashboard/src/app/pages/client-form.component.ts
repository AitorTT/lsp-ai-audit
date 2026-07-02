import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { Client } from '@lsp/shared';
import { LSPType } from '@lsp/shared';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './client-form.component.html',
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
export class ClientFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  clientId = '';
  types = Object.values(LSPType);
  loading = false;
  submitting = false;
  error = '';
  pageTitle = 'New Client';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      logo: [''],
      website: [''],
      description: [''],
      employeeCount: [0, [Validators.required, Validators.min(0)]],
      annualRevenue: [0],
      primaryLanguages: [''],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.clientId = id;
        this.pageTitle = 'Edit Client';
        this.loading = true;
        this.api.get<Client>(`/clients/${id}`).subscribe({
          next: (res) => {
            if (res.data) {
              this.form.patchValue({
                name: res.data.name,
                type: res.data.type,
                logo: res.data.logo || '',
                website: res.data.website || '',
                description: res.data.description || '',
                employeeCount: res.data.employeeCount,
                annualRevenue: res.data.annualRevenue || 0,
                primaryLanguages: (res.data.primaryLanguages || []).join(', '),
              });
            }
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load client';
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
    const raw = this.form.value;
    const body = {
      ...raw,
      primaryLanguages: raw.primaryLanguages
        ? raw.primaryLanguages.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [],
      annualRevenue: raw.annualRevenue || undefined,
    };
    const req = this.isEdit
      ? this.api.put<Client>(`/clients/${this.clientId}`, body)
      : this.api.post<Client>('/clients', body);
    req.subscribe({
      next: () => this.router.navigate(['/dashboard/clients']),
      error: () => {
        this.error = 'Failed to save client';
        this.submitting = false;
      },
    });
  }
}
