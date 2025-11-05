import { Component, input } from '@angular/core';
import { Step } from '../../data/steps.data';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-step-card',
  imports: [LucideAngularModule],
  templateUrl: './step-card.html'
})
export class StepCard {
  step = input.required<Step>();
}
