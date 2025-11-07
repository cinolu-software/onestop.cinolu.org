import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '@core/auth/auth.store';
import { UserStats } from '../components/user-stats/user-stats';
import { AdminReportStore } from '../store/admin-report.store';
import { AdminStats } from '../components/admin-stats/admin-stats';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  providers: [AdminReportStore],
  imports: [CommonModule, FormsModule, UserStats, AdminStats]
})
export class Dashboard {
  authStore = inject(AuthStore);
  isAdmin = signal<boolean>(false);

  constructor() {
    effect(() => {
      const roles = this.authStore.user()?.roles as unknown as string[];
      const isAdmin = roles.includes('admin') || roles.includes('staff');
      this.isAdmin.set(isAdmin);
    });
  }
}
