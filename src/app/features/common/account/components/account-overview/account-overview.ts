import { Component, Input, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, User, Phone, FileText, Camera, MapPin, Calendar } from 'lucide-angular';
import { IUser } from '@shared/models';
import { environment } from '@environments/environment';
import { FileUpload } from '@shared/components';
import { ApiImgPipe } from '@shared/pipes';
import { AuthStore } from '@core/auth';

@Component({
  selector: 'app-account-overview',
  standalone: true,
  templateUrl: './account-overview.html',
  imports: [CommonModule, LucideAngularModule, NgOptimizedImage, FileUpload, ApiImgPipe]
})
export class AccountOverviewComponent {
  @Input({ required: true }) user!: IUser;
  url = environment.apiUrl + 'users/image-profile';
  #authStore = inject(AuthStore);
  icons = {
    user: User,
    phone: Phone,
    fileText: FileText,
    camera: Camera,
    mapPin: MapPin,
    calendar: Calendar
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
