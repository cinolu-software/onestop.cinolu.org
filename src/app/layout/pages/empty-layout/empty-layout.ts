import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackButton } from '../../../shared/ui/back-button/back-button';

@Component({
  selector: 'app-empty-layout',
  templateUrl: './empty-layout.html',
  imports: [RouterOutlet, BackButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyLayout {}
