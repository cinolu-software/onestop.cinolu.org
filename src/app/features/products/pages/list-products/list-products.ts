import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LucideAngularModule, Plus, ShoppingBasket } from 'lucide-angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsStore } from '../../store/products/products.store';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { FilterProductsDto } from '../../dto/filter-product.dto';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductCardSkeleton } from '../../components/product-card-skeleton/product-card-skeleton';

@Component({
  selector: 'app-ventures-list',
  templateUrl: './list-products.html',
  providers: [ProductsStore, ConfirmationService],
  imports: [
    ButtonModule,
    InputTextModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
    NgxPaginationModule,
    ConfirmPopupModule,
    ProductCard,
    ProductCardSkeleton,
  ],
})
export class ListVentures implements OnInit {
  icons = { plus: Plus, shopping: ShoppingBasket };
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  store = inject(ProductsStore);
  queryParams = signal<FilterProductsDto>({
    page: this.#route.snapshot.queryParams?.['page'],
  });

  ngOnInit(): void {
    this.store.loadProducts(this.queryParams());
  }

  async onPageChange(currentPage: number): Promise<void> {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    await this.updateRouteAndEnterprises();
  }

  async updateRoute(): Promise<void> {
    const { page } = this.queryParams();
    const queryParams = { page };
    await this.#router.navigate(['/dashboard/ventures'], { queryParams });
  }

  async updateRouteAndEnterprises(): Promise<void> {
    await this.updateRoute();
    this.store.loadProducts(this.queryParams());
  }
}
