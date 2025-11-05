import { Component } from '@angular/core';
import { STEPS } from '../../data/steps.data';
import { StepCard } from '../step-card/step-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-how-it-works',
  imports: [StepCard, RouterLink],
  templateUrl: './how-it-works-section.html'
})
export class HowItWorksSection {
  steps = STEPS;
}
