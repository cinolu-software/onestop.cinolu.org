import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-cta',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './cta-section.html'
})
export class CTASection {
  icons = {
    arrow: ArrowRight,
    sparkles: Sparkles
  };
}
