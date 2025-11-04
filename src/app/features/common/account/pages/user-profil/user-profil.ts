import { Component, inject } from '@angular/core';
import {
  LucideAngularModule,
  Phone,
  User,
  FileText,
  SquarePen,
  Lock,
  Camera,
  Calendar,
  MapPin,
  Mail,
  MoveRight
} from 'lucide-angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FileUpload } from '@shared/components';
import { IUser } from '@shared/models';
import { ApiImgPipe } from '@shared/pipes';
import { environment } from '@environments/environment';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { AuthStore } from '@core/auth';

@Component({
  selector: 'app-user-profil',
  imports: [LucideAngularModule, ApiImgPipe, CommonModule, NgOptimizedImage, Button, FileUpload, RouterLink],
  templateUrl: './user-profil.html'
})
export class UserProfil {
  url = environment.apiUrl + 'users/image-profile';

  store = inject(AuthStore);

  icons = {
    user: User,
    phone: Phone,
    fileText: FileText,
    lock: Lock,
    edit: SquarePen,
    camera: Camera,
    calendar: Calendar,
    mapPin: MapPin,
    mail: Mail,
    moveRight: MoveRight
  };

  handleLoaded(): void {
    this.store.getProfile();
  }

  isGender(user: IUser): string {
    switch (user.gender) {
      case 'male':
        return 'Masculin';
      case 'female':
        return 'Féminin';
      default:
        return 'Non spécifié';
    }
  }
}
