import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Advantage } from '@features/guest/landing/data/advantages.data';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-advantage-card',
  imports: [LucideAngularModule, NgClass],
  templateUrl: './advantage-card.html'
})
export class AdvantageCard {
  advantage = input.required<Advantage>();

  iconBgColor = computed(() => {
    return this.advantage().iconColor.replace('text-', 'bg-');
  });
}
