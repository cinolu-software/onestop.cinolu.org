import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, SearchX, House, ArrowLeft } from 'lucide-angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  imports: [LucideAngularModule, RouterModule],
  templateUrl: './not-found.html'
})
export class NotFoundPage {
  #location = inject(Location);
  icons = {
    searchX: SearchX,
    home: House,
    arrowLeft: ArrowLeft
  };

  goBack(): void {
    this.#location.back();
  }
}
