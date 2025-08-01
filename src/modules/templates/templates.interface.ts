export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
}

export type TemplatePreview = Pick<Template, 'id' | 'name' | 'description'>;
