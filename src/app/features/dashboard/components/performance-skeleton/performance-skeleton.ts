import { Component } from '@angular/core';

@Component({
  selector: 'app-performance-skeleton',
  imports: [],
  templateUrl: './performance-skeleton.html'
})
export class PerformanceSkeletonComponent {
  skeletonArray = Array(5);
  cardSkeletonArray = Array(6);
  indicatorSkeletonArray = Array(2);
}
