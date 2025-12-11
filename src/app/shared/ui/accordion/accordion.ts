import { Component, input, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-accordion',
  imports: [CommonModule],
  template: `<div class="space-y-2"><ng-content /></div>`
})
export class UiAccordion {
  multiple = input<boolean>(false);
  activeValues = signal<Set<string>>(new Set());

  toggle(value: string): void {
    const values = new Set(this.activeValues());

    if (values.has(value)) {
      values.delete(value);
    } else {
      if (!this.multiple()) {
        values.clear();
      }
      values.add(value);
    }

    this.activeValues.set(values);
  }

  isActive(value: string): boolean {
    return this.activeValues().has(value);
  }
}

@Component({
  selector: 'ui-accordion-panel',
  imports: [CommonModule],
  template: `
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <ng-content />
    </div>
  `
})
export class UiAccordionPanel {
  value = input.required<string>();
  private accordion = inject(UiAccordion, { optional: true });

  isActive = computed(() => {
    return this.accordion?.isActive(this.value()) ?? false;
  });

  toggle(): void {
    this.accordion?.toggle(this.value());
  }
}

@Component({
  selector: 'ui-accordion-header',
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="w-full text-left px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      [class.bg-gray-50]="panel?.isActive()"
      (click)="panel?.toggle()">
      <ng-content />
      <svg
        class="w-5 h-5 transition-transform flex-shrink-0"
        [class.rotate-180]="panel?.isActive()"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  `
})
export class UiAccordionHeader {
  panel = inject(UiAccordionPanel, { optional: true });
}

@Component({
  selector: 'ui-accordion-content',
  imports: [CommonModule],
  template: `
    @if (panel?.isActive()) {
    <div class="bg-white">
      <ng-content />
    </div>
    }
  `
})
export class UiAccordionContent {
  panel = inject(UiAccordionPanel, { optional: true });
}
