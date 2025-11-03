import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronDown, House } from 'lucide-angular';
import { USER_LINKS, ILink, ADMIN_LINKS, COMMON_LINKS } from '../../data/links.data';
import { filter } from 'rxjs';
import { AuthStore } from '../../../core/auth/auth.store';
import { ButtonModule } from 'primeng/button';
import { RoleEnum } from '../../../core/auth/role.enum';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [CommonModule, ButtonModule, RouterModule, LucideAngularModule],
  templateUrl: './dashboard-sidebar.html'
})
export class DashboardSidebar {
  #router = inject(Router);
  style = input<string>();
  icons = { chevronDown: ChevronDown, home: House };
  currentUrl = signal(this.#router.url);
  toggleTab = signal<string | null>(null);
  authStore = inject(AuthStore);
  links = signal<ILink[]>([]);
  dashboardLinks: Record<string, ILink[]> = {
    [RoleEnum.User]: USER_LINKS,
    [RoleEnum.Staff]: ADMIN_LINKS,
    [RoleEnum.Admin]: ADMIN_LINKS
  };
  activeTab = computed(() => {
    const url = this.currentUrl();
    return (
      this.links().find(
        (link) => link.path === url || link.children?.some((child) => child.path && url.startsWith(child.path))
      )?.name ?? null
    );
  });

  constructor() {
    const roles = (this.authStore.user()?.roles as unknown as string[]) || [];
    effect(() => {
      this.links.set([...COMMON_LINKS, ...roles.flatMap((role) => this.dashboardLinks[role] || [])]);
    });
    this.#router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }

  onToggleTab(name: string): void {
    const isOpen = this.toggleTab() === name;
    this.toggleTab.set(isOpen ? null : name);
  }

  isTabOpen(name: string): boolean {
    return this.activeTab() === name || this.toggleTab() === name;
  }
}
