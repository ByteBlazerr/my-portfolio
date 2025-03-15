
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Send, Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
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
                ru: 'Контакты',
                en: 'Contact',
                uz: 'Aloqa',
              })}
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3">
                <p className="text-white/80 text-lg mb-8">
                  {t({
                    ru: 'Если у вас есть вопросы о моих услугах или вы хотите обсудить потенциальный проект, не стесняйтесь связаться со мной. Я всегда рад помочь и ответить на ваши вопросы.',
                    en: 'If you have any questions about my services or want to discuss a potential project, feel free to get in touch. I\'m always happy to help and answer your questions.',
                    uz: 'Agar mening xizmatlarim haqida savollaringiz bo\'lsa yoki potentsial loyihani muhokama qilmoqchi bo\'lsangiz, men bilan bog\'lanishdan tortinmang. Men har doim yordam berishga va savollaringizga javob berishga tayyorman.',
                  })}
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <Mail className="text-primary mt-1 mr-4" size={20} />
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">Email</h3>
                      <p className="text-white/70">developer@example.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="text-primary mt-1 mr-4" size={20} />
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        {t({
                          ru: 'Расположение',
                          en: 'Location',
                          uz: 'Joylashuv',
                        })}
                      </h3>
                      <p className="text-white/70">Tashkent, Uzbekistan</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-primary mt-1 mr-4" size={20} />
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        {t({
                          ru: 'Телефон',
                          en: 'Phone',
                          uz: 'Telefon',
                        })}
                      </h3>
                      <p className="text-white/70">+998 90 123 45 67</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="https://t.me/yourusername" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-[#0088cc] hover:bg-[#0088cc]/90 text-white">
                      <Send className="mr-2 h-4 w-4" />
                      {t({
                        ru: 'Написать в Telegram',
                        en: 'Message on Telegram',
                        uz: 'Telegramda xabar yuborish',
                      })}
                    </Button>
                  </a>
                  
                  <a 
                    href="mailto:developer@example.com"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Mail className="mr-2 h-4 w-4" />
                      {t({
                        ru: 'Отправить Email',
                        en: 'Send Email',
                        uz: 'Email yuborish',
                      })}
                    </Button>
                  </a>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="glass-morphism p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    {t({
                      ru: 'Рабочее время',
                      en: 'Working Hours',
                      uz: 'Ish vaqti',
                    })}
                  </h2>
                  
                  <ul className="space-y-3 text-white/70">
                    <li className="flex justify-between">
                      <span>
                        {t({
                          ru: 'Понедельник - Пятница',
                          en: 'Monday - Friday',
                          uz: 'Dushanba - Juma',
                        })}
                      </span>
                      <span>9:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>
                        {t({
                          ru: 'Суббота',
                          en: 'Saturday',
                          uz: 'Shanba',
                        })}
                      </span>
                      <span>10:00 - 16:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>
                        {t({
                          ru: 'Воскресенье',
                          en: 'Sunday',
                          uz: 'Yakshanba',
                        })}
                      </span>
                      <span>
                        {t({
                          ru: 'Закрыто',
                          en: 'Closed',
                          uz: 'Yopiq',
                        })}
                      </span>
                    </li>
                  </ul>
                  
                  <div className="h-px bg-white/10 my-6"></div>
                  
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    {t({
                      ru: 'Давайте работать вместе',
                      en: 'Let\'s Work Together',
                      uz: 'Keling, birgalikda ishlaymiz',
                    })}
                  </h2>
                  
                  <p className="text-white/70 mb-4">
                    {t({
                      ru: 'У вас есть интересный проект? Давайте воплотим вашу идею в жизнь!',
                      en: 'Do you have an interesting project? Let\'s bring your idea to life!',
                      uz: 'Sizda qiziqarli loyiha bormi? Keling, g\'oyangizni hayotga tatbiq etamiz!',
                    })}
                  </p>
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
