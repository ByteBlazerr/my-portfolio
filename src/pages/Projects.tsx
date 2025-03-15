
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProjects } from '@/services/ProjectService';
import { Project } from '@/types/Project';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ProjectCard } from '@/components/ProjectCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Squares } from '@/components/ui/squares-background';

const Projects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      if (activeTab === 'all') {
        setFilteredProjects(projects);
      } else {
        setFilteredProjects(projects.filter(project => project.featured));
      }
      return;
    }

    const query = searchQuery.toLowerCase();
    let filtered = projects.filter(project => {
      // Search in title and description (all languages)
      const titleMatch = Object.values(project.title).some(title => 
        title.toLowerCase().includes(query)
      );
      
      const descriptionMatch = Object.values(project.description).some(desc => 
        desc.toLowerCase().includes(query)
      );
      
      const techMatch = project.technologies.some(tech => 
        tech.toLowerCase().includes(query)
      );
      
      return titleMatch || descriptionMatch || techMatch;
    });

    if (activeTab === 'featured') {
      filtered = filtered.filter(project => project.featured);
    }

    setFilteredProjects(filtered);
  }, [searchQuery, projects, activeTab]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (!searchQuery.trim()) {
      if (value === 'all') {
        setFilteredProjects(projects);
      } else {
        setFilteredProjects(projects.filter(project => project.featured));
      }
    } else {
      // Reapply search filter with new tab selection
      const query = searchQuery.toLowerCase();
      let filtered = projects.filter(project => {
        const titleMatch = Object.values(project.title).some(title => 
          title.toLowerCase().includes(query)
        );
        
        const descriptionMatch = Object.values(project.description).some(desc => 
          desc.toLowerCase().includes(query)
        );
        
        const techMatch = project.technologies.some(tech => 
          tech.toLowerCase().includes(query)
        );
        
        return titleMatch || descriptionMatch || techMatch;
      });

      if (value === 'featured') {
        filtered = filtered.filter(project => project.featured);
      }

      setFilteredProjects(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl py-16 px-4 mb-16 glass-morphism">
            <div className="absolute inset-0 z-0 opacity-30">
              <Squares
                direction="diagonal"
                speed={0.3}
                squareSize={40}
                borderColor="#444"
                hoverFillColor="#222"
              />
            </div>
            
            <div className="relative z-10 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-bold mb-4 text-gradient"
              >
                {t({
                  ru: 'Наши проекты',
                  en: 'Our Projects',
                  uz: 'Bizning loyihalarimiz',
                })}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-white/70 max-w-2xl mx-auto"
              >
                {t({
                  ru: 'Исследуйте наши последние работы и разработки в области веб-разработки и дизайна',
                  en: 'Explore our latest work and developments in web development and design',
                  uz: 'Veb-dasturlash va dizayn sohasidagi so\'nggi ishlarimiz va ishlanmalarimizni o\'rganing',
                })}
              </motion.p>
            </div>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <Tabs
              defaultValue="all" 
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full md:w-auto"
            >
              <TabsList className="w-full md:w-auto bg-white/5 border border-white/10">
                <TabsTrigger value="all" className="flex-1 md:flex-initial">
                  {t({
                    ru: 'Все проекты',
                    en: 'All Projects',
                    uz: 'Barcha loyihalar',
                  })}
                </TabsTrigger>
                <TabsTrigger value="featured" className="flex-1 md:flex-initial">
                  {t({
                    ru: 'Избранные',
                    en: 'Featured',
                    uz: 'Tanlangan',
                  })}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder={t({
                  ru: 'Поиск проектов...',
                  en: 'Search projects...',
                  uz: 'Loyihalarni qidirish...',
                })}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-32">
                  <p className="text-white/50 text-xl">
                    {t({
                      ru: 'Проекты не найдены',
                      en: 'No projects found',
                      uz: 'Loyihalar topilmadi',
                    })}
                  </p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
