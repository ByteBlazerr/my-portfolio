
import { useState } from 'react';
import { captureWebsiteScreenshot } from '@/services/ProjectService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface ScreenshotToolProps {
  onScreenshotCaptured: (imageUrl: string) => void;
}

export default function ScreenshotTool({ onScreenshotCaptured }: ScreenshotToolProps) {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCapture = async () => {
    if (!url) {
      toast.error(t({
        ru: 'Ошибка',
        en: 'Error',
        uz: 'Xato',
      }), {
        description: t({
          ru: 'Пожалуйста, введите URL сайта',
          en: 'Please enter a website URL',
          uz: 'Iltimos, veb-sayt URL manzilini kiriting',
        })
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Validate URL format
      let formattedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = `https://${url}`;
      }
      
      const screenshotUrl = await captureWebsiteScreenshot(formattedUrl);
      onScreenshotCaptured(screenshotUrl);
      
      toast.success(t({
        ru: 'Успех',
        en: 'Success',
        uz: 'Muvaffaqiyat',
      }), {
        description: t({
          ru: 'Скриншот сайта успешно сделан',
          en: 'Website screenshot captured successfully',
          uz: 'Veb-sayt skrinshoti muvaffaqiyatli olingan',
        })
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast.error(t({
        ru: 'Ошибка',
        en: 'Error',
        uz: 'Xato',
      }), {
        description: t({
          ru: 'Не удалось сделать скриншот сайта',
          en: 'Failed to capture website screenshot',
          uz: 'Veb-sayt skrinshotini olish muvaffaqiyatsiz tugadi',
        })
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 glass-morphism p-4 rounded-lg">
      <h3 className="text-white text-lg font-medium">
        {t({
          ru: 'Сделать скриншот сайта',
          en: 'Capture Website Screenshot',
          uz: 'Veb-sayt skrinshotini olish',
        })}
      </h3>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t({
            ru: 'Введите URL сайта',
            en: 'Enter website URL',
            uz: 'Veb-sayt URL manzilini kiriting',
          })}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
        />
        
        <Button 
          onClick={handleCapture} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t({
                ru: 'Загрузка...',
                en: 'Loading...',
                uz: 'Yuklanmoqda...',
              })}
            </>
          ) : (
            <>
              <Camera size={16} />
              {t({
                ru: 'Сделать скриншот',
                en: 'Capture',
                uz: 'Olish',
              })}
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-white/60">
        {t({
          ru: 'Введите URL сайта и нажмите кнопку "Сделать скриншот", чтобы получить изображение для проекта.',
          en: 'Enter a website URL and click the "Capture" button to get a screenshot image for your project.',
          uz: 'Veb-sayt URL manzilini kiriting va loyihangiz uchun skrinshot rasmini olish uchun "Olish" tugmasini bosing.',
        })}
      </p>
    </div>
  );
}
