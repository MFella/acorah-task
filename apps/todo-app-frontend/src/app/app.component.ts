import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { ToastService } from './services/toast/toast.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly title = signal('todo-app-frontend');
  readonly toastService = inject(ToastService);
  private toastElement = viewChild<ElementRef<HTMLElement>>('toastPopover');

  constructor() {
    // 🚀 Automatycznie odpala showPopover(), kiedy element pojawia się w DOM
    effect(() => {
      const el = this.toastElement()?.nativeElement;
      if (el && typeof el.showPopover === 'function') {
        try {
          el.showPopover();
        } catch (e) {
          // Zapobiega błędom, jeśli popover był już otwarty
        }
      }
    });
  }
}
