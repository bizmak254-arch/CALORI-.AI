import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Bot, Loader2, MessageSquare, Info, Lightbulb, Diamond, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AIService } from '../services/aiService';
import { UserProfile, Meal } from '../types';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface NutritionistChatProps {
  profile: UserProfile;
  meals: Meal[];
}

const SUGGESTED_PROMPTS = [
  "What should I eat for dinner?",
  "Am I on track for my goal?",
  "Give me a high-protein snack idea.",
  "How can I improve my breakfast?",
];

export default function NutritionistChat({ profile, meals }: NutritionistChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hi **${profile.name}**! I'm your AI Nutritionist. I've analyzed your recent logs and I'm ready to help you reach your **${profile.goal}** goal. What's on your mind?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (profile.subscription !== 'Elite') {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)] bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 relative">
          <div className="absolute inset-0 z-0 opacity-30">
            <img 
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop" 
              alt="Elite AI Nutrition" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
          </div>

          <div className="relative z-10 space-y-8 flex flex-col items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-[32px] bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-900/40 border border-white/20 backdrop-blur-xl">
                <Diamond className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center border-4 border-neutral-900 shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight">Elite AI Coach</h2>
              <p className="text-base font-bold text-neutral-400 max-w-[300px] leading-relaxed">
                Analyze healthy meals with holographic nutrition data floating around.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full max-w-[300px]">
              {[
                '24/7 Personalized Advice',
                'Deep Nutrition Insights',
                'Priority AI Processing',
                'Voice Logging Support'
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/5">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-black text-neutral-300 uppercase tracking-widest">{f}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => (window as any).setActiveTab('profile')}
              className="w-full max-w-[300px] py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-900/40 active:scale-95 transition-all hover:opacity-90 border border-white/10"
            >
              Go Elite Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text?: string) => {
    const messageToSend = text || input.trim();
    if (!messageToSend || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    setIsLoading(true);

    try {
      const response = await AIService.chatWithNutritionist(
        messageToSend,
        messages.slice(-6),
        profile,
        meals.slice(-10)
      );

      if (response) {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden">
      {/* Header */}
      <div className="bg-black p-4 text-white flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-blue-500/20 shadow-lg">
              <img 
                src="https://picsum.photos/seed/nutritionist/100/100" 
                alt="AI Nutritionist" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-neutral-900 shadow-sm" />
          </div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-wider">AI Nutritionist</h2>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">Always Online</span>
            </div>
          </div>
        </div>
        <button className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors">
          <Info className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "flex gap-3 max-w-[90%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "h-8 w-8 rounded-xl overflow-hidden shrink-0 shadow-lg",
              msg.role === 'user' ? "bg-blue-600 text-white flex items-center justify-center" : "border border-blue-500/20"
            )}>
              {msg.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <img 
                  src="https://picsum.photos/seed/nutritionist/100/100" 
                  alt="AI" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <div className={cn(
              "rounded-2xl p-4 text-sm leading-relaxed shadow-xl prose prose-invert prose-p:my-0 prose-headings:my-1 prose-ul:my-1",
              msg.role === 'user' 
                ? "bg-blue-600 text-white rounded-tr-none shadow-blue-900/20" 
                : "bg-neutral-800/80 backdrop-blur-sm text-neutral-200 rounded-tl-none border border-neutral-700/50"
            )}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 mr-auto max-w-[90%]"
          >
            <div className="h-8 w-8 rounded-xl bg-neutral-800 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-blue-500" />
            </div>
            <div className="bg-neutral-800/50 rounded-2xl p-4 rounded-tl-none border border-neutral-700/50 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Analyzing your data...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested Prompts */}
      <AnimatePresence>
        {messages.length < 4 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-black/50 backdrop-blur-sm border-t border-neutral-800/50"
          >
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap rounded-full bg-neutral-900 border border-neutral-800 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 flex items-center gap-2"
              >
                <Lightbulb className="h-3 w-3" />
                {prompt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="p-4 border-t border-neutral-800 bg-black">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask anything about your nutrition..."
            className="flex-1 rounded-2xl border border-neutral-800 bg-neutral-900 p-4 pr-14 text-sm focus:border-blue-500 focus:outline-none shadow-inner text-white placeholder:text-neutral-600 transition-all"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 disabled:opacity-50 transition-all active:scale-95 hover:bg-blue-500"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
