import { Component, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'info' | 'contrast' | 'success' | 'outlined';
type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-ui-button',
  templateUrl: './button.html'
})
export class UiButton {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('medium');
  outlined = input<boolean>(false);
  text = input<boolean>(false);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  clicked = output<MouseEvent>();

  handleClick(event: MouseEvent) {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }

  buttonClasses(): string {
    const baseClasses = 'ui-button w-full';
    const variantClass = `ui-button-${this.variant()}`;
    const sizeClass = `ui-button-${this.size()}`;
    const outlinedClass = this.outlined() ? 'ui-button-outlined' : '';
    const textClass = this.text() ? 'ui-button-text' : '';
    const disabledClass = this.disabled() ? 'ui-button-disabled' : '';
    return [baseClasses, variantClass, sizeClass, outlinedClass, textClass, disabledClass].filter(Boolean).join(' ');
  }
}
