import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButton } from '../form/button/button';

export interface StepperStep {
  label: string;
  completed?: boolean;
}

@Component({
  selector: 'ui-stepper',
  imports: [CommonModule, UiButton],
  template: `
    <div class="ui-stepper">
      <!-- Steps Header -->
      <div class="flex items-center justify-between mb-8">
        @for (step of steps(); track $index) {
          <div class="flex items-center" [class.flex-1]="$index < steps().length - 1">
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors"
                [ngClass]="{
                  'bg-primary-600 text-white': activeStep() === $index,
                  'bg-green-600 text-white': step.completed,
                  'bg-gray-200 text-gray-600': activeStep() !== $index && !step.completed
                }">
                @if (step.completed) {
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                } @else {
                  {{ $index + 1 }}
                }
              </div>
              <span
                class="mt-2 text-sm font-medium"
                [ngClass]="{
                  'text-primary-600': activeStep() === $index,
                  'text-gray-900': activeStep() !== $index
                }">
                {{ step.label }}
              </span>
            </div>
            @if ($index < steps().length - 1) {
              <div class="flex-1 h-0.5 mx-4 bg-gray-200"></div>
            }
          </div>
        }
      </div>

      <!-- Step Content -->
      <div class="mb-6">
        <ng-content></ng-content>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between">
        <ui-button [disabled]="activeStep() === 0" [variant]="'secondary'" (clicked)="previous()"> Previous </ui-button>
        <ui-button [disabled]="activeStep() === steps().length - 1" (clicked)="next()"> Next </ui-button>
      </div>
    </div>
  `
})
export class UiStepper {
  steps = input<StepperStep[]>([]);
  activeStep = signal(0);
  activeIndexChange = output<number>();

  next(): void {
    const current = this.activeStep();
    if (current < this.steps().length - 1) {
      this.activeStep.set(current + 1);
      this.activeIndexChange.emit(this.activeStep());
    }
  }

  previous(): void {
    const current = this.activeStep();
    if (current > 0) {
      this.activeStep.set(current - 1);
      this.activeIndexChange.emit(this.activeStep());
    }
  }

  goToStep(index: number): void {
    if (index >= 0 && index < this.steps().length) {
      this.activeStep.set(index);
      this.activeIndexChange.emit(this.activeStep());
    }
  }
}
