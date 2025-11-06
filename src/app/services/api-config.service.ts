  import { Injectable } from '@angular/core';
  import { environment } from '../../environments/environment';
  import { HttpClient } from '@angular/common/http'; // ← Add this import
  import { Observable } from 'rxjs'; // ← Add this import

  @Injectable({
    providedIn: 'root'
  })
  export class ApiConfigService {
    
    constructor(private http: HttpClient) { } // ← Inject HttpClient here
    
    getApiUrl(endpoint: string): string {
      return `${environment.apiBaseUrl}${endpoint}`;
    }

    // ← Add this new method for POST requests
    postData(endpoint: string, data: any): Observable<any> {
      const url = this.getApiUrl(endpoint);
      return this.http.post(url, data, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }