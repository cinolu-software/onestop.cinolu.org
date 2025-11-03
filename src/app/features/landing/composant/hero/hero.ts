import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookOpen, Lightbulb, LucideAngularModule, MoveRight, Users } from 'lucide-angular';
import { Button } from 'primeng/button';
import { ADVANTAGES } from '@features/landing/data/advantages.data';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, Button, LucideAngularModule, NgOptimizedImage],
  templateUrl: './hero.html'
})
export class Hero {
  advantages = ADVANTAGES;
  icons = {
    moveRight: MoveRight,
    lightbulb: Lightbulb,
    users: Users,
    bookOpen: BookOpen
  };
}
