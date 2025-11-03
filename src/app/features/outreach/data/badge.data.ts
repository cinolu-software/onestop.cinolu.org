import { Award, Crown, Gem, LucideIconData, Medal, Trophy } from 'lucide-angular';

export interface Badge {
  name: string;
  threshold: number;
  icon: LucideIconData;
}

export const BADGES: Badge[] = [
  { name: 'Bronze', threshold: 10, icon: Award },
  { name: 'Silver', threshold: 50, icon: Medal },
  { name: 'Gold', threshold: 100, icon: Trophy },
  { name: 'Platinum', threshold: 250, icon: Crown },
  { name: 'Diamond', threshold: 500, icon: Gem },
];
