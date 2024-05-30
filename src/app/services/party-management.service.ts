import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './localstorage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartyManagementService {

  constructor(private http: HttpClient, private _localStorageService: LocalStorageService) { }
  authToken = this._localStorageService.getItem('token');

  getPartyManagementList(): Observable<any> {
    return this.http.get(environment.apiEndPoint + 'party/');
  }

  addPartyDetails(oData: any): Observable<any> {
    return this.http.post(environment.apiEndPoint + 'party/', oData);
  }

  deletePartyDetails(id: number): Observable<any> {
    return this.http.delete(environment.apiEndPoint + `party/?id=${id}`);
  }

  patchPartyDataById(id: number, oData: any): Observable<any> {
    return this.http.patch(environment.apiEndPoint + `party/?id=${id}`, oData);
  }

  updatePartyDataById(id: number, oData: any): Observable<any> {
    return this.http.put(environment.apiEndPoint + `party/?id=${id}`, oData);
  }
}
