import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, Mail, ArrowRight, Sparkles, ShieldCheck, Github, Chrome } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthProps {
  onAuthComplete: (user: any) => void;
  theme: 'light' | 'dark';
}

export default function Auth({ onAuthComplete, theme }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate local auth
    setTimeout(() => {
      if (isLogin) {
        const savedUser = localStorage.getItem(`user_${email}`);
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.password === password) {
            onAuthComplete(user);
          } else {
            setError('Invalid password');
          }
        } else {
          setError('User not found');
        }
      } else {
        if (!name || !email || !password) {
          setError('All fields are required');
        } else {
          const newUser = { name, email, password, id: Math.random().toString(36).substr(2, 9) };
          localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
          onAuthComplete(newUser);
        }
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500",
      theme === 'dark' ? "bg-black text-white" : "bg-neutral-50 text-neutral-900"
    )}>
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop" 
          alt="Auth Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b",
          theme === 'dark' ? "from-black via-black/80 to-black" : "from-white via-white/80 to-white"
        )} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-blue-600 shadow-2xl shadow-blue-900/40 mb-4">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight font-display">
            {isLogin ? 'Welcome Back' : 'Join Calori AI'}
          </h1>
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
            {isLogin ? 'Enter your credentials to continue' : 'Start your transformation journey'}
          </p>
        </div>

        <div className={cn(
          "p-8 rounded-[40px] border-2 shadow-2xl backdrop-blur-xl",
          theme === 'dark' ? "bg-neutral-900/50 border-neutral-800" : "bg-white/50 border-neutral-200"
        )}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={cn(
                        "w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold transition-all border-2 outline-none",
                        theme === 'dark' ? "bg-black border-neutral-800 focus:border-blue-600 text-white" : "bg-white border-neutral-200 focus:border-blue-600 text-neutral-900"
                      )}
                      placeholder="John Doe"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold transition-all border-2 outline-none",
                    theme === 'dark' ? "bg-black border-neutral-800 focus:border-blue-600 text-white" : "bg-white border-neutral-200 focus:border-blue-600 text-neutral-900"
                  )}
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-bold transition-all border-2 outline-none",
                    theme === 'dark' ? "bg-black border-neutral-800 focus:border-blue-600 text-white" : "bg-white border-neutral-200 focus:border-blue-600 text-neutral-900"
                  )}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-500 text-center">{error}</p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 border-2 border-blue-400/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-800/50 space-y-4">
            <p className="text-[10px] font-black uppercase text-neutral-500 text-center tracking-widest">Or continue with</p>
            <div className="grid grid-cols-2 gap-4">
              <button className={cn(
                "py-3 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all",
                theme === 'dark' ? "bg-black border-neutral-800 hover:border-neutral-700" : "bg-white border-neutral-200 hover:border-neutral-300"
              )}>
                <Chrome className="h-4 w-4" />
                Google
              </button>
              <button className={cn(
                "py-3 rounded-xl border-2 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all",
                theme === 'dark' ? "bg-black border-neutral-800 hover:border-neutral-700" : "bg-white border-neutral-200 hover:border-neutral-300"
              )}>
                <Github className="h-4 w-4" />
                GitHub
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs font-bold text-neutral-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>

      <div className="fixed bottom-8 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-blue-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Powered by Calori AI Agent</span>
      </div>
    </div>
  );
}
