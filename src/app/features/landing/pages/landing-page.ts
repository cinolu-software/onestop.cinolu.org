import { Component } from '@angular/core';
import { Hero } from '../composant/hero/hero';
import { Advantages } from "../composant/advantages-section/advantages-section";

@Component({
  selector: 'app-landing-page',
  imports: [Hero, Advantages],
  templateUrl: './landing-page.html'
})
export class LandingPage {}
