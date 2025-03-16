
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { signIn, signUp } from '@/services/AuthService';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Squares } from '@/components/ui/squares-background';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

// Define form values type directly without zod
type FormValues = {
  email: string;
  password: string;
};

const Auth = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    // Use the built-in register options for validation
    mode: 'onBlur',
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let user;
      
      if (isSignUp) {
        user = await signUp(values.email, values.password);
        if (user) {
          toast.success(t({
            ru: 'Регистрация успешна',
            en: 'Signup successful',
            uz: 'Ro\'yxatdan o\'tish muvaffaqiyatli',
          }), {
            description: t({
              ru: 'Пожалуйста, проверьте свою почту для подтверждения',
              en: 'Please check your email for verification',
              uz: 'Iltimos, tasdiqlash uchun emailingizni tekshiring',
            })
          });
        }
      } else {
        user = await signIn(values.email, values.password);
        if (user) {
          toast.success(t({
            ru: 'Вход выполнен',
            en: 'Login successful',
            uz: 'Kirish muvaffaqiyatli',
          }));
          navigate('/admin');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.3}
          squareSize={40}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass-morphism p-8 rounded-xl"
        >
          <h1 className="text-3xl font-bold mb-6 text-gradient text-center">
            {isSignUp ? 
              t({
                ru: 'Регистрация',
                en: 'Sign Up',
                uz: 'Ro\'yxatdan o\'tish',
              }) : 
              t({
                ru: 'Вход',
                en: 'Sign In',
                uz: 'Kirish',
              })
            }
          </h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email is invalid"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t({
                        ru: 'Электронная почта',
                        en: 'Email',
                        uz: 'Email',
                      })}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@example.com" 
                        className="bg-white/5 border-white/10 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t({
                        ru: 'Пароль',
                        en: 'Password',
                        uz: 'Parol',
                      })}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        className="bg-white/5 border-white/10 text-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                
                {isSignUp ? 
                  t({
                    ru: 'Зарегистрироваться',
                    en: 'Sign Up',
                    uz: 'Ro\'yxatdan o\'tish',
                  }) : 
                  t({
                    ru: 'Войти',
                    en: 'Sign In',
                    uz: 'Kirish',
                  })
                }
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/70 hover:text-white text-sm underline"
            >
              {isSignUp ? 
                t({
                  ru: 'Уже есть аккаунт? Войти',
                  en: 'Already have an account? Sign In',
                  uz: 'Hisobingiz bormi? Kirish',
                }) : 
                t({
                  ru: 'Нет аккаунта? Зарегистрироваться',
                  en: 'No account? Sign Up',
                  uz: 'Hisobingiz yo\'qmi? Ro\'yxatdan o\'ting',
                })
              }
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
