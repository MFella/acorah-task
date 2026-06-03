import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  standalone: true,
})
export class Nav {
  isLoggedIn = signal(true);
}
