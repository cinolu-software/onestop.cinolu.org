import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BriefcaseBusiness, Hand, LucideAngularModule, Mic, Share2, TrendingUp } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { UserStatsStore } from '../../store/user-stats.store';
import { AuthStore } from '@core/auth/auth.store';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.html',
  providers: [UserStatsStore],
  imports: [
    ButtonModule,
    InputTextModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
    NgxPaginationModule,
    ConfirmPopupModule,
  ],
})
export class UserStats {
  store = inject(UserStatsStore);
  authStore = inject(AuthStore);

  icons = {
    ventures: BriefcaseBusiness,
    mic: Mic,
    trendingUp: TrendingUp,
    share: Share2,
    hand: Hand,
  };
}
