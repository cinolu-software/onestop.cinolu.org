import { Component } from '@angular/core';

@Component({
  selector: 'app-performance-skeleton',
  imports: [],
  templateUrl: './performance-skeleton.html',
})
export class PerformanceSkeleton {
  skeletonArray = Array(3);
  cardSkeletonArray = Array(6);
  indicatorSkeletonArray = Array(2);
}
