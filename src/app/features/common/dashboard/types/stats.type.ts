export interface IUserStats {
  totalVentures: number;
  referralsCount: number;
}

export interface CategoryReport {
  category: string;
  totalIndicators: number;
  totalTarget: number;
  totalAchieved: number;
  performance: number;
}

export interface ProgramReport {
  name: string;
  categories: CategoryReport[];
  performance?: number;
}
