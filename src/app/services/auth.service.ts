import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './localstorage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private _localStorageService: LocalStorageService) { }

  authToken = this._localStorageService.getItem('token');

  oAuthToken(oData: any): Observable<any> {
    return this.http.post(environment.apiEndPoint + 'login/', oData);
  }

  logout(): Observable<any> {
    return this.http.post(environment.apiEndPoint + 'logout/', {});
  }
}
