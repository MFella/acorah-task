import { Component, ElementRef, viewChild, input, output, effect } from '@angular/core';

@Component({
    selector: 'app-dialog',
    standalone: true,
    templateUrl: './dialog.component.html',
})
export class DialogComponent {
    isOpen = input.required<boolean>();
    title = input<string>('Dialog');

    closed = output<void>();

    private dialogElement = viewChild.required<ElementRef<HTMLDialogElement>>('dialogNative');

    constructor() {
        effect(() => {
            const element = this.dialogElement().nativeElement;
            if (this.isOpen()) {
                if (!element.open) element.showModal();
            } else {
                if (element.open) element.close();
            }
        });
    }

    handleClose() {
        this.closed.emit();
    }
}