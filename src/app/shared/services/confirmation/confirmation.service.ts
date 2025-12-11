import { Injectable, signal } from '@angular/core';

export interface ConfirmationOptions {
  message: string;
  header?: string;
  icon?: boolean;
  acceptLabel?: string;
  rejectLabel?: string;
  accept?: () => void;
  reject?: () => void;
  target?: EventTarget;
  rejectButtonProps?: Record<string, unknown>;
  acceptButtonProps?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  #confirmation = signal<ConfirmationOptions | null>(null);
  getConfirmation = this.#confirmation.asReadonly();

  confirm(options: ConfirmationOptions) {
    this.#confirmation.set(options);
  }

  close() {
    this.#confirmation.set(null);
  }
}
