import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
})
export class UiLoader {
  size = input<number>(40);
  message = input<string>('');
  containerClass = input<string>('');
  color = input<'primary' | 'secondary' | 'white'>('primary');

  spinnerColorClass() {
    switch (this.color()) {
      case 'primary':
        return 'text-primary-600';
      case 'secondary':
        return 'text-gray-600';
      case 'white':
        return 'text-white';
      default:
        return 'text-primary-600';
    }
  }
}
