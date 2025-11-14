import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, User, Phone, FileText, SquarePen, Camera, Calendar, MapPin } from 'lucide-angular';
import { Tabs } from '@shared/components';
import { AuthStore } from '@core/auth';
import { environment } from '@environments/environment';
import { AccountOverviewComponent } from '../../components/account-overview/account-overview';
import { AccountEditComponent } from '../../components/account-edit/account-edit';

@Component({
  selector: 'app-account-page',
  templateUrl: './account.html',
  imports: [CommonModule, LucideAngularModule, Tabs, AccountOverviewComponent, AccountEditComponent]
})
export class AccountPage implements OnInit {
  store = inject(AuthStore);
  url = environment.apiUrl + 'users/image-profile';
  activeTab = signal<string>('overview');
  tabs = [
    { label: 'Mon compte', name: 'overview', icon: User },
    { label: 'Mettre à jour', name: 'edit', icon: SquarePen }
  ];
  icons = {
    user: User,
    phone: Phone,
    fileText: FileText,
    edit: SquarePen,
    camera: Camera,
    calendar: Calendar,
    mapPin: MapPin
  };

  ngOnInit(): void {
    this.store.user();
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }

  handleLoaded(): void {
    this.store.getProfile();
  }
}
