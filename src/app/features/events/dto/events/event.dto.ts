export interface EventDto {
  id: string;
  name: string;
  place: string;
  description: string;
  context?: string;
  objectives?: string;
  duration_hours?: number;
  selection_criteria?: string;
  started_at: Date;
  ended_at: Date;
  event_manager?: string;
  program: string;
  categories: string[];
}
