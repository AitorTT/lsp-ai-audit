import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styles: [`
    .login-wrapper { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--brand-bg); padding: 24px; }
    .login-card { background: var(--brand-surface); border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); padding: 40px; width: 100%; max-width: 400px; }
    .login-header { text-align: center; margin-bottom: 32px; }
    .login-header h1 { font-size: 22px; font-weight: 700; margin-top: 12px; color: var(--brand-text); }
    .subtitle { color: var(--brand-text-secondary); font-size: 14px; margin-top: 4px; }
    .login-form .form-group { margin-bottom: 20px; }
    .login-form label { display: block; font-size: 13px; font-weight: 500; color: var(--brand-text); margin-bottom: 6px; }
    .login-form input { width: 100%; padding: 10px 12px; border: 1px solid var(--brand-border); border-radius: 6px; font-size: 14px; color: var(--brand-text); background: var(--brand-surface); transition: border-color 0.15s ease; }
    .login-form input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(26,86,219,0.1); }
    .error-message { color: var(--brand-error); font-size: 13px; margin-bottom: 16px; }
    .btn-primary { width: 100%; padding: 10px 16px; background: var(--brand-primary); color: #fff; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.15s ease; }
    .btn-primary:hover { background: var(--brand-primary-dark); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.error = res.error || 'Login failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Invalid email or password';
      },
    });
  }
}
