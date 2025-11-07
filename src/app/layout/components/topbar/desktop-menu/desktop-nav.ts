import { Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LogOut, ChevronDown } from 'lucide-angular';
import { IUser } from '../../../../shared/models/entities.models';
import { ApiImgPipe } from '../../../../shared/pipes/api-img.pipe';

@Component({
  selector: 'app-desktop-nav',
  templateUrl: './desktop-nav.html',
  imports: [CommonModule, RouterModule, ApiImgPipe, LucideAngularModule, NgOptimizedImage],
})
export class DesktopNav {
  user = input.required<IUser | null>();
  signOut = output<void>();
  icons = { chevronDown: ChevronDown, logOut: LogOut };

  handleSignOut(): void {
    this.signOut.emit();
  }
}
