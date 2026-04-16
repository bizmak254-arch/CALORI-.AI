import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Calendar,
  Activity,
  Utensils
} from 'lucide-react';
import { AIService } from '../services/aiService';
import { UserProfile, Meal, WeightLog } from '../types';
import { cn } from '../lib/utils';

interface AIIntelligenceProps {
  profile: UserProfile;
  meals: Meal[];
  weightLogs: WeightLog[];
  remainingCalories: number;
}

export default function AIIntelligence({ profile, meals, weightLogs, remainingCalories }: AIIntelligenceProps) {
  const [behaviorData, setBehaviorData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [behavior, recs, pred] = await Promise.all([
          AIService.analyzeBehavior(profile, meals, weightLogs),
          AIService.getSmartRecommendations(profile, remainingCalories, {}),
          AIService.predictGoalOutcome(profile, { meals, weightLogs })
        ]);
        setBehaviorData(behavior);
        setRecommendations(recs);
        setPrediction(pred);
      } catch (err) {
        console.error("AI Analysis failed", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [profile, meals, weightLogs, remainingCalories]);

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        <p className="text-sm font-black text-neutral-500 uppercase tracking-widest">AI Brain Syncing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Coach Header */}
      <header className="relative h-48 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
        <img 
          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop" 
          alt="AI Coach" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Elite AI Assistant</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">Your AI Health Coach</h1>
          <p className="text-xs font-bold text-neutral-300 max-w-[250px]">Surrounded by heart rate, weights, and analytics charts.</p>
        </div>
      </header>

      {/* Health Score & Prediction */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 rounded-3xl p-8 shadow-2xl border-2 border-neutral-800 flex flex-col items-center text-center space-y-3">
          <div className="h-20 w-20 rounded-full border-4 border-blue-500 flex items-center justify-center relative shadow-[0_0_20px_rgba(59,130,246,0.4)] bg-blue-500/5">
            <span className="text-2xl font-black text-white font-display">{behaviorData?.healthScore || 85}</span>
            <div className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center border-2 border-neutral-900 shadow-lg">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-neutral-500 tracking-widest font-display">Health Score</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl border-2 border-white/10 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <TrendingUp className="h-24 w-24" />
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <Calendar className="h-5 w-5 text-blue-200" />
            <span className="text-xs font-black uppercase text-blue-200 tracking-widest">Forecast</span>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-black font-display">{prediction?.predictedDate || 'May 24'}</p>
            <p className="text-xs font-black text-blue-100/80 uppercase tracking-widest">Target Reached</p>
          </div>
        </div>
      </section>

      {/* Behavior Patterns */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Brain className="h-4 w-4 text-indigo-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500">Behavior Intelligence</h2>
        </div>
        <div className="space-y-3">
          {behaviorData?.patterns?.map((pattern: any, i: number) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-900 rounded-2xl p-4 shadow-sm border border-neutral-800 flex gap-4"
            >
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                pattern.impact === 'positive' ? "bg-blue-500/10 text-blue-500" :
                pattern.impact === 'negative' ? "bg-red-500/10 text-red-500" : "bg-indigo-500/10 text-indigo-500"
              )}>
                {pattern.impact === 'positive' ? <CheckCircle2 className="h-5 w-5" /> : 
                 pattern.impact === 'negative' ? <AlertCircle className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
              </div>
              <div>
                <h4 className="text-sm font-black text-white">{pattern.title}</h4>
                <p className="text-xs text-neutral-500 font-bold">{pattern.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Smart Recommendations */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500">Smart Suggestions</h2>
        </div>
        <div className="flex overflow-x-auto pb-4 gap-4 snap-x scrollbar-hide">
          {recommendations?.suggestions?.map((rec: any, i: number) => (
            <motion.div 
              key={i}
              className="min-w-[280px] bg-neutral-900 rounded-3xl p-5 shadow-xl border border-neutral-800 snap-center space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Utensils className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">{rec.calories}</p>
                  <p className="text-[10px] font-black text-neutral-500 uppercase">kcal</p>
                </div>
              </div>
              <div>
                <h4 className="text-base font-black leading-tight mb-1 text-white">{rec.name}</h4>
                <p className="text-xs text-neutral-500 font-bold line-clamp-2">{rec.why}</p>
              </div>
              <div className="flex gap-2">
                <div className="px-2 py-1 rounded-lg bg-neutral-800 text-[10px] font-black text-neutral-500">P: {rec.protein}g</div>
                <div className="px-2 py-1 rounded-lg bg-neutral-800 text-[10px] font-black text-neutral-500">C: {rec.carbs}g</div>
                <div className="px-2 py-1 rounded-lg bg-neutral-800 text-[10px] font-black text-neutral-500">F: {rec.fats}g</div>
              </div>
              <button className="w-full py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40 border-2 border-blue-400/20 active:scale-95 transition-all hover:bg-blue-500">
                Log This Meal
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
