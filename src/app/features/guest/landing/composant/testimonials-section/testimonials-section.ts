import { Component, OnInit, signal } from '@angular/core';
import { TESTIMONIALS, STATS } from '../../data/testimonials.data';
import { TestimonialCard } from '../testimonial-card/testimonial-card';
import { StatCounter } from '../stat-counter/stat-counter';

@Component({
  selector: 'app-testimonials',
  imports: [TestimonialCard, StatCounter],
  templateUrl: './testimonials-section.html'
})
export class TestimonialsSection implements OnInit {
  testimonials = TESTIMONIALS;
  stats = STATS;
  activeTestimonial = signal(0);

  ngOnInit(): void {
    setInterval(() => {
      this.activeTestimonial.update((current) => (current + 1) % this.testimonials.length);
    }, 5000);
  }

  setActiveTestimonial(index: number): void {
    this.activeTestimonial.set(index);
  }
}
