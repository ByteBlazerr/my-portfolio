
import { useState } from 'react';
import { Project } from '@/types/Project';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ExternalLink, Code, Star } from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-xl overflow-hidden group"
    >
      <div className="relative rounded-xl overflow-hidden border border-white/10">
        <GlowingEffect 
          disabled={false} 
          glow={isHovered} 
          spread={30} 
          borderWidth={2}
          inactiveZone={0.01}
          proximity={64}
        />
        
        <div className="relative z-10 bg-black/30 backdrop-blur-sm">
          {/* Image */}
          <div className="relative h-56 overflow-hidden">
            <img 
              src={project.image_url || '/placeholder.svg'} 
              alt={t(project.title)}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            
            {/* Featured badge */}
            {project.featured && (
              <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md rounded-full py-1 px-3 flex items-center space-x-1">
                <Star size={14} className="text-amber-400" />
                <span className="text-xs font-medium text-white">
                  {t({
                    ru: 'Избранное',
                    en: 'Featured',
                    uz: 'Tanlangan',
                  })}
                </span>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-5">
            <h3 className="text-xl font-semibold text-white mb-2">{t(project.title)}</h3>
            
            <p className="text-white/70 text-sm line-clamp-3 mb-4">{t(project.description)}</p>
            
            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <span 
                  key={index}
                  className="text-xs bg-white/10 text-white/90 rounded-full py-1 px-2"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-xs bg-white/10 text-white/90 rounded-full py-1 px-2">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
            
            {/* Links */}
            <div className="flex space-x-3">
              <a 
                href={project.website_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-1 text-white/70 hover:text-white text-sm transition-colors"
              >
                <ExternalLink size={14} />
                <span>
                  {t({
                    ru: 'Посетить',
                    en: 'Visit',
                    uz: 'Tashrif buyurish',
                  })}
                </span>
              </a>
              
              {project.github_url && (
                <a 
                  href={project.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-white/70 hover:text-white text-sm transition-colors"
                >
                  <Code size={14} />
                  <span>
                    {t({
                      ru: 'Код',
                      en: 'Code',
                      uz: 'Kod',
                    })}
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
