import { Component, OnInit, inject, signal } from '@angular/core';
import { LucideAngularModule, User, Pen } from 'lucide-angular';
import { AuthStore } from '@core/auth';
import { UiTabs } from '@ui';
import { AccountOverview } from '@features/account/components/account-overview/account-overview';
import { AccountUpdate } from '@features/account/components/account-update/account-update';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account-page',
  templateUrl: './account.html',
  imports: [LucideAngularModule, UiTabs, AccountOverview, AccountUpdate]
})
export class AccountPage implements OnInit {
  store = inject(AuthStore);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  activeTab = signal<string>(this.#route.snapshot.queryParamMap.get('tab') || 'overview');
  tabs = [
    { label: 'Mon compte', name: 'overview', icon: User },
    { label: 'Mettre à jour', name: 'update', icon: Pen }
  ];

  ngOnInit(): void {
    this.store.user();
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
    this.#router.navigate(['/account'], {
      queryParams: {
        tab: tab === 'overview' ? null : tab
      }
    });
  }

  handleLoaded(): void {
    this.store.getProfile();
  }
}
