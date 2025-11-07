import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Topbar } from '../../components/topbar/topbar';
import { BackButton } from '@shared/components/back-button/back-button';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.html',
  imports: [RouterOutlet, Topbar, Sidebar, BackButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayout {}
