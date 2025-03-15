
export interface Project {
  id: string;
  title: {
    ru: string;
    en: string;
    uz: string;
  };
  description: {
    ru: string;
    en: string;
    uz: string;
  };
  technologies: string[];
  image_url: string;
  website_url: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}
