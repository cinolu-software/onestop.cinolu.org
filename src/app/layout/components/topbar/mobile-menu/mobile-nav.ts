import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Menu, X, ChevronDown, LogOut, House } from 'lucide-angular';
import { LINKS } from '../../../data/links.data';
import { IUser } from '@shared/models';
import { filter } from 'rxjs';
import { AuthStore } from '@core/auth/auth.store';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { ILink } from 'src/app/layout/types/link.type';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.html',
  imports: [LucideAngularModule, RouterModule, CommonModule, ApiImgPipe]
})
export class MobileNav {
  user = input.required<IUser | null>();
  signOut = output<void>();
  isOpen = signal<boolean>(false);
  icons = { menu: Menu, close: X, home: House, chevronDown: ChevronDown, logOut: LogOut };
  #router = inject(Router);
  style = input<string>();
  currentUrl = signal(this.#router.url);
  toggleTab = signal<string | null>(null);
  authStore = inject(AuthStore);
  links = signal<ILink[]>(LINKS);

  activeTab = computed(() => {
    const url = this.currentUrl();
    return (
      this.links().find(
        (link) =>
          link.path === url ||
          link.children?.some((child) => child.path && url.startsWith(child.path))
      )?.name ?? null
    );
  });

  constructor() {
    this.#router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
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

  toggleNav(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  handleSignOut(): void {
    this.signOut.emit();
  }

  closeNav(): void {
    this.isOpen.set(false);
  }
}
