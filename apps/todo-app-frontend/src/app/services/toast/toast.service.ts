// src/app/services/toast/toast.service.ts
import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastPayload {
    message: string;
    type: ToastType;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    readonly activeToast = signal<ToastPayload | null>(null);

    show(message: string, type: ToastType = 'error', duration = 4000): void {
        this.activeToast.set({ message, type });

        setTimeout(() => {
            this.clear();
        }, duration);
    }

    clear(): void {
        this.activeToast.set(null);
    }
}