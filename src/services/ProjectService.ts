
import { supabase } from '@/integrations/supabase/client';
import { Project } from '../types/Project';
import { toast } from 'sonner';

// Helper function to ensure the multilanguage fields are properly formatted
const ensureMultiLangFormat = (jsonData: any): { ru: string; en: string; uz: string } => {
  if (typeof jsonData === 'object' && jsonData !== null) {
    return {
      ru: jsonData.ru || '',
      en: jsonData.en || '',
      uz: jsonData.uz || ''
    };
  }
  // Fallback if the data is not in the expected format
  return {
    ru: String(jsonData || ''),
    en: String(jsonData || ''),
    uz: String(jsonData || '')
  };
};

// Fetch all projects from Supabase
export const getProjects = async (): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
    
    // Transform the data to match the Project type
    const projects: Project[] = data.map(item => ({
      id: item.id,
      title: ensureMultiLangFormat(item.title),
      description: ensureMultiLangFormat(item.description),
      technologies: item.technologies,
      image_url: item.image_url,
      website_url: item.website_url,
      github_url: item.github_url,
      featured: item.featured,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
    
    return projects;
  } catch (error) {
    console.error('Error in getProjects:', error);
    return [];
  }
};

// Add a new project
export const addProject = async (
  project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project | null> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding project:', error);
      throw error;
    }
    
    // Transform to match Project type
    const newProject: Project = {
      id: data.id,
      title: ensureMultiLangFormat(data.title),
      description: ensureMultiLangFormat(data.description),
      technologies: data.technologies,
      image_url: data.image_url,
      website_url: data.website_url,
      github_url: data.github_url,
      featured: data.featured,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return newProject;
  } catch (error) {
    console.error('Error in addProject:', error);
    return null;
  }
};

// Delete a project
export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProject:', error);
    return false;
  }
};

// Update a project
export const updateProject = async (
  id: string, 
  updatedData: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
): Promise<Project | null> => {
  try {
    // Add updated_at timestamp
    const dataToUpdate = {
      ...updatedData,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('projects')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }
    
    // Transform to match Project type
    const updatedProject: Project = {
      id: data.id,
      title: ensureMultiLangFormat(data.title),
      description: ensureMultiLangFormat(data.description),
      technologies: data.technologies,
      image_url: data.image_url,
      website_url: data.website_url,
      github_url: data.github_url,
      featured: data.featured,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return updatedProject;
  } catch (error) {
    console.error('Error in updateProject:', error);
    return null;
  }
};

// Take a screenshot of a website and upload to Supabase storage
export const captureWebsiteScreenshot = async (url: string): Promise<string> => {
  try {
    // Create Edge Function to capture screenshot
    const { data, error } = await supabase.functions.invoke('capture-screenshot', {
      body: { url },
    });
    
    if (error) {
      console.error('Error capturing screenshot:', error);
      toast.error('Screenshot Error', {
        description: 'Could not capture screenshot. Using placeholder.'
      });
      return '/placeholder.svg';
    }
    
    if (!data || !data.imageUrl) {
      console.error('No screenshot data returned');
      return '/placeholder.svg';
    }
    
    return data.imageUrl;
  } catch (error) {
    console.error('Error in captureWebsiteScreenshot:', error);
    return '/placeholder.svg';
  }
};
