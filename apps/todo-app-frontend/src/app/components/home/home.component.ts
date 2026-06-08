import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DialogComponent } from "../../shared/components/ui/dialog/dialog.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DialogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isAboutModalOpen = signal<boolean>(false);
}