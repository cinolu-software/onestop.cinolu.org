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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.html',
  imports: [UiAccordion, DatePipe, UiAccordionPanel, UiAccordionHeader, UiAccordionContent, LucideAngularModule]
})
export class EventDetails {
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
