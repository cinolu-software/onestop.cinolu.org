export interface ProjectDto {
  id?: string;
  name: string;
  description: string;
  form_link?: string;
  context?: string;
  objectives?: string;
  duration_hours?: number;
  selection_criteria?: string;
  started_at: Date;
  ended_at: Date;
  project_manager?: string;
  program: string;
  categories: string[];
}
