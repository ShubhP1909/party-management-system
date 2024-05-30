import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  getItem(key: string, defaultValue?: any): any {
    if (localStorage.getItem(key)) {
      let data: any;
      if (typeof localStorage.getItem(key) !== 'undefined') {
        try {
          data = JSON.parse(localStorage.getItem(key) as any);
          return data;
        } catch (e) {
          data = '';
          return data;
        }
      } else {
        return '';
      }
    } else {
      return defaultValue;
    }
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  setAccessToken(token: string): void {
    this.setItem('token', token);
  }

  setUserLoggedIn(logged_in: boolean): void {
    if (typeof logged_in === 'undefined') {
      logged_in = false;
    }
    this.setItem('is_logged_in', logged_in);
  }

  isUserLoggedIn(): boolean {
    return this.getItem('is_logged_in', false);
  }
}
