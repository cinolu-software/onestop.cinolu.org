import { Component, inject, input, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Menu, X, ChevronRight, Plus } from 'lucide-angular';
import { ILink } from '../../../data/links.data';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { AuthStore } from '@core/auth/auth.store';

@Component({
  selector: 'app-mobile-nav',
  imports: [RouterModule, NgOptimizedImage, CommonModule, LucideAngularModule, ApiImgPipe],
  templateUrl: './mobile-nav.html'
})
export class MobileNav {
  authStore = inject(AuthStore);
  links = input.required<ILink[]>();
  isOpen = signal<boolean>(false);

  icons = {
    menu: Menu,
    close: X,
    chevronRight: ChevronRight,
    plus: Plus
  } as const;

  toggleNav(): void {
    this.isOpen.update((isOpen) => !isOpen);
  }

  closeNav(): void {
    this.isOpen.set(false);
  }

  onSignOut(): void {
    this.authStore.signOut();
    this.closeNav();
  }

  toggleLink(index: number): void {
    this.links().forEach((link, i) => {
      link.open = i === index ? !link.open : false;
    });
  }
}
