import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-about-modal',
  imports: [],
  templateUrl: './about-modal.html',
  styleUrl: './about-modal.css',
  standalone: true
})
export class AboutModal {
  dialogRef = viewChild<ElementRef<HTMLDialogElement>>("dialogRef");

  openModal() {
    this.dialogRef()?.nativeElement.showModal();
  }

  closeModal() {
    this.dialogRef()?.nativeElement.close();
  }
}
