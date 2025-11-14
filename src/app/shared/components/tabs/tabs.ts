import { CommonModule } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-tabs',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tabs {
  tabs = input.required<{ label: string; name: string; icon?: LucideIconData }[]>();
  activeCount = input<number>();
  activeTab = input<string>();
  tabChange = output<string>();
  isLoading = input<boolean>(false);

  onTabChange(tabName: string) {
    this.tabChange.emit(tabName);
  }
}
