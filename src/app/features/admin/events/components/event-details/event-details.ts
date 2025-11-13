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
  User
} from 'lucide-angular';
import { AccordionModule } from 'primeng/accordion';
import { EventDetailsSkeletonComponent } from '../event-details-skeleton/event-details-skeleton';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.html',
  imports: [AccordionModule, LucideAngularModule, CommonModule, EventDetailsSkeletonComponent]
})
export class EventDetailsComponent {
  event = input.required<IEvent>();
  isLoading = input<boolean>(false);
  icons = {
    folder: FolderOpen,
    user: User,
    clock: Clock,
    calendar: Calendar,
    flag: Flag,
    fileText: FileText,
    bookOpen: BookOpen,
    target: Target,
    checkSquare: SquareCheckBig,
    mapPin: MapPin
  };
}
