import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dumbbell, Calendar, Clock, Zap, ChevronRight, RefreshCw, Loader2, CheckCircle2, Info, Sparkles, Rocket } from 'lucide-react';
import { UserProfile, TrainingPlan as TrainingPlanType, Workout } from '../types';
import { AIService } from '../services/aiService';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface TrainingPlanProps {
  profile: UserProfile;
  plan: TrainingPlanType | null;
  onPlanGenerated: (plan: TrainingPlanType) => void;
}

export default function TrainingPlan({ profile, plan, onPlanGenerated }: TrainingPlanProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const generatedPlan = await AIService.generateTrainingPlan(profile);
      if (generatedPlan) {
        onPlanGenerated({
          ...generatedPlan,
          id: Math.random().toString(36).substr(2, 9),
          userId: profile.id,
          createdAt: Date.now()
        });
      }
    } catch (error) {
      console.error("Failed to generate training plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (profile.subscription === 'Free' || profile.subscription === 'Basic') {
    return (
      <div className="space-y-6">
        <div className="relative h-64 rounded-[32px] overflow-hidden shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop" 
            alt="Elite Training" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-900/40">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">Unlock Pro Training</h2>
              <p className="text-sm font-bold text-neutral-300 max-w-[280px]">
                Personalized AI training plans are exclusive to Pro and Elite members.
              </p>
            </div>
            <button 
              onClick={() => (window as any).setActiveTab('profile')}
              className="px-8 py-4 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-transform"
            >
              Upgrade Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { title: 'AI Personalized Routine', desc: 'Workouts built for your specific body type and goals.' },
            { title: 'Adaptive Intensity', desc: 'Plan adjusts based on your performance and recovery.' },
            { title: 'Goal Prediction', desc: 'See exactly when you will reach your target weight.' }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-neutral-900 border border-neutral-800">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-white">{feature.title}</p>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-20 w-20 rounded-full border-4 border-blue-500/20 border-t-blue-500"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Dumbbell className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Crafting Your Plan</h2>
          <p className="text-sm text-neutral-500 font-bold max-w-[250px] mx-auto">
            Our AI is analyzing your profile and goals to build the perfect 7-day routine...
          </p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="h-1.5 w-1.5 rounded-full bg-blue-500"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="space-y-6">
        <div className="relative h-64 rounded-[40px] overflow-hidden shadow-2xl shadow-blue-900/20 group">
          <img 
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop" 
            alt="Training Motivation" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
              <Sparkles className="h-3 w-3" />
              AI Powered
            </div>
          </div>
          <div className="absolute bottom-0 left-0 p-8 w-full pt-12">
            <h1 className="text-3xl font-black text-white tracking-tight font-display">Personalized Training</h1>
            <p className="text-sm font-bold text-neutral-300">Fit athletic man doing push-ups with a workout plan UI.</p>
          </div>
        </div>

        <div className="rounded-[40px] bg-neutral-900 p-10 text-center border-2 border-neutral-800 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Dumbbell className="h-32 w-32 text-blue-500" />
          </div>
          <div className="relative z-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-500/10 text-blue-500 border-2 border-blue-500/20 shadow-inner backdrop-blur-xl">
              <Zap className="h-10 w-10" />
            </div>
            <div className="space-y-3 mt-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-widest font-display">No Active Plan</h2>
              <p className="text-base font-bold text-neutral-500 max-w-[280px] mx-auto leading-relaxed">
                Ready to take your fitness to the next level? Generate a custom 7-day plan based on your current stats.
              </p>
            </div>
            <button
              onClick={handleGeneratePlan}
              className="w-full mt-8 rounded-2xl bg-blue-600 py-5 text-base font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-blue-900/60 transition-all active:scale-95 flex items-center justify-center gap-3 border-2 border-blue-400/20 hover:bg-blue-500"
            >
              <RefreshCw className="h-5 w-5" />
              Generate My Plan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-neutral-900 p-4 border border-neutral-800 space-y-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Duration</p>
            <p className="text-sm font-black text-white">7 Day Cycle</p>
          </div>
          <div className="rounded-2xl bg-neutral-900 p-4 border border-neutral-800 space-y-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Intensity</p>
            <p className="text-sm font-black text-white">Adaptive</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">{plan.name}</h2>
          <p className="text-xs font-bold text-neutral-500">{plan.description}</p>
        </div>
        <button
          onClick={handleGeneratePlan}
          className="h-10 w-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-blue-500 transition-colors"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-1">Your 7-Day Routine</h3>
        <div className="space-y-2">
          {plan.workouts.map((workout, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedWorkout(workout)}
              className={cn(
                "rounded-2xl p-4 border transition-all cursor-pointer active:scale-[0.98]",
                "bg-neutral-900 border-neutral-800 hover:border-blue-500/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs",
                    workout.intensity === 'High' ? "bg-red-500/10 text-red-500" :
                    workout.intensity === 'Medium' ? "bg-yellow-500/10 text-yellow-500" :
                    "bg-green-500/10 text-green-500"
                  )}>
                    {workout.day.substring(0, 3)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{workout.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-neutral-500">{workout.duration}</span>
                      <span className="h-1 w-1 rounded-full bg-neutral-800" />
                      <span className={cn(
                        "text-[10px] font-black uppercase",
                        workout.intensity === 'High' ? "text-red-500" :
                        workout.intensity === 'Medium' ? "text-yellow-500" :
                        "text-green-500"
                      )}>{workout.intensity}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedWorkout && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-neutral-900 rounded-t-[32px] p-6 shadow-2xl border-t border-neutral-800 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-white">{selectedWorkout.title}</h3>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{selectedWorkout.day} • {selectedWorkout.duration}</p>
                </div>
                <button 
                  onClick={() => setSelectedWorkout(null)}
                  className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400"
                >
                  <RefreshCw className="h-5 w-5 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                {selectedWorkout.exercises.length > 0 ? (
                  selectedWorkout.exercises.map((exercise, i) => (
                    <div key={i} className="rounded-2xl bg-black/40 p-4 border border-neutral-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-white">{exercise.name}</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase">
                          <span>{exercise.sets} Sets</span>
                          <span className="h-1 w-1 rounded-full bg-neutral-800" />
                          <span>{exercise.reps}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Rest</p>
                        <p className="text-xs font-black text-white">{exercise.rest}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center space-y-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                      <Calendar className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-bold text-neutral-500">Rest day. Focus on recovery and mobility.</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedWorkout(null)}
                className="w-full mt-8 rounded-2xl bg-blue-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-blue-900/40"
              >
                Close Workout
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
