
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getProjects } from '@/services/ProjectService';
import { Project } from '@/types/Project';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Index = () => {
  const { t } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const allProjects = await getProjects();
        // Filter featured projects
        const featured = allProjects.filter(project => project.featured);
        setFeaturedProjects(featured.slice(0, 3)); // Show up to 3 featured projects
      } catch (error) {
        console.error('Error fetching featured projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pb-20">
        <Hero />
        
        <section className="py-16 px-4 bg-pattern">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                {t({
                  ru: 'Избранные проекты',
                  en: 'Featured Projects',
                  uz: 'Tanlangan loyihalar',
                })}
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                {t({
                  ru: 'Ознакомьтесь с нашими лучшими работами и инновационными решениями',
                  en: 'Explore our best work and innovative solutions',
                  uz: 'Bizning eng yaxshi ishlarimiz va innovatsion yechimlarimiz bilan tanishing',
                })}
              </p>
            </motion.div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {featuredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-white/50 text-lg">
                      {t({
                        ru: 'Избранных проектов пока нет',
                        en: 'No featured projects yet',
                        uz: 'Hali tanlangan loyihalar yo\'q',
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
                    {featuredProjects.map((project, index) => (
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
                
                <div className="text-center mt-12">
                  <Button asChild size="lg">
                    <Link to="/projects">
                      {t({
                        ru: 'Смотреть все проекты',
                        en: 'View All Projects',
                        uz: 'Barcha loyihalarni ko\'rish',
                      })}
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
        
        {/* Other sections can be added here */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
