import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Building2, LucideAngularModule, Plus } from 'lucide-angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VenturesStore } from '../../store/ventures/ventures.store';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { FilterVenturesDto } from '../../dto/filter-venture.dto';
import { VentureCard } from '../../components/venture-card/venture-card';
import { VentureCardSkeleton } from '../../components/venture-card-skeleton/venture-card-skeleton';

@Component({
  selector: 'app-ventures-list',
  templateUrl: './list-ventures.html',
  providers: [VenturesStore, ConfirmationService],
  imports: [
    ButtonModule,
    InputTextModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
    NgxPaginationModule,
    ConfirmPopupModule,
    VentureCard,
    VentureCardSkeleton,
  ],
})
export class ListVentures implements OnInit {
  icons = { plus: Plus, company: Building2 };
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  store = inject(VenturesStore);
  queryParams = signal<FilterVenturesDto>({
    page: this.#route.snapshot.queryParams?.['page'],
  });

  ngOnInit(): void {
    this.store.loadVentures(this.queryParams());
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
    this.store.loadVentures(this.queryParams());
  }
}
