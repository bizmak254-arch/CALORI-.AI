import React from 'react';
import { motion } from 'motion/react';
import { Home, Utensils, Target, CheckSquare, User, MessageSquare, Brain, Trophy, Dumbbell, Bell, Settings, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export default function Layout({ children, activeTab, setActiveTab, theme, onThemeToggle }: LayoutProps) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'coach', icon: MessageSquare, label: 'Coach' },
    { id: 'meals', icon: Utensils, label: 'Meals' },
    { id: 'training', icon: Dumbbell, label: 'Train' },
    { id: 'reminders', icon: Bell, label: 'Alerts' },
    { id: 'rewards', icon: Trophy, label: 'Wins' },
    { id: 'settings', icon: Settings, label: 'Setup' },
    { id: 'profile', icon: User, label: 'Me' },
  ];

  return (
    <div className={cn(
      "min-h-screen pb-24 font-sans transition-colors duration-500 relative",
      theme === 'dark' ? "bg-black text-white" : "bg-neutral-50 text-neutral-900"
    )}>
      {/* Platform Background */}
      <div className={cn(
        "fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000",
        theme === 'dark' ? "opacity-20" : "opacity-10"
      )}>
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop" 
          alt="Platform Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b",
          theme === 'dark' ? "from-black via-black/80 to-black" : "from-white via-white/80 to-white"
        )} />
      </div>

      <header className={cn(
        "sticky top-0 z-30 border-b px-4 py-4 backdrop-blur-md transition-colors",
        theme === 'dark' ? "border-neutral-800 bg-black/80" : "border-neutral-200 bg-white/80"
      )}>
        <div className="mx-auto max-w-md flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight text-blue-600">CALORI AI</h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={onThemeToggle}
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all border-2",
                theme === 'dark' ? "bg-neutral-900 border-neutral-800 text-yellow-500" : "bg-neutral-100 border-neutral-200 text-blue-600"
              )}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center border-2",
              theme === 'dark' ? "bg-blue-600/10 border-blue-600/20 text-blue-500" : "bg-blue-600 text-white border-blue-400"
            )}>
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 pt-6 relative z-10">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-20 border-t px-4 pb-8 pt-2 shadow-2xl backdrop-blur-lg transition-colors",
        theme === 'dark' ? "border-neutral-800 bg-black/90" : "border-neutral-200 bg-white/90"
      )}>
        <div className="mx-auto flex max-w-md items-center justify-around overflow-x-auto scrollbar-hide gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all active:scale-90 shrink-0 px-2",
                activeTab === tab.id ? "text-blue-600" : "text-neutral-500"
              )}
            >
              <tab.icon className={cn("h-6 w-6 transition-transform", activeTab === tab.id && "scale-110")} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest",
                activeTab === tab.id ? "opacity-100" : "opacity-60"
              )}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="h-1 w-1 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
