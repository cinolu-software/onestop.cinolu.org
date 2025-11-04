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
  selectedYear = computed(() => this.year().getFullYear());
  icons = {
    calendar: Calendar
  };

  totalIndicators = computed(() => {
    return this.reportStore.report().reduce((sum, program) => {
      return sum + program.indicators.length;
    }, 0);
  });

  averagePerformance = computed(() => {
    const reports = this.reportStore.report();
    if (reports.length === 0) return 0;
    const totalPerformance = reports.reduce((sum, program) => {
      return sum + program.performance;
    }, 0);
    return Math.round(totalPerformance / reports.length);
  });

  constructor() {
    effect(() => {
      this.reportStore.getAdminReport(this.selectedYear());
    });
  }
}
