import { Pipe, PipeTransform } from '@angular/core';
import { performanceStatus, performanceColor } from '../helpers/metrics.helper';

@Pipe({
  name: 'performanceStatus',
  pure: true
})
export class PerformanceStatusPipe implements PipeTransform {
  transform(percentage: number): string {
    const status = performanceStatus(percentage);
    return performanceColor(status);
  }
}
