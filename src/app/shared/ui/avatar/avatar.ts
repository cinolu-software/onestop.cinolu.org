import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ImageOff, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-ui-avatar',
  imports: [NgOptimizedImage, LucideAngularModule],
  templateUrl: './avatar.html'
})
export class UiAvatar {
  label = input<string>('');
  image = input<string | null>(null);
  size = input<number>(50);
  icons = { ImageOff };
  shape = input<'circle' | 'square'>('circle');

  avatarClasses() {
    return [this.shape() === 'square' ? 'rounded-md' : 'rounded-full'].filter(Boolean).join(' ');
  }
}
