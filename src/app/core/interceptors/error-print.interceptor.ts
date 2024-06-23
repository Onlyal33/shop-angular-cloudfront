import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (error: HttpErrorResponse) => {
          const url = new URL(request.url);
          if (url.pathname.endsWith('/import')) {
            if (error.status === 401 || error.status === 403) {
              this.notificationService.showError(
                `Access Denied. Received ${error.status} response for ${url.pathname}.`,
                0,
              );
            }
          } else {
            this.notificationService.showError(
              `Request to "${url.pathname}" failed. Check the console for the details`,
              0,
            );
          }
        },
      }),
    );
  }
}
