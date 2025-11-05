import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { AdminReportStore } from '../../store/admin-report.store';
import { DatePicker } from 'primeng/datepicker';
import { LucideAngularModule, Calendar } from 'lucide-angular';
import { PerformanceOverviewComponent } from '../performance-overview/performance-overview';
import { ProgramCardComponent } from '../program-card/program-card';
import { PerformanceSkeletonComponent } from '../performance-skeleton/performance-skeleton';
import { EmptyStateComponent } from '../empty-state/empty-state';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './admin-stats.html',
  providers: [AdminReportStore],
  imports: [
    InputTextModule,
    CommonModule,
    DatePicker,
    RouterModule,
    FormsModule,
    LucideAngularModule,
    PerformanceOverviewComponent,
    ProgramCardComponent,
    PerformanceSkeletonComponent,
    EmptyStateComponent
  ]
})
export class AdminStats {
  reportStore = inject(AdminReportStore);
  year = signal<Date>(new Date());
  icons = {
    calendar: Calendar
  };

  averagePerformance = computed(() => {
    const reports = this.reportStore.report();
    if (!reports || reports.length === 0) return 0;

    const totalPerformance = reports.reduce((sum, program) => {
      const programPerformance =
        program.categories.length > 0
          ? program.categories.reduce((catSum, cat) => catSum + (cat.performance || 0), 0) / program.categories.length
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
      return perfB - perfA; // Descending order (highest first)
    });
  });

  constructor() {
    effect(() => {
      this.reportStore.getAdminReport(this.year().getFullYear());
    });
  }
}
