import { Component, input } from '@angular/core';
import { LucideAngularModule, Inbox } from 'lucide-angular';

@Component({
  selector: 'app-empty-state',
  imports: [LucideAngularModule],
  templateUrl: './empty-state.html'
})
export class EmptyStateComponent {
  year = input.required<number>();

  icons = {
    inbox: Inbox
  };
}
