import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  standalone: true,
})
export class Nav {
  private readonly authService = inject(AuthService)
  isLoggedIn = signal(false);
  currentUser = this.authService.currentUser;
}
