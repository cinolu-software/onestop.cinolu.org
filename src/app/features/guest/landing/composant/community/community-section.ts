import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Users, Globe, Lightbulb, TrendingUp } from 'lucide-angular';

@Component({
  selector: 'app-community',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './community-section.html'
})
export class CommunitySection {
  icons = {
    users: Users,
    globe: Globe,
    lightbulb: Lightbulb,
    trending: TrendingUp
  };

  benefits = [
    {
      icon: this.icons.users,
      title: "Réseau d'entrepreneurs",
      description: "Connectez-vous avec des milliers d'innovateurs africains"
    },
    {
      icon: this.icons.lightbulb,
      title: 'Partage de connaissances',
      description: 'Échangez idées et expériences avec la communauté'
    },
    {
      icon: this.icons.trending,
      title: 'Opportunités de croissance',
      description: 'Accédez à des partenariats et opportunités de financement'
    },
    {
      icon: this.icons.globe,
      title: 'Impact continental',
      description: "Participez à la transformation entrepreneuriale de l'Afrique"
    }
  ];
}
