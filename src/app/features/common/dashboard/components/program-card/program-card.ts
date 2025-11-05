import { Component, computed, input } from '@angular/core';
import { LucideAngularModule, Flag, Check, ChartColumn, FolderKanban } from 'lucide-angular';
import { ProgramReport } from '../../types/stats.type';

@Component({
  selector: 'app-program-card',
  imports: [LucideAngularModule],
  templateUrl: './program-card.html'
})
export class ProgramCardComponent {
  program = input.required<ProgramReport>();

  overallPerformance = computed(() => {
    const categories = this.program().categories;
    if (!categories || categories.length === 0) return 0;
    const totalPerformance = categories.reduce((sum, cat) => sum + (cat.performance || 0), 0);
    return Math.round(totalPerformance / categories.length);
  });

  readonly icons = {
    barChart: ChartColumn,
    flag: Flag,
    check: Check,
    folder: FolderKanban
  };
}
