import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { LocalStorageService } from '../services/localstorage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.localStorageService.getItem('token');

    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Token ${authToken}`
        }
      });
    }

    return next.handle(request);
  }
}
