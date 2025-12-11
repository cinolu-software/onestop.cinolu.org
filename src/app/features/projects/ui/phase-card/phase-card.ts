import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import {
  LucideAngularModule,
  Trash2,
  FileText,
  CalendarDays,
  SquarePen,
  CircleCheck
} from 'lucide-angular';
import { UiButton } from '@shared/ui';
import { IPhase } from '@shared/models';

@Component({
  selector: 'app-phase-card',
  templateUrl: './phase-card.html',
  imports: [CommonModule, LucideAngularModule, UiButton]
})
export class PhaseCardComponent {
  phase = input.required<IPhase>();
  isSelected = input<boolean>(false);
  phaseSelect = output<IPhase>();
  phaseEdit = output<IPhase>();
  phaseDelete = output<string>();
  icons = {
    edit: SquarePen,
    trash: Trash2,
    file: FileText,
    calendar: CalendarDays,
    checkCircle: CircleCheck
  };

  handleSelect(): void {
    this.phaseSelect.emit(this.phase());
  }

  handleEdit(event: Event): void {
    event.stopPropagation();
    this.phaseEdit.emit(this.phase());
  }

  handleDelete(event: Event): void {
    event.stopPropagation();
    this.phaseDelete.emit(this.phase().id);
  }
}
