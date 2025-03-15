
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Squares } from '@/components/ui/squares-background';
import { Link } from 'react-router-dom';

export default function Hero() {
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.6 } },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background grid animation */}
      <div className="absolute inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 z-10"></div>

      <div className="relative z-20 container mx-auto px-4 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto"
        >
          <motion.div
            variants={item}
            className="mb-4 inline-block"
          >
            <div className="text-xs md:text-sm text-white/70 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm bg-white/5">
              {t({
                ru: 'Веб-разработчик',
                en: 'Web Developer',
                uz: 'Veb-dasturchi',
              })}
            </div>
          </motion.div>
          
          <motion.h1
            variants={item}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            <span className="text-gradient">
              {t({
                ru: 'Создаю современные',
                en: 'Building Modern',
                uz: 'Zamonaviy veb',
              })}
            </span>
            <br />
            <span className="text-gradient">
              {t({
                ru: 'веб-сайты',
                en: 'Websites',
                uz: 'saytlarni yaratish',
              })}
            </span>
          </motion.h1>
          
          <motion.p
            variants={item}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            {t({
              ru: 'Я специализируюсь на создании отзывчивых, высокопроизводительных веб-сайтов с акцентом на опыт пользователя и современный дизайн.',
              en: 'I specialize in building responsive, high-performance websites with a focus on user experience and modern design.',
              uz: 'Men foydalanuvchi tajribasi va zamonaviy dizaynga e\'tibor qaratgan holda javob beruvchi, yuqori samarali veb-saytlarni yaratishga ixtisoslashganman.',
            })}
          </motion.p>
          
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="bg-white text-background hover:bg-white/90 text-base"
              asChild
            >
              <Link to="/projects">
                {t({
                  ru: 'Мои проекты',
                  en: 'My Projects',
                  uz: 'Mening loyihalarim',
                })}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white/20 hover:bg-white/10 text-base"
              asChild
            >
              <Link to="/contact">
                {t({
                  ru: 'Связаться со мной',
                  en: 'Contact Me',
                  uz: 'Men bilan bog\'lanish',
                })}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
