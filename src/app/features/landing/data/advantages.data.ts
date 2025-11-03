import { Briefcase, Compass, LucideIconData, TreeDeciduous } from 'lucide-angular';

export interface Advantage {
  id: number;
  description: string;
  icon: LucideIconData;
  bgColor: string;
  iconColor: string;
  textColor: string;
}

export const ADVANTAGES: Advantage[] = [
  {
    id: 1,
    description: "Accédez à plus de 10 programmes d'incubation et d'accélération",
    icon: Compass,
    bgColor: 'bg-primary-50',
    iconColor: 'text-primary-600',
    textColor: 'text-primary-900'
  },
  {
    id: 2,
    description: 'Rejoignez un réseau de plus de 2000 innovateurs',
    icon: Briefcase,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900'
  },
  {
    id: 3,
    description: 'Développez vos compétences avec nos coachs et mentors',
    icon: TreeDeciduous,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    textColor: 'text-amber-900'
  }
];
