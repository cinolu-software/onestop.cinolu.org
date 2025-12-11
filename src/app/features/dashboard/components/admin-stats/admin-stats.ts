import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminReportStore } from '../../store/admin-report.store';
import { LucideAngularModule, Calendar } from 'lucide-angular';
import { PerformanceOverview } from '../performance-overview/performance-overview';
import { ProgramCard } from '../../ui/program-card/program-card';
import { PerformanceSkeleton } from '../../ui/performance-skeleton/performance-skeleton';
import { EmptyState } from '../../ui/empty-state/empty-state';
import { UiDatepicker } from '@shared/ui';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.html',
  providers: [AdminReportStore],
  imports: [
    RouterModule,
    FormsModule,
    LucideAngularModule,
    PerformanceOverview,
    ProgramCard,
    PerformanceSkeleton,
    EmptyState,
    UiDatepicker
  ]
})
export class AdminStats {
  reportStore = inject(AdminReportStore);
  year = signal<Date>(new Date());
  icons = { Calendar };

  averagePerformance = computed(() => {
    const reports = this.reportStore.report();
    if (!reports || reports.length === 0) return 0;
    const totalPerformance = reports.reduce((sum, program) => {
      const programPerformance =
        program.categories.length > 0
          ? program.categories.reduce((catSum, cat) => catSum + (cat.performance || 0), 0) /
            program.categories.length
          : 0;
      return sum + programPerformance;
    }, 0);
    return Math.round(totalPerformance / reports.length);
  });

  sortedPrograms = computed(() => {
    const reports = this.reportStore.report();
    if (!reports || reports.length === 0) return [];
    return [...reports].sort((a, b) => {
      const perfA =
        a.categories.length > 0
          ? a.categories.reduce((sum, cat) => sum + (cat.performance || 0), 0) / a.categories.length
          : 0;
      const perfB =
        b.categories.length > 0
          ? b.categories.reduce((sum, cat) => sum + (cat.performance || 0), 0) / b.categories.length
          : 0;
      return perfB - perfA;
    });
  });

  constructor() {
    effect(() => {
      this.reportStore.getAdminReport(this.year().getFullYear());
    });
  }
}
