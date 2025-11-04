import { Component, input } from '@angular/core';
import { LucideAngularModule, ChartColumn, CircleCheck, TriangleAlert } from 'lucide-angular';

@Component({
  selector: 'app-performance-overview',
  imports: [LucideAngularModule],
  templateUrl: './performance-overview.html'
})
export class PerformanceOverviewComponent {
  year = input.required<number>();
  programCount = input.required<number>();
  totalIndicators = input.required<number>();
  averagePerformance = input.required<number>();

  icons = {
    alertTriangle: TriangleAlert,
    barChart: ChartColumn,
    checkCircle: CircleCheck
  };
}
