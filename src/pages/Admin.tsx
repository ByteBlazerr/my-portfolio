
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { signOut } from '@/services/AuthService';
import { getProjects, addProject, updateProject, deleteProject } from '@/services/ProjectService';
import { Project } from '@/types/Project';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScreenshotTool from '@/components/ScreenshotTool';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Loader2, Plus, Edit2, Trash2, ExternalLink, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Squares } from '@/components/ui/squares-background';
import { toast } from 'sonner';

// Form schema
const projectSchema = z.object({
  title_ru: z.string().min(1, 'Required'),
  title_en: z.string().min(1, 'Required'),
  title_uz: z.string().min(1, 'Required'),
  description_ru: z.string().min(1, 'Required'),
  description_en: z.string().min(1, 'Required'),
  description_uz: z.string().min(1, 'Required'),
  technologies: z.string().min(1, 'Required'),
  website_url: z.string().url('Must be a valid URL'),
  github_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const Admin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');

  // React Query: Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  // Form for creating/editing projects
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title_ru: '',
      title_en: '',
      title_uz: '',
      description_ru: '',
      description_en: '',
      description_uz: '',
      technologies: '',
      website_url: '',
      github_url: '',
      featured: false,
    },
  });

  // Reset form and screenshot when dialog changes
  useEffect(() => {
    if (!isCreateDialogOpen && !isEditDialogOpen) {
      form.reset();
      setScreenshotUrl('');
    }
  }, [isCreateDialogOpen, isEditDialogOpen, form]);

  // Set form values when editing
  useEffect(() => {
    if (selectedProject && isEditDialogOpen) {
      form.reset({
        title_ru: selectedProject.title.ru,
        title_en: selectedProject.title.en,
        title_uz: selectedProject.title.uz,
        description_ru: selectedProject.description.ru,
        description_en: selectedProject.description.en,
        description_uz: selectedProject.description.uz,
        technologies: selectedProject.technologies.join(', '),
        website_url: selectedProject.website_url,
        github_url: selectedProject.github_url || '',
        featured: selectedProject.featured,
      });
      setScreenshotUrl(selectedProject.image_url);
    }
  }, [selectedProject, isEditDialogOpen, form]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsCreateDialogOpen(false);
      toast.success(t({
        ru: 'Проект успешно создан',
        en: 'Project created successfully',
        uz: 'Loyiha muvaffaqiyatli yaratildi',
      }));
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast.error(t({
        ru: 'Ошибка при создании проекта',
        en: 'Error creating project',
        uz: 'Loyihani yaratishda xatolik yuz berdi',
      }));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsEditDialogOpen(false);
      toast.success(t({
        ru: 'Проект успешно обновлен',
        en: 'Project updated successfully',
        uz: 'Loyiha muvaffaqiyatli yangilandi',
      }));
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast.error(t({
        ru: 'Ошибка при обновлении проекта',
        en: 'Error updating project',
        uz: 'Loyihani yangilashda xatolik yuz berdi',
      }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsDeleteDialogOpen(false);
      toast.success(t({
        ru: 'Проект успешно удален',
        en: 'Project deleted successfully',
        uz: 'Loyiha muvaffaqiyatli o\'chirildi',
      }));
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast.error(t({
        ru: 'Ошибка при удалении проекта',
        en: 'Error deleting project',
        uz: 'Loyihani o\'chirishda xatolik yuz berdi',
      }));
    },
  });

  // Handle form submission
  const onSubmit = async (values: ProjectFormValues) => {
    if (!screenshotUrl) {
      toast.error(t({
        ru: 'Пожалуйста, сделайте скриншот или укажите URL изображения',
        en: 'Please capture a screenshot or provide an image URL',
        uz: 'Iltimos, skrinshot oling yoki rasm URL manzilini kiriting',
      }));
      return;
    }

    const technologies = values.technologies
      .split(',')
      .map((tech) => tech.trim())
      .filter((tech) => tech !== '');

    const projectData = {
      title: {
        ru: values.title_ru,
        en: values.title_en,
        uz: values.title_uz,
      },
      description: {
        ru: values.description_ru,
        en: values.description_en,
        uz: values.description_uz,
      },
      technologies,
      image_url: screenshotUrl,
      website_url: values.website_url,
      github_url: values.github_url || undefined,
      featured: values.featured,
    };

    if (isCreateDialogOpen) {
      createMutation.mutate(projectData);
    } else if (isEditDialogOpen && selectedProject) {
      updateMutation.mutate({
        id: selectedProject.id,
        data: projectData,
      });
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedProject) {
      deleteMutation.mutate(selectedProject.id);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          {/* Header Section */}
          <section className="mb-16 relative overflow-hidden rounded-2xl py-12 px-4 glass-morphism">
            <div className="absolute inset-0 z-0 opacity-30">
              <Squares
                direction="diagonal"
                speed={0.3}
                squareSize={40}
                borderColor="#444"
                hoverFillColor="#222"
              />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl md:text-5xl font-bold mb-4 md:mb-0 text-gradient"
                >
                  {t({
                    ru: 'Панель администратора',
                    en: 'Admin Dashboard',
                    uz: 'Admin boshqaruv paneli',
                  })}
                </motion.h1>
                
                <div className="flex space-x-3">
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10"
                  >
                    {t({
                      ru: 'Выйти',
                      en: 'Logout',
                      uz: 'Chiqish',
                    })}
                  </Button>
                  
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-white text-background hover:bg-white/90"
                  >
                    <Plus size={16} className="mr-2" />
                    {t({
                      ru: 'Новый проект',
                      en: 'New Project',
                      uz: 'Yangi loyiha',
                    })}
                  </Button>
                </div>
              </div>
              
              <p className="text-white/70">
                {t({
                  ru: 'Управляйте своими проектами, добавляйте новые и редактируйте существующие.',
                  en: 'Manage your projects, add new ones, and edit existing projects.',
                  uz: 'Loyihalaringizni boshqaring, yangilarini qo\'shing va mavjudlarini tahrirlang.',
                })}
              </p>
            </div>
          </section>
          
          {/* Projects Table */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="bg-white/5 border border-white/10">
              <TabsTrigger value="all">
                {t({
                  ru: 'Все проекты',
                  en: 'All Projects',
                  uz: 'Barcha loyihalar',
                })}
              </TabsTrigger>
              <TabsTrigger value="featured">
                {t({
                  ru: 'Избранные',
                  en: 'Featured',
                  uz: 'Tanlangan',
                })}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <ProjectsTable 
                projects={projects} 
                isLoading={isLoadingProjects}
                onEdit={(project) => {
                  setSelectedProject(project);
                  setIsEditDialogOpen(true);
                }}
                onDelete={(project) => {
                  setSelectedProject(project);
                  setIsDeleteDialogOpen(true);
                }}
                t={t}
              />
            </TabsContent>
            
            <TabsContent value="featured" className="mt-6">
              <ProjectsTable 
                projects={projects.filter(p => p.featured)} 
                isLoading={isLoadingProjects}
                onEdit={(project) => {
                  setSelectedProject(project);
                  setIsEditDialogOpen(true);
                }}
                onDelete={(project) => {
                  setSelectedProject(project);
                  setIsDeleteDialogOpen(true);
                }}
                t={t}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient">
              {t({
                ru: 'Создать новый проект',
                en: 'Create New Project',
                uz: 'Yangi loyiha yaratish',
              })}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Tabs defaultValue="ru">
                    <TabsList className="bg-white/5 border border-white/10 mb-4">
                      <TabsTrigger value="ru">RU</TabsTrigger>
                      <TabsTrigger value="en">EN</TabsTrigger>
                      <TabsTrigger value="uz">UZ</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ru" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title_ru"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Название (RU)',
                                en: 'Title (RU)',
                                uz: 'Sarlavha (RU)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description_ru"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Описание (RU)',
                                en: 'Description (RU)',
                                uz: 'Tavsif (RU)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={5}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="en" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Название (EN)',
                                en: 'Title (EN)',
                                uz: 'Sarlavha (EN)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Описание (EN)',
                                en: 'Description (EN)',
                                uz: 'Tavsif (EN)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={5}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="uz" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title_uz"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Название (UZ)',
                                en: 'Title (UZ)',
                                uz: 'Sarlavha (UZ)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description_uz"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Описание (UZ)',
                                en: 'Description (UZ)',
                                uz: 'Tavsif (UZ)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={5}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t({
                            ru: 'Технологии (через запятую)',
                            en: 'Technologies (comma separated)',
                            uz: 'Texnologiyalar (vergul bilan ajratilgan)',
                          })}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="React, Next.js, Tailwind CSS"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="website_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t({
                              ru: 'URL веб-сайта',
                              en: 'Website URL',
                              uz: 'Veb-sayt URL',
                            })}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="github_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t({
                              ru: 'URL GitHub (необязательно)',
                              en: 'GitHub URL (optional)',
                              uz: 'GitHub URL (ixtiyoriy)',
                            })}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border border-white/10">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t({
                              ru: 'Избранный проект',
                              en: 'Featured Project',
                              uz: 'Tanlangan loyiha',
                            })}
                          </FormLabel>
                          <p className="text-sm text-white/70">
                            {t({
                              ru: 'Отображать на главной странице',
                              en: 'Display on the home page',
                              uz: 'Bosh sahifada ko\'rsatish',
                            })}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-2">
                    {t({
                      ru: 'Изображение проекта',
                      en: 'Project Image',
                      uz: 'Loyiha tasviri',
                    })}
                  </h3>
                  
                  <ScreenshotTool onScreenshotCaptured={setScreenshotUrl} />
                  
                  {screenshotUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        {t({
                          ru: 'Предпросмотр',
                          en: 'Preview',
                          uz: 'Ko\'rib chiqish',
                        })}
                      </p>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                        <img 
                          src={screenshotUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">
                      {t({
                        ru: 'Или введите URL изображения напрямую',
                        en: 'Or enter image URL directly',
                        uz: 'Yoki rasm URL manzilini to\'g\'ridan-to\'g\'ri kiriting',
                      })}
                    </p>
                    <Input
                      type="url"
                      value={screenshotUrl}
                      onChange={(e) => setScreenshotUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/10"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  {t({
                    ru: 'Отмена',
                    en: 'Cancel',
                    uz: 'Bekor qilish',
                  })}
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {t({
                    ru: 'Создать проект',
                    en: 'Create Project',
                    uz: 'Loyihani yaratish',
                  })}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gradient">
              {t({
                ru: 'Редактировать проект',
                en: 'Edit Project',
                uz: 'Loyihani tahrirlash',
              })}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Tabs defaultValue="ru">
                    <TabsList className="bg-white/5 border border-white/10 mb-4">
                      <TabsTrigger value="ru">RU</TabsTrigger>
                      <TabsTrigger value="en">EN</TabsTrigger>
                      <TabsTrigger value="uz">UZ</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ru" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title_ru"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Название (RU)',
                                en: 'Title (RU)',
                                uz: 'Sarlavha (RU)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description_ru"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Описание (RU)',
                                en: 'Description (RU)',
                                uz: 'Tavsif (RU)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={5}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="en" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Название (EN)',
                                en: 'Title (EN)',
                                uz: 'Sarlavha (EN)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Описание (EN)',
                                en: 'Description (EN)',
                                uz: 'Tavsif (EN)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={5}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="uz" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title_uz"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Название (UZ)',
                                en: 'Title (UZ)',
                                uz: 'Sarlavha (UZ)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description_uz"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t({
                                ru: 'Описание (UZ)',
                                en: 'Description (UZ)',
                                uz: 'Tavsif (UZ)',
                              })}
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={5}
                                className="bg-white/5 border-white/10 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                  
                  <FormField
                    control={form.control}
                    name="technologies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t({
                            ru: 'Технологии (через запятую)',
                            en: 'Technologies (comma separated)',
                            uz: 'Texnologiyalar (vergul bilan ajratilgan)',
                          })}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="React, Next.js, Tailwind CSS"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="website_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t({
                              ru: 'URL веб-сайта',
                              en: 'Website URL',
                              uz: 'Veb-sayt URL',
                            })}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="github_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t({
                              ru: 'URL GitHub (необязательно)',
                              en: 'GitHub URL (optional)',
                              uz: 'GitHub URL (ixtiyoriy)',
                            })}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-white/5 border-white/10 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 rounded-lg border border-white/10">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {t({
                              ru: 'Избранный проект',
                              en: 'Featured Project',
                              uz: 'Tanlangan loyiha',
                            })}
                          </FormLabel>
                          <p className="text-sm text-white/70">
                            {t({
                              ru: 'Отображать на главной странице',
                              en: 'Display on the home page',
                              uz: 'Bosh sahifada ko\'rsatish',
                            })}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-2">
                    {t({
                      ru: 'Изображение проекта',
                      en: 'Project Image',
                      uz: 'Loyiha tasviri',
                    })}
                  </h3>
                  
                  <ScreenshotTool onScreenshotCaptured={setScreenshotUrl} />
                  
                  {screenshotUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        {t({
                          ru: 'Предпросмотр',
                          en: 'Preview',
                          uz: 'Ko\'rib chiqish',
                        })}
                      </p>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                        <img 
                          src={screenshotUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">
                      {t({
                        ru: 'Или введите URL изображения напрямую',
                        en: 'Or enter image URL directly',
                        uz: 'Yoki rasm URL manzilini to\'g\'ridan-to\'g\'ri kiriting',
                      })}
                    </p>
                    <Input
                      type="url"
                      value={screenshotUrl}
                      onChange={(e) => setScreenshotUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/10"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  {t({
                    ru: 'Отмена',
                    en: 'Cancel',
                    uz: 'Bekor qilish',
                  })}
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {t({
                    ru: 'Сохранить изменения',
                    en: 'Save Changes',
                    uz: 'O\'zgarishlarni saqlash',
                  })}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-background border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-500">
              {t({
                ru: 'Удалить проект',
                en: 'Delete Project',
                uz: 'Loyihani o\'chirish',
              })}
            </DialogTitle>
          </DialogHeader>
          
          <p className="py-4 text-white/70">
            {t({
              ru: 'Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.',
              en: 'Are you sure you want to delete this project? This action cannot be undone.',
              uz: 'Haqiqatan ham bu loyihani o\'chirmoqchimisiz? Bu amalni bekor qilib bo\'lmaydi.',
            })}
          </p>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-white/10 text-white hover:bg-white/10"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t({
                ru: 'Отмена',
                en: 'Cancel',
                uz: 'Bekor qilish',
              })}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t({
                ru: 'Удалить',
                en: 'Delete',
                uz: 'O\'chirish',
              })}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

// ProjectsTable component
interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  t: any;
}

const ProjectsTable = ({ projects, isLoading, onEdit, onDelete, t }: ProjectsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border border-white/10 rounded-lg">
        <p className="text-white/70">
          {t({
            ru: 'Нет проектов для отображения',
            en: 'No projects to display',
            uz: 'Ko\'rsatish uchun loyihalar yo\'q',
          })}
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg border border-white/10 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow>
            <TableHead>{t({ ru: 'Название', en: 'Title', uz: 'Sarlavha' })}</TableHead>
            <TableHead>{t({ ru: 'Технологии', en: 'Technologies', uz: 'Texnologiyalar' })}</TableHead>
            <TableHead>{t({ ru: 'Статус', en: 'Status', uz: 'Holat' })}</TableHead>
            <TableHead>{t({ ru: 'Действия', en: 'Actions', uz: 'Amallar' })}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="hover:bg-white/5">
              <TableCell className="font-medium">{project.title.en}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span 
                      key={index}
                      className="inline-block text-xs bg-white/10 text-white/90 rounded-full py-1 px-2"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="inline-block text-xs bg-white/10 text-white/90 rounded-full py-1 px-2">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {project.featured ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-500/20 text-green-500 rounded-full py-1 px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    {t({ ru: 'Избранное', en: 'Featured', uz: 'Tanlangan' })}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-white/10 text-white/70 rounded-full py-1 px-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/70"></span>
                    {t({ ru: 'Обычный', en: 'Normal', uz: 'Oddiy' })}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <a 
                    href={project.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title={t({ ru: 'Посетить сайт', en: 'Visit website', uz: 'Saytga tashrif buyurish' })}
                  >
                    <ExternalLink size={16} className="text-white/70 hover:text-white" />
                  </a>
                  
                  <a 
                    href={`/projects#${project.id}`} 
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title={t({ ru: 'Просмотреть', en: 'View', uz: 'Ko\'rish' })}
                  >
                    <Eye size={16} className="text-white/70 hover:text-white" />
                  </a>
                  
                  <button
                    onClick={() => onEdit(project)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title={t({ ru: 'Редактировать', en: 'Edit', uz: 'Tahrirlash' })}
                  >
                    <Edit2 size={16} className="text-white/70 hover:text-white" />
                  </button>
                  
                  <button
                    onClick={() => onDelete(project)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title={t({ ru: 'Удалить', en: 'Delete', uz: 'O\'chirish' })}
                  >
                    <Trash2 size={16} className="text-white/70 hover:text-red-500" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Admin;
