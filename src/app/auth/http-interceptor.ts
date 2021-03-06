import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

/** Добавляет токен авторизации к запросам и если токен не действителен, то отправляет пользователя на перелогин. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = req.clone({
      setHeaders: {
        Authorization: this.auth.token
      }
    });
    return next.handle(req).pipe(
      tap(_ => { },
        async (err: HttpErrorResponse) => {
          if (err.status === 401) {
            await this.auth.refreshToken();
          } else {
            if (!environment.production) {
              this.toastr.error(err.message);
            }
            if (err.error && err.error.detail) {
              this.toastr.error(err.error.detail);
            }

          }
        })
    );
  }
}
