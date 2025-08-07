import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  constructor() { }

  getApiUrl(endpoint: string): string {
    return `${environment.apiBaseUrl}${endpoint}`;
  }
} 