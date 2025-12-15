import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-progress-bar',
  imports: [CommonModule],
  template: `
    <div class="w-full bg-gray-200 rounded-full overflow-hidden" [style.height.px]="height()">
      <div
        class="h-full transition-all duration-300 ease-in-out rounded-full"
        [ngClass]="barColorClass()"
        [style.width.%]="progressValue()"></div>
    </div>
    @if (showValue()) {
      <div class="text-sm text-gray-600 mt-1 text-center">{{ progressValue() }}%</div>
    }
  `
})
export class UiProgressBar {
  value = input<number>(0);
  height = input<number>(8);
  showValue = input<boolean>(false);
  color = input<'primary' | 'success' | 'warning' | 'danger'>('primary');

  progressValue = computed(() => {
    const val = this.value();
    return Math.min(100, Math.max(0, val));
  });

  barColorClass() {
    switch (this.color()) {
      case 'primary':
        return 'bg-primary-600';
      case 'success':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'danger':
        return 'bg-red-600';
      default:
        return 'bg-primary-600';
    }
  }
}
