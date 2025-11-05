import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { Feature } from '../../data/features.data';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-feature-card',
  imports: [LucideAngularModule, NgClass],
  templateUrl: './feature-card.html'
})
export class FeatureCard {
  feature = input.required<Feature>();
}
