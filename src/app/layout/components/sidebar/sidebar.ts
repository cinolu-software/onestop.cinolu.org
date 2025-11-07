import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronDown, House } from 'lucide-angular';
import { USER_LINKS, ILink, ADMIN_LINKS, COMMON_LINKS } from '../../data/links.data';
import { filter } from 'rxjs';
import { AuthStore } from '@core/auth/auth.store';
import { ButtonModule } from 'primeng/button';
import { RoleEnum } from '@core/auth/role.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, ButtonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('220ms cubic-bezier(0.2, 0, 0, 1)', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('180ms cubic-bezier(0.4, 0, 1, 1)', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class Sidebar {
  #router = inject(Router);
  style = input<string>();
  icons = { chevronDown: ChevronDown, home: House };
  currentUrl = signal(this.#router.url);
  toggleTab = signal<string | null>(null);
  closedTab = signal<string | null>(null);
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
    effect(() => {
      const roles = ((this.authStore.user()?.roles as unknown as string[]) || []).slice();
      this.links.set([...COMMON_LINKS, ...roles.flatMap((role) => this.dashboardLinks[role] || [])]);
    });
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event: NavigationEnd) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  onToggleTab(name: string): void {
    const currentlyOpen = this.isTabOpen(name);
    if (currentlyOpen) {
      this.closedTab.set(name);
      this.toggleTab.set(null);
    } else {
      this.closedTab.set(null);
      this.toggleTab.set(name);
    }
  }

  isTabOpen(name: string): boolean {
    if (this.closedTab() === name) return false;
    if (this.toggleTab()) return this.toggleTab() === name;
    return this.activeTab() === name;
  }

  panelId(name: string): string {
    return 'sidebar-panel-' + name.toLowerCase().replace(/\s+/g, '-');
  }
}
