
import { useState } from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    {
      title: {
        ru: 'Главная',
        en: 'Home',
        uz: 'Bosh sahifa',
      },
      href: '/',
    },
    {
      title: {
        ru: 'Проекты',
        en: 'Projects',
        uz: 'Loyihalar',
      },
      href: '/projects',
    },
    {
      title: {
        ru: 'Обо мне',
        en: 'About Me',
        uz: 'Men haqimda',
      },
      href: '/about',
    },
    {
      title: {
        ru: 'Контакты',
        en: 'Contact',
        uz: 'Aloqa',
      },
      href: '/contact',
    },
  ];

  const languages: { label: string; value: Language }[] = [
    { label: 'RU', value: 'ru' },
    { label: 'EN', value: 'en' },
    { label: 'UZ', value: 'uz' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-morphism backdrop-blur-xl bg-black/30"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-white">
            <span className="text-gradient">Portfolio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="text-white/80 hover:text-white text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                {t(item.title)}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-300 ${
                  language === lang.value
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-morphism"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="text-white/80 hover:text-white py-2 text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.title)}
                </Link>
              ))}

              <div className="flex items-center space-x-4 pt-2">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setLanguage(lang.value)}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-300 ${
                      language === lang.value
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
