import { Component } from '@angular/core';
import { Hero } from '../composant/hero/hero';
import { Advantages } from '../composant/advantages-section/advantages-section';
import { FeaturesSection } from '../composant/features-section/features-section';
import { HowItWorksSection } from '../composant/how-it-works/how-it-works-section';
import { TestimonialsSection } from '../composant/testimonials-section/testimonials-section';
import { CommunitySection } from '../composant/community/community-section';
import { CTASection } from '../composant/cta/cta-section';

@Component({
  selector: 'app-landing-page',
  imports: [Hero, Advantages, FeaturesSection, HowItWorksSection, TestimonialsSection, CommunitySection, CTASection],
  templateUrl: './landing-page.html'
})
export class LandingPage {}
