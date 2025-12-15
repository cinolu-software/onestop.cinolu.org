import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-ui-pagination',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './pagination.html'
})
export class UiPagination {
  currentPage = input<number>(1);
  totalItems = input<number>(0);
  itemsPerPage = input<number>(40);
  pageChange = output<number>();
  icons = { ChevronLeft, ChevronRight };

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

  get startItem(): number {
    return (this.currentPage() - 1) * this.itemsPerPage() + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems());
  }

  previousPage(): void {
    if (this.currentPage() > 1) this.pageChange.emit(this.currentPage() - 1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages) this.pageChange.emit(this.currentPage() + 1);
  }
}
