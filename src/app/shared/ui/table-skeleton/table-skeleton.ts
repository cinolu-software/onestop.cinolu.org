import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-ui-table-skeleton',
  imports: [],
  templateUrl: './table-skeleton.html'
})
export class UiTableSkeleton {
  columns = input<number>(10);
  rows = input<number>(10);

  columnsArray = computed(() => Array(this.columns()).fill(0));
  rowsArray = computed(() => Array(this.rows()).fill(0));
}
