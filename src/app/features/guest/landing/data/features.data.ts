import { GraduationCap, TrendingUp, Users, BarChart3, LucideIconData } from 'lucide-angular';

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: LucideIconData;
  iconColor: string;
  bgColor: string;
}

export const FEATURES: Feature[] = [
  {
    id: 1,
    title: 'Formations & guides en ligne',
    description: 'Accédez à des ressources pédagogiques de qualité pour développer vos compétences entrepreneuriales.',
    icon: GraduationCap,
    iconColor: 'text-primary-600',
    bgColor: 'bg-primary-50'
  },
  {
    id: 2,
    title: 'Suivi en temps réel',
    description: "Suivez l'état de vos candidatures et gérez vos programmes en toute transparence.",
    icon: TrendingUp,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 3,
    title: 'Mentorat et réseautage',
    description: "Connectez-vous avec des mentors qualifiés et rejoignez une communauté d'innovateurs.",
    icon: Users,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 4,
    title: 'Statistiques et progression',
    description: 'Visualisez votre évolution et mesurez vos progrès grâce à des tableaux de bord intuitifs.',
    icon: BarChart3,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50'
  }
];
