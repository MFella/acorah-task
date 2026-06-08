import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast/toast.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    // You can inject notification services here (e.g., ToastService)
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unexpected error occurred';

            if (error.error instanceof ErrorEvent) {
                errorMessage = `Network failure: ${error.error.message}`;
            } else {
                switch (error.status) {
                    case 400:
                        errorMessage = error.error?.message || 'Validation failed.';
                        break;
                    case 401:
                        errorMessage = 'Unauthorized. Redirecting to login...';
                        break;
                    case 403:
                        errorMessage = 'You do not have permission to access this resource.';
                        break;
                    case 404:
                        errorMessage = 'Requested resource not found.';
                        break;
                    case 500:
                        errorMessage = 'Internal Server Error. Please try again later.';
                        break;
                    default:
                        errorMessage = `Error ${error.status}: ${error.message}`;
                }
            }

            // 🚀 Trigger global UI action (Console, Toast notifications, etc.)
            console.error('Captured via Global Interceptor:', errorMessage);

            toastService.show(errorMessage, "error");
            // Pass the error down the line to local subscribers/resources
            return throwError(() => error);
        })
    );
};