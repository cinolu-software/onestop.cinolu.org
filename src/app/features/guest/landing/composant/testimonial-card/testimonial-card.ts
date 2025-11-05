import { Component, input } from '@angular/core';
import { Testimonial } from '../../data/testimonials.data';
import { LucideAngularModule, Quote } from 'lucide-angular';

@Component({
  selector: 'app-testimonial-card',
  imports: [LucideAngularModule],
  templateUrl: './testimonial-card.html'
})
export class TestimonialCard {
  testimonial = input.required<Testimonial>();
  quoteIcon = Quote;
}
