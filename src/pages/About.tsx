
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CodeIcon, Globe, Monitor, Server } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              {t({
                ru: 'Обо мне',
                en: 'About Me',
                uz: 'Men haqimda',
              })}
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <p className="text-white/80 text-lg mb-6">
                  {t({
                    ru: 'Я опытный веб-разработчик, специализирующийся на создании высококачественных веб-сайтов и приложений. С более чем пятилетним опытом, я разрабатываю интуитивно понятные, отзывчивые и функциональные веб-решения, которые помогают бизнесу достигать своих целей.',
                    en: 'I am an experienced web developer specializing in creating high-quality websites and applications. With over five years of experience, I build intuitive, responsive, and functional web solutions that help businesses achieve their goals.',
                    uz: 'Men yuqori sifatli veb-saytlar va ilovalarni yaratishga ixtisoslashgan tajribali veb-dasturchi. Besh yildan ortiq tajribam bilan, men biznesga o\'z maqsadlariga erishishga yordam beradigan intuitiv, sezgir va funktsional veb-yechimlarni yaratayman.',
                  })}
                </p>
                
                <p className="text-white/80 text-lg mb-8">
                  {t({
                    ru: 'Я увлечен созданием современных веб-приложений, уделяя особое внимание деталям, производительности и доступности. Мой подход ориентирован на пользователя, я создаю интерфейсы, которые не только прекрасно выглядят, но и обеспечивают отличный пользовательский опыт.',
                    en: 'I am passionate about building modern web applications with a focus on details, performance, and accessibility. My approach is user-centered, creating interfaces that not only look great but also provide an excellent user experience.',
                    uz: 'Men tafsilotlar, samaradorlik va mavjudlikka e\'tibor qaragan holda zamonaviy veb-ilovalarni yaratishga ishtiyoqim baland. Mening yondashuvim foydalanuvchiga yo\'naltirilgan bo\'lib, nafaqat ajoyib ko\'rinadigan, balki ajoyib foydalanuvchi tajribasini ham ta\'minlaydigan interfeyslarni yarataman.',
                  })}
                </p>
                
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  {t({
                    ru: 'Навыки',
                    en: 'Skills',
                    uz: 'Ko\'nikmalar',
                  })}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="glass-morphism p-5 rounded-lg">
                    <div className="flex items-center mb-3">
                      <CodeIcon className="text-primary mr-3" size={24} />
                      <h3 className="text-lg font-medium text-white">
                        {t({
                          ru: 'Фронтенд',
                          en: 'Frontend',
                          uz: 'Frontend',
                        })}
                      </h3>
                    </div>
                    <ul className="space-y-1 text-white/70">
                      <li>HTML5, CSS3, JavaScript (ES6+)</li>
                      <li>React, Vue, Angular</li>
                      <li>Tailwind CSS, Bootstrap</li>
                      <li>TypeScript, Redux</li>
                    </ul>
                  </div>
                  
                  <div className="glass-morphism p-5 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Server className="text-primary mr-3" size={24} />
                      <h3 className="text-lg font-medium text-white">
                        {t({
                          ru: 'Бэкенд',
                          en: 'Backend',
                          uz: 'Backend',
                        })}
                      </h3>
                    </div>
                    <ul className="space-y-1 text-white/70">
                      <li>Node.js, Express</li>
                      <li>MongoDB, PostgreSQL</li>
                      <li>Firebase, Supabase</li>
                      <li>REST API, GraphQL</li>
                    </ul>
                  </div>
                  
                  <div className="glass-morphism p-5 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Monitor className="text-primary mr-3" size={24} />
                      <h3 className="text-lg font-medium text-white">
                        {t({
                          ru: 'Инструменты',
                          en: 'Tools',
                          uz: 'Vositalar',
                        })}
                      </h3>
                    </div>
                    <ul className="space-y-1 text-white/70">
                      <li>Git, GitHub</li>
                      <li>VS Code, WebStorm</li>
                      <li>Figma, Adobe XD</li>
                      <li>Webpack, Vite</li>
                    </ul>
                  </div>
                  
                  <div className="glass-morphism p-5 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Globe className="text-primary mr-3" size={24} />
                      <h3 className="text-lg font-medium text-white">
                        {t({
                          ru: 'Прочее',
                          en: 'Other',
                          uz: 'Boshqa',
                        })}
                      </h3>
                    </div>
                    <ul className="space-y-1 text-white/70">
                      <li>Responsive Design</li>
                      <li>SEO Optimization</li>
                      <li>Performance Optimization</li>
                      <li>Web Accessibility</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="glass-morphism p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    {t({
                      ru: 'Образование',
                      en: 'Education',
                      uz: 'Ta\'lim',
                    })}
                  </h2>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white">
                      {t({
                        ru: 'Степень бакалавра в области Компьютерных наук',
                        en: 'Bachelor\'s Degree in Computer Science',
                        uz: 'Kompyuter fanlari bo\'yicha bakalavr darajasi',
                      })}
                    </h3>
                    <p className="text-white/70 text-sm">2015 - 2019</p>
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    {t({
                      ru: 'Сертификаты',
                      en: 'Certifications',
                      uz: 'Sertifikatlar',
                    })}
                  </h2>
                  
                  <ul className="space-y-3 text-white/70">
                    <li>
                      <p className="font-medium text-white">
                        {t({
                          ru: 'Современный React с Redux',
                          en: 'Modern React with Redux',
                          uz: 'Redux bilan zamonaviy React',
                        })}
                      </p>
                      <p className="text-sm">Udemy, 2021</p>
                    </li>
                    <li>
                      <p className="font-medium text-white">
                        {t({
                          ru: 'Полный курс веб-разработки',
                          en: 'The Complete Web Developer Course',
                          uz: 'To\'liq veb-dasturchi kursi',
                        })}
                      </p>
                      <p className="text-sm">Coursera, 2020</p>
                    </li>
                    <li>
                      <p className="font-medium text-white">
                        {t({
                          ru: 'Профессиональный JavaScript',
                          en: 'Professional JavaScript',
                          uz: 'Professional JavaScript',
                        })}
                      </p>
                      <p className="text-sm">Frontend Masters, 2022</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
