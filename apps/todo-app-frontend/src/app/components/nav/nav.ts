import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  standalone: true,
})
export class Nav {
  private readonly authService = inject(AuthService)
  isLoggedIn = signal(false);
  currentUser = this.authService.currentUser;
}
