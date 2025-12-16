import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IEvent } from '@shared/models';
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Flag,
  FolderOpen,
  LucideAngularModule,
  MapPin,
  SquareCheckBig,
  Target,
  User,
  CircleCheckBig
} from 'lucide-angular';
import { UiAccordion, UiAccordionPanel, UiAccordionHeader, UiAccordionContent } from '@shared/ui';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.html',
  imports: [UiAccordion, UiAccordionPanel, UiAccordionHeader, UiAccordionContent, LucideAngularModule, CommonModule]
})
export class EventDetailsComponent {
  event = input.required<IEvent>();
  icons = {
    FolderOpen,
    User,
    Clock,
    Calendar,
    Flag,
    FileText,
    BookOpen,
    Target,
    SquareCheckBig,
    MapPin,
    CircleCheckBig
  };
}
