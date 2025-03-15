
import { useLanguage } from '@/contexts/LanguageContext';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-12 px-4 md:px-6 glass-morphism mt-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-medium mb-4 text-gradient">Portfolio</h3>
            <p className="text-white/70 mb-6 max-w-md">
              {t({
                ru: 'Полнофункциональный разработчик, создающий потрясающие цифровые решения с акцентом на детали и удобство использования.',
                en: 'A full-stack developer crafting stunning digital solutions with a focus on details and usability.',
                uz: 'Tafsilotlar va foydalanish qulayligiga e\'tibor qaratgan holda ajoyib raqamli yechimlarni yaratuvchi to\'liq-stack dasturchi.',
              })}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Github size={18} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">
              {t({
                ru: 'Быстрые ссылки',
                en: 'Quick Links',
                uz: 'Tezkor havolalar',
              })}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-white/70 hover:text-white transition-colors">
                  {t({
                    ru: 'Главная',
                    en: 'Home',
                    uz: 'Bosh sahifa',
                  })}
                </a>
              </li>
              <li>
                <a href="/projects" className="text-white/70 hover:text-white transition-colors">
                  {t({
                    ru: 'Проекты',
                    en: 'Projects',
                    uz: 'Loyihalar',
                  })}
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/70 hover:text-white transition-colors">
                  {t({
                    ru: 'Обо мне',
                    en: 'About Me',
                    uz: 'Men haqimda',
                  })}
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white/70 hover:text-white transition-colors">
                  {t({
                    ru: 'Контакты',
                    en: 'Contact',
                    uz: 'Aloqa',
                  })}
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">
              {t({
                ru: 'Связаться',
                en: 'Contact',
                uz: 'Bog\'lanish',
              })}
            </h3>
            <address className="not-italic text-white/70">
              <p className="mb-2">email@example.com</p>
              <p>+1 (234) 567-8901</p>
            </address>
          </div>
        </div>
        
        <div className="mt-10 pt-10 border-t border-white/10 text-center text-white/50 text-sm">
          <p>
            &copy; {new Date().getFullYear()} {t({
              ru: 'Все права защищены',
              en: 'All rights reserved',
              uz: 'Barcha huquqlar himoyalangan',
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
