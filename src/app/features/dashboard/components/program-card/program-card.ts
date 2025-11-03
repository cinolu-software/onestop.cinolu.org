import { Component, input } from '@angular/core';
import { LucideAngularModule, BarChart3, Flag, Check } from 'lucide-angular';
import { ProgramReport } from '../../types/stats.type';
import { CircularProgressComponent } from '@shared/components/circular-progress/circular-progress';

@Component({
  selector: 'app-program-card',
  imports: [LucideAngularModule, CircularProgressComponent],
  templateUrl: './program-card.html'
})
export class ProgramCardComponent {
  program = input.required<ProgramReport>();
  index = input.required<number>();

  readonly icons = {
    barChart: BarChart3,
    flag: Flag,
    check: Check
  };
}
