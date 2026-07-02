import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiResponse, User } from '@lsp/shared';

const TOKEN_KEY = 'lsp_auth_token';
const USER_KEY = 'lsp_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<ApiResponse<{ token: string; user: User }>> {
    return this.http
      .post<ApiResponse<{ token: string; user: User }>>('/api/v1/auth/login', { email, password })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            localStorage.setItem(TOKEN_KEY, res.data.token);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
