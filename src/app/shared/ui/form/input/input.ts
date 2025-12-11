import { Component, input, output, forwardRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-input',
  imports: [CommonModule],
  templateUrl: './input.html',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiInput), multi: true }]
})
export class UiInput implements ControlValueAccessor {
  type = input<string>('text');
  placeholder = input<string>('');
  name = input<string>('');
  disabled = input<boolean>(false);
  id = input<string>('');
  label = input<string>('');
  invalid = input<boolean>(false);
  focused = output<FocusEvent>();
  blurred = output<FocusEvent>();
  value = '';
  onChange!: (value: string) => void;
  onTouched!: () => void;

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    void isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  inputClasses() {
    const baseClasses = 'ui-input';
    const invalidClass = this.invalid() ? 'ui-input-invalid' : '';
    const disabledClass = this.disabled() ? 'ui-input-disabled' : '';
    return [baseClasses, invalidClass, disabledClass].filter(Boolean).join(' ');
  }
}
