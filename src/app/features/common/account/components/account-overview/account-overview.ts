import { Component, inject, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, User, Phone, FileText, Camera, MapPin, Calendar, Mail } from 'lucide-angular';
import { IUser } from '@shared/models';
import { environment } from '@environments/environment';
import { ApiImgPipe } from '@shared/pipes';
import { AuthStore } from '@core/auth';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.html',
  imports: [CommonModule, LucideAngularModule, NgOptimizedImage, ApiImgPipe]
})
export class AccountOverviewComponent {
  user = input.required<IUser>();
  url = environment.apiUrl + 'users/image-profile';
  #authStore = inject(AuthStore);
  icons = {
    user: User,
    phone: Phone,
    fileText: FileText,
    camera: Camera,
    mapPin: MapPin,
    calendar: Calendar,
    mail: Mail
  };
  genderLabel(user: IUser): string {
    switch (user.gender) {
      case 'male':
        return 'Masculin';
      case 'female':
        return 'Féminin';
      default:
        return 'Non spécifié';
    }
  }

  handleLoaded(): void {
    this.#authStore.getProfile();
  }
}
