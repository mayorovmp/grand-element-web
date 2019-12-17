import { Injectable } from '@angular/core';
import { User } from './User';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap, catchError, finalize } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

/** Добавляет токен авторизации к запросам и если токен не действителен, то отправляет пользователя на перелогин. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private ngxLoader: NgxUiLoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = req.clone({
      setHeaders: {
        Authorization: this.auth.token
      }
    });
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const val = event.body;
          if (!val.success && val.code === '401') {
            this.auth.refreshToken();
            throw Error(val.message);
          }
        }
        return event;
      }));
  }
}
