import { Component, input, forwardRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  imports: [CommonModule],
  templateUrl: './checkbox.html',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiCheckbox), multi: true }
  ]
})
export class UiCheckbox implements ControlValueAccessor {
  label = input<string>('');
  disabled = input<boolean>(false);
  id = input<string>('');
  name = input<string>('');
  invalid = input<boolean>(false);
  value = false;

  onChange!: (value: boolean) => void;
  onTouched!: () => void;

  writeValue(value: boolean): void {
    this.value = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    void isDisabled;
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.checked;
    this.onChange(this.value);
    this.onTouched();
  }

  checkboxClasses() {
    const baseClasses = 'w-5 h-5 rounded border-2 transition-colors cursor-pointer';
    const invalidClasses = this.invalid() ? 'border-red-500' : 'border-gray-300';
    const disabledClasses = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';
    return [baseClasses, invalidClasses, disabledClasses].filter(Boolean).join(' ');
  }
}
