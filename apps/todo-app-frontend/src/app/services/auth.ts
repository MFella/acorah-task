import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { API_URL } from '../app.tokens';
import { filter, firstValueFrom } from 'rxjs';

export interface User {
  id: number;
  fullName: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  isLoggedIn = signal(false);

  guestUserResource = rxResource({
    stream: () => this.http.get<User>(`${this.apiUrl}/todo/auth`)
  });

  currentUser = this.guestUserResource.value;

  loadInitialGuestUser() {
    return firstValueFrom(toObservable(this.guestUserResource.isLoading).pipe(filter(isLoading => !isLoading)));
  }
}
