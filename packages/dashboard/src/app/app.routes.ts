import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/analytics.component').then((m) => m.AnalyticsComponent),
      },
      {
        path: 'audits',
        loadComponent: () => import('./pages/audit-list.component').then((m) => m.AuditListComponent),
      },
      {
        path: 'audits/new',
        loadComponent: () => import('./pages/audit-form.component').then((m) => m.AuditFormComponent),
      },
      {
        path: 'audits/:id',
        loadComponent: () => import('./pages/audit-detail.component').then((m) => m.AuditDetailComponent),
      },
      {
        path: 'clients',
        loadComponent: () => import('./pages/client-list.component').then((m) => m.ClientListComponent),
      },
      {
        path: 'clients/new',
        loadComponent: () => import('./pages/client-form.component').then((m) => m.ClientFormComponent),
      },
      {
        path: 'clients/:id/edit',
        loadComponent: () => import('./pages/client-form.component').then((m) => m.ClientFormComponent),
      },
      {
        path: 'clients/:id',
        loadComponent: () => import('./pages/client-detail.component').then((m) => m.ClientDetailComponent),
      },
    ],
  },
];
