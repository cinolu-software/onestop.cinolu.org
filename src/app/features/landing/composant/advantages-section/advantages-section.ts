import { Component } from '@angular/core';
import { AdvantageCard } from '../advantage-card/advantage-card';
import { ADVANTAGES } from '@features/landing/data/advantages.data';

@Component({
  selector: 'app-advantages',
  imports: [AdvantageCard],
  templateUrl: './advantages-section.html'
})
export class Advantages {
  advantages = ADVANTAGES;
}
