import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartColumn, SquarePen } from 'lucide-angular';
import { UiTabs } from '@shared/ui';
import { UsersStore } from '../../store/users.store';
import { UserDetails } from '../../components/user-details/user-details';
import { UserEditForm } from '../../components/user-edit-form/user-edit-form';
import { UserDetailsSkeleton } from '../../ui/user-details-skeleton/user-details-skeleton';

@Component({
  selector: 'app-user-update',
  templateUrl: './update-user.html',
  providers: [UsersStore],
  imports: [UiTabs, UserDetails, UserEditForm, UserDetailsSkeleton]
})
export class UpdateUser implements OnInit {
  #route = inject(ActivatedRoute);
  #email = this.#route.snapshot.params['email'];
  usersStore = inject(UsersStore);
  activeTab = signal('details');
  tabs = [
    { label: "Fiche d'utilisateur", name: 'details', icon: ChartColumn },
    { label: 'Mettre à jour', name: 'edit', icon: SquarePen }
  ];

  constructor() {
    this.#watchUserChanges();
  }

  ngOnInit(): void {
    this.usersStore.loadOne(this.#email);
  }

  #watchUserChanges(): void {
    effect(() => {
      const user = this.usersStore.user();
      if (!user) return;
    });
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
  }
}
