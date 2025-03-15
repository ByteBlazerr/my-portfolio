
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageSquare, X, Send, Loader2, AlertCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showChatButton, setShowChatButton] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageRef = useRef(false);
  
  // API key
  const API_KEY = "AIzaSyBQohIy_Zf8eV9GMmk7oU-vpmZKblytm8Q";
  
  // Show chat button after 5 seconds, and show popup only once
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatButton(true);
      
      // Only show popup if it hasn't been shown before
      if (!popupShown && !isOpen) {
        setShowPopup(true);
        setPopupShown(true);
        
        // Hide popup after 10 seconds
        const popupTimer = setTimeout(() => {
          setShowPopup(false);
        }, 10000);
        
        return () => clearTimeout(popupTimer);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [popupShown, isOpen]);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Initial welcome message based on language
  useEffect(() => {
    if (!initialMessageRef.current && isOpen) {
      let welcomeMessage = "Hello! I'm your web development consultant. How can I help you with your website project today?";
      
      if (language === 'ru') {
        welcomeMessage = "Здравствуйте! Я ваш консультант по веб-разработке. Чем я могу помочь вам сегодня с вашим веб-проектом?";
      } else if (language === 'uz') {
        welcomeMessage = "Salom! Men sizning veb-ishlab chiqish bo'yicha maslahatchimanman. Bugun veb-saytingiz loyihasi bilan qanday yordam bera olaman?";
      }
      
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
      initialMessageRef.current = true;
    }
  }, [language, isOpen]);

  // Reset initial message when language changes
  useEffect(() => {
    initialMessageRef.current = false;
    if (isOpen) {
      let welcomeMessage = "Hello! I'm your web development consultant. How can I help you with your website project today?";
      
      if (language === 'ru') {
        welcomeMessage = "Здравствуйте! Я ваш консультант по веб-разработке. Чем я могу помочь вам сегодня с вашим веб-проектом?";
      } else if (language === 'uz') {
        welcomeMessage = "Salom! Men sizning veb-ishlab chiqish bo'yicha maslahatchimanman. Bugun veb-saytingiz loyihasi bilan qanday yordam bera olaman?";
      }
      
      setMessages([{ role: 'assistant', content: welcomeMessage }]);
    }
  }, [language]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setErrorDetails(null);
    
    try {
      // Context information about the company to help the AI stay on topic
      const companyContext = `
        I am a web developer specializing in creating responsive, high-performance websites and web applications.
        My services include frontend development, backend development, UI/UX design, and website optimization.
        I work with technologies like React, Vue, Angular, Node.js, and other modern web technologies.
      `;
      
      // Prepare system prompt to guide the AI's responses
      let systemPrompt = "You are a helpful assistant for a web developer. Answer questions related to web development, programming, and the developer's services. Keep responses concise, professional, and focused on web development topics. If asked about topics unrelated to web development or the services, politely redirect the conversation back to how you can help with web development topics.";
      
      if (language === 'ru') {
        systemPrompt = "Вы - полезный ассистент веб-разработчика. Отвечайте на вопросы, связанные с веб-разработкой, программированием и услугами разработчика. Сохраняйте ответы краткими, профессиональными и сосредоточенными на темах веб-разработки. Если вас спрашивают о темах, не связанных с веб-разработкой или услугами, вежливо верните разговор к тому, как вы можете помочь с темами веб-разработки.";
      } else if (language === 'uz') {
        systemPrompt = "Siz veb-dasturchining foydali yordamchisisiz. Veb-ishlab chiqarish, dasturlash va dasturchi xizmatlari bilan bog'liq savollarga javob bering. Veb-ishlab chiqarish mavzulariga oid qisqa, professional va aniq javoblarni saqlang. Agar sizdan veb-ishlab chiqarish yoki xizmatlar bilan bog'liq bo'lmagan mavzular haqida so'ralganda, suhbatni veb-ishlab chiqarish mavzularida qanday yordam bera olishingizga qaytaring.";
      }
      
      // Updated API endpoint and request format for Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt + "\n\nDeveloper Information:\n" + companyContext }
              ]
            },
            {
              role: "model",
              parts: [
                { text: "I understand. I'll act as a helpful assistant for the web developer, focusing only on web development and related topics." }
              ]
            },
            {
              role: "user", 
              parts: [
                { text: message }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });
      
      const data = await response.json();
      
      // Log full API response for debugging
      console.log('Gemini API Response:', JSON.stringify(data));
      
      // Extract the assistant's response
      let assistantResponse = "";
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        assistantResponse = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        // Detailed error handling
        const errorMessage = data.error.message || "Unknown error";
        const errorCode = data.error.code || 0;
        setErrorDetails(`Error ${errorCode}: ${errorMessage}`);
        
        // Fallback responses in different languages
        if (language === 'ru') {
          assistantResponse = "Извините, возникла проблема с обработкой вашего запроса. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.";
        } else if (language === 'uz') {
          assistantResponse = "Kechirasiz, so'rovingizni qayta ishlashda muammo yuzaga keldi. Iltimos, keyinroq qayta urinib ko'ring yoki biz bilan to'g'ridan-to'g'ri bog'laning.";
        } else {
          assistantResponse = "Sorry, there was an issue processing your request. Please try again later or contact us directly.";
        }
        console.error('Error in Gemini API response:', data);
      }
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Set detailed error for debugging
      if (error instanceof Error) {
        setErrorDetails(`Error: ${error.message}`);
      } else {
        setErrorDetails('An unknown error occurred');
      }
      
      // Error messages in different languages
      let errorMessage = "Sorry, there was an error processing your request. Please try again later.";
      if (language === 'ru') {
        errorMessage = "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, повторите попытку позже.";
      } else if (language === 'uz') {
        errorMessage = "Kechirasiz, so'rovingizni qayta ishlashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowPopup(false);
  };

  return (
    <>
      {/* Chat button with popup */}
      {showChatButton && (
        <div className="fixed right-6 bottom-24 z-50 flex flex-col items-end">
          {showPopup && !isOpen && (
            <div className="mb-3 p-3 bg-black/80 backdrop-blur-lg border border-white/10 rounded-lg shadow-lg max-w-[200px] text-sm animate-fade-in">
              <p className="text-white font-medium">
                {language === 'ru' ? 'Привет! Чем я могу помочь?' : 
                 language === 'uz' ? 'Salom! Qanday yordam bera olaman?' : 
                 'Hello! How can I help you?'}
              </p>
              <div className="absolute right-4 bottom-[-6px] w-3 h-3 bg-black/80 border-r border-b border-white/10 rotate-45"></div>
            </div>
          )}
          <button
            onClick={toggleChat}
            className="p-4 rounded-full bg-primary text-background shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Chat with us"
          >
            <MessageSquare size={24} />
          </button>
        </div>
      )}

      {/* Chat window - improved UI */}
      {isOpen && (
        <div className="fixed right-6 bottom-24 z-50 w-80 sm:w-96 glass-morphism rounded-xl shadow-2xl overflow-hidden h-[450px]">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-xl border-b border-white/10 text-white">
            <div className="flex items-center">
              <MessageSquare size={20} className="mr-2" />
              <h3 className="font-semibold">
                {language === 'ru' ? 'Консультант' : language === 'uz' ? 'Maslahatchi' : 'Consultant'}
              </h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Chat body - fixed height and properly styled messages */}
          <div className="h-[350px] overflow-y-auto p-4 bg-black/50 backdrop-blur-md">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-4 py-2 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-background' 
                    : 'bg-white/10 backdrop-blur-md text-white border border-white/10'
                } max-w-[85%] text-sm md:text-base overflow-hidden break-words`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/10">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              </div>
            )}
            {errorDetails && (
              <div className="mb-3 p-2 bg-red-900/20 border border-red-800/50 rounded-lg text-xs text-red-300 flex items-start">
                <AlertCircle size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Debug Error:</p>
                  <p className="break-all">{errorDetails}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input - improved alignment and styling */}
          <div className="p-3 border-t border-white/10 bg-black/30 backdrop-blur-lg">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'ru' ? 'Введите сообщение...' : language === 'uz' ? 'Xabar kiriting...' : 'Type a message...'}
                className="w-full py-2 px-3 rounded-full border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                aria-label="Chat message"
              />
              <button
                type="submit"
                className="p-2 bg-primary text-background rounded-full hover:opacity-90 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center"
                disabled={!message.trim() || isLoading}
                aria-label="Send message"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
