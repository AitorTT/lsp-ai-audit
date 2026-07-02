import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgClass, NgIf } from '@angular/common';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgClass, NgIf],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#1a56db"/>
            <path d="M12 28V12h6a6 6 0 010 12h-6" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 20h10a4 4 0 010 8H18" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span *ngIf="!collapsed" class="logo-text">LSP Audit</span>
        </div>
        <button class="collapse-btn" (click)="toggle.emit()">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
           class="nav-item">
          <span class="nav-icon" [innerHTML]="item.icon"></span>
          <span *ngIf="!collapsed" class="nav-label">{{ item.label }}</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--sidebar-bg);
      display: flex;
      flex-direction: column;
      transition: width 0.2s ease;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      overflow: hidden;
    }
    .sidebar.collapsed {
      width: var(--sidebar-collapsed-width);
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      white-space: nowrap;
    }
    .collapse-btn {
      background: none;
      border: none;
      color: var(--sidebar-text);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }
    .collapse-btn:hover {
      background: var(--sidebar-hover);
      color: #fff;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      padding: 12px 8px;
      gap: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      color: var(--sidebar-text);
      text-decoration: none;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .nav-item:hover {
      background: var(--sidebar-hover);
      color: #fff;
      text-decoration: none;
    }
    .nav-item.active {
      background: var(--sidebar-active);
      color: #fff;
    }
    .nav-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
    }
    .nav-icon svg {
      width: 20px;
      height: 20px;
    }
    .nav-label {
      font-size: 14px;
      font-weight: 500;
    }
  `],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    },
    {
      label: 'Audits',
      route: '/dashboard/audits',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    },
    {
      label: 'Clients',
      route: '/dashboard/clients',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    },
  ];
}
