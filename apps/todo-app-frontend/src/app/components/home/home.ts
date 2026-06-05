import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AboutModal } from '../about-modal/about-modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AboutModal],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
}