import { UserPlus, Target, Video, Users2, LucideIconData } from 'lucide-angular';

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: LucideIconData;
}

export const STEPS: Step[] = [
  {
    id: 1,
    title: 'Créez votre compte',
    description: 'Inscrivez-vous gratuitement en quelques minutes et accédez à la plateforme.',
    icon: UserPlus
  },
  {
    id: 2,
    title: 'Choisissez votre programme',
    description: "Parcourez nos programmes d'incubation et sélectionnez celui qui vous correspond.",
    icon: Target
  },
  {
    id: 3,
    title: 'Suivez vos sessions',
    description: 'Participez aux formations et échangez avec vos mentors en ligne.',
    icon: Video
  },
  {
    id: 4,
    title: 'Connectez-vous à la communauté',
    description: "Rejoignez le réseau d'entrepreneurs et partagez vos expériences.",
    icon: Users2
  }
];
