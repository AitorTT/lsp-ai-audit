import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '@lsp/shared';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        httpParams = httpParams.set(k, String(v));
      });
    }
    return this.http
      .get<ApiResponse<T>>(`${this.baseUrl}${path}`, { params: httpParams })
      .pipe(catchError((err) => throwError(() => err)));
  }

  post<T>(path: string, body?: unknown): Observable<ApiResponse<T>> {
    return this.http
      .post<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((err) => throwError(() => err)));
  }

  put<T>(path: string, body?: unknown): Observable<ApiResponse<T>> {
    return this.http
      .put<ApiResponse<T>>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((err) => throwError(() => err)));
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http
      .delete<ApiResponse<T>>(`${this.baseUrl}${path}`)
      .pipe(catchError((err) => throwError(() => err)));
  }
}
