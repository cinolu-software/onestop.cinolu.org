import { Component, input, output, effect, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-dialog',
  imports: [CommonModule],
  templateUrl: './dialog.html'
})
export class UiDialog {
  visible = model<boolean>(false);
  header = input<string>('');
  width = input<string>('32rem');
  dismissableMask = input<boolean>(false);
  modal = input<boolean>(true);
  closable = input<boolean>(true);
  hide = output<void>();
  visibleChange = output<boolean>();

  constructor() {
    effect(() => {
      if (this.visible()) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = '';
    });
  }

  close(): void {
    this.visible.set(false);
    this.visibleChange.emit(false);
    this.hide.emit();
  }

  onMaskClick(): void {
    if (this.dismissableMask()) this.close();
  }
}
