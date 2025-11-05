export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar?: string;
}

export interface Stat {
  id: number;
  value: number;
  label: string;
  suffix: string;
  icon?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Mwamba',
    role: 'Entrepreneure tech',
    quote:
      "Grâce à OneStop, j'ai pu suivre ma formation et être accompagnée par un mentor sans quitter la plateforme. Une expérience fluide et enrichissante !"
  },
  {
    id: 2,
    name: 'Jean Kabongo',
    role: 'Fondateur startup agritech',
    quote:
      "OneStop m'a permis de centraliser toutes mes candidatures et de suivre mon évolution. Un vrai gain de temps et d'efficacité."
  },
  {
    id: 3,
    name: 'Marie Tshimanga',
    role: 'Porteur de projet',
    quote:
      "L'accès aux formations et le réseau de mentors ont été déterminants dans le développement de mon entreprise."
  }
];

export const STATS: Stat[] = [
  {
    id: 1,
    value: 500,
    label: 'Entrepreneurs accompagnés',
    suffix: '+'
  },
  {
    id: 2,
    value: 10000,
    label: 'Bénéficiaires formés',
    suffix: '+'
  },
  {
    id: 3,
    value: 30,
    label: 'Programmes incubés',
    suffix: '+'
  }
];
