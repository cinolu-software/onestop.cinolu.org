export interface EventDto {
  id: string;
  name: string;
  description: string;
  form_link: string;
  started_at: Date;
  ended_at: Date;
  program: string;
  categories: string[];
  place: string;
}
