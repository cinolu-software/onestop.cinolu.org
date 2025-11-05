import { Component, OnInit, input, signal } from '@angular/core';
import { Stat } from '../../data/testimonials.data';

@Component({
  selector: 'app-stat-counter',
  imports: [],
  templateUrl: './stat-counter.html'
})
export class StatCounter implements OnInit {
  stat = input.required<Stat>();
  currentValue = signal(0);

  ngOnInit(): void {
    this.animateCounter();
  }

  private animateCounter(): void {
    const target = this.stat().value;
    const duration = 2000; 
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        this.currentValue.set(target);
        clearInterval(interval);
      } else {
        this.currentValue.set(Math.floor(current));
      }
    }, stepDuration);
  }
}
