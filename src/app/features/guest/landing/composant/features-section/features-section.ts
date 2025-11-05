import { Component } from '@angular/core';
import { FEATURES } from '../../data/features.data';
import { FeatureCard } from '../feature-card/feature-card';

@Component({
  selector: 'app-features',
  imports: [FeatureCard],
  templateUrl: './features-section.html'
})
export class FeaturesSection {
  features = FEATURES;
}
