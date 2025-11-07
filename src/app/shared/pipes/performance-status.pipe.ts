import { Pipe, PipeTransform } from '@angular/core';
import { getPerformanceStatus, getPerformanceColor } from '../helpers/metrics.helper';

@Pipe({
  name: 'performanceStatus',
  pure: true
})
export class PerformanceStatusPipe implements PipeTransform {
  transform(percentage: number): string {
    const status = getPerformanceStatus(percentage);
    return getPerformanceColor(status);
  }
}
