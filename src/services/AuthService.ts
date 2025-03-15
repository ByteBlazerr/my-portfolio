
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AuthUser = {
  id: string;
  email?: string;
};

// Sign up with email and password
export const signUp = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      toast.error('Sign Up Error', {
        description: error.message,
      });
      throw error;
    }
    
    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in signUp:', error);
    return null;
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast.error('Sign In Error', {
        description: error.message,
      });
      throw error;
    }
    
    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in signIn:', error);
    return null;
  }
};

// Sign out
export const signOut = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error('Sign Out Error', {
        description: error.message,
      });
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in signOut:', error);
    return false;
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return data.session;
  } catch (error) {
    console.error('Error in getCurrentSession:', error);
    return null;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
};
