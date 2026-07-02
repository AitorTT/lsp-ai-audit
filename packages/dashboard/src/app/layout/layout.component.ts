import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NgIf, SidebarComponent],
  template: `
    <div class="layout">
      <app-sidebar
        [collapsed]="sidebarCollapsed"
        (toggle)="sidebarCollapsed = !sidebarCollapsed"
      ></app-sidebar>
      <div class="main" [class.expanded]="sidebarCollapsed">
        <header class="topbar">
          <button class="mobile-menu-btn" (click)="sidebarCollapsed = !sidebarCollapsed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div class="topbar-spacer"></div>
          <div class="topbar-right">
            <span class="user-name">{{ userName }}</span>
            <div class="user-avatar">{{ userInitials }}</div>
            <button class="logout-btn" (click)="logout()">Logout</button>
          </div>
        </header>
        <main class="content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      min-height: 100vh;
    }
    .main {
      margin-left: var(--sidebar-width);
      flex: 1;
      display: flex;
      flex-direction: column;
      transition: margin-left 0.2s ease;
    }
    .main.expanded {
      margin-left: var(--sidebar-collapsed-width);
    }
    .topbar {
      height: var(--topbar-height);
      background: var(--brand-surface);
      border-bottom: 1px solid var(--brand-border);
      display: flex;
      align-items: center;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      color: var(--brand-text);
      cursor: pointer;
      padding: 4px;
    }
    .topbar-spacer {
      flex: 1;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--brand-text);
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--brand-primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
    }
    .logout-btn {
      background: none;
      border: 1px solid var(--brand-border);
      padding: 6px 16px;
      border-radius: 6px;
      color: var(--brand-text);
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.15s ease;
    }
    .logout-btn:hover {
      background: var(--brand-error);
      color: #fff;
      border-color: var(--brand-error);
    }
    .content {
      flex: 1;
      padding: 24px;
    }
    @@media (max-width: 768px) {
      .mobile-menu-btn {
        display: block;
      }
      .main {
        margin-left: 0 !important;
      }
      :host-context(.sidebar-open) .main {
        margin-left: var(--sidebar-width) !important;
      }
    }
  `],
})
export class LayoutComponent {
  sidebarCollapsed = false;

  constructor(private auth: AuthService, private router: Router) {}

  get userName(): string {
    return this.auth.getUser()?.name || 'Admin';
  }

  get userInitials(): string {
    const name = this.userName;
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : name[0];
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
