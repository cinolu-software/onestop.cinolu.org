import { Component, input } from '@angular/core';
import { BADGES } from '../../data/badge.data';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge-card',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './badge-card.component.html'
})
export class BadgeCard {
  badges = BADGES;
  referralsCount = input<number | undefined>();
}
