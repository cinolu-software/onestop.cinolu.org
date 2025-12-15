import { Component, input } from '@angular/core';
import { LucideAngularModule, Inbox } from 'lucide-angular';

@Component({
  selector: 'app-ui-empty-state',
  imports: [LucideAngularModule],
  templateUrl: './empty-state.html'
})
export class EmptyState {
  year = input.required<number>();
  icons = { Inbox };
}
