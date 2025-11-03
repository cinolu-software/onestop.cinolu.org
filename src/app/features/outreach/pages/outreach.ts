import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Link, LucideAngularModule, UsersRound } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthStore } from '@core/auth/auth.store';
import { environment } from '@environments/environment';
import { GenerateReferralCodeStore } from '../store/generate-referralCode.store';
import { BadgeCardComponent } from '../components/badge-card.component';

@Component({
  selector: 'app-outreach',
  templateUrl: './outreach.html',
  providers: [GenerateReferralCodeStore],
  imports: [
    ButtonModule,
    InputTextModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    LucideAngularModule,
    NgxPaginationModule,
    ButtonModule,
    BadgeCardComponent,
  ],
})
export class Outreach {
  authStore = inject(AuthStore);
  generateReferralCodeStore = inject(GenerateReferralCodeStore);
  referralLink = signal('');
  isLinkCopied = signal(false);
  icons = {
    link: Link,
    user: UsersRound,
  };

  constructor() {
    effect(() => {
      this.referralLink.set(`${environment.appUrl}sign-up?ref=${this.authStore.user()?.referral_code}`);
      if (this.isLinkCopied()) {
        setTimeout(() => {
          this.isLinkCopied.set(false);
        }, 3000);
      }
    });
  }

  copyReferralLink(): void {
    this.isLinkCopied.set(true);
    navigator.clipboard.writeText(this.referralLink()).then();
  }

  generateNewReferralLink(): void {
    this.generateReferralCodeStore.generateCode();
  }
}
