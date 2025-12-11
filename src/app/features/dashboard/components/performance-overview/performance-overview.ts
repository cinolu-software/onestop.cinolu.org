import { Component, input } from '@angular/core';
import { LucideAngularModule, FolderKanban, TrendingUp, Award } from 'lucide-angular';

@Component({
  selector: 'app-performance-overview',
  imports: [LucideAngularModule],
  templateUrl: './performance-overview.html',
})
export class PerformanceOverview {
  year = input.required<number>();
  programCount = input.required<number>();
  averagePerformance = input.required<number>();

  icons = { FolderKanban, TrendingUp, Award };
}
