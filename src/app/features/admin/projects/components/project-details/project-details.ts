import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IProject } from '@shared/models';
import {
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  Flag,
  FolderOpen,
  LucideAngularModule,
  Target,
  User
} from 'lucide-angular';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.html',
  imports: [AccordionModule, LucideAngularModule, CommonModule]
})
export class ProjectDetailsComponent {
  project = input.required<IProject>();
  icons = {
    folder: FolderOpen,
    user: User,
    clock: Clock,
    calendar: Calendar,
    flag: Flag,
    fileText: FileText,
    bookOpen: BookOpen,
    target: Target,
    checkSquare: CheckSquare
  };
}
