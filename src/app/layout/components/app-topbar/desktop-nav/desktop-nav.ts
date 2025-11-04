import { Component, inject, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';
import { ILink } from '../../../data/links.data';
import { AuthStore } from '@core/auth/auth.store';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.html',
  imports: [CommonModule, LucideAngularModule, ApiImgPipe, NgOptimizedImage, RouterModule]
})
export class DesktopNav {
  readonly authStore = inject(AuthStore);
  readonly links = input.required<ILink[]>();
  readonly icons = { chevronDown: ChevronDown } as const;

  onSignOut(): void {
    this.authStore.signOut();
  }
}
