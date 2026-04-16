import React from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Droplets, Scale, TrendingUp, Zap, Camera, Brain, 
  Sparkles, Trophy, Dumbbell, Utensils, Target, Flame,
  ChevronRight, AlertCircle, CheckCircle2, Clock, ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile, Meal, WeightLog, WorkoutSession, WaterLog } from '../types';
import { CalorieEngine } from '../engines/calorieEngine';
import { TrainingEngine } from '../engines/trainingEngine';
import { GoalEngine } from '../engines/goalEngine';
import { AgentEngine } from '../engines/agentEngine';
import { AIService } from '../services/aiService';

interface DashboardProps {
  profile: UserProfile;
  meals: Meal[];
  weightLogs: WeightLog[];
  workoutSessions: WorkoutSession[];
  waterLogs: WaterLog[];
  onAddMeal: () => void;
  onScanMeal: () => void;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ 
  profile, meals, weightLogs, workoutSessions, waterLogs, 
  onAddMeal, onScanMeal, onNavigate 
}: DashboardProps) {
  const [aiInsight, setAiInsight] = React.useState<{ title: string; message: string; type: 'positive' | 'negative' | 'neutral' } | null>(null);
  const [motivation, setMotivation] = React.useState<string>('');
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchAIContent = async () => {
      // Fetch coaching insights
      const insight = await AIService.getCoachingInsights(profile, meals.slice(-5), weightLogs.slice(-3));
      if (insight && insight.length > 0) {
        setAiInsight({
          title: insight[0].type === 'warning' ? 'AI Alert' : 'AI Coach Insight',
          message: insight[0].message,
          type: insight[0].type === 'warning' ? 'negative' : insight[0].type === 'motivation' ? 'positive' : 'neutral'
        });
      }

      // Fetch motivation and suggestions if enabled
      const settings = JSON.parse(localStorage.getItem('calori_settings') || '{}');
      if (settings.ai?.motivationMessages) {
        const msg = await AgentEngine.getMotivation(profile, settings);
        setMotivation(msg);
      }
      if (settings.ai?.suggestionEngine) {
        const tips = await AgentEngine.getSuggestions(profile, settings);
        setSuggestions(tips);
      }
    };
    fetchAIContent();
  }, [profile, meals.length, weightLogs.length]);

  // 1. Core Metrics Calculation
  const targetCalories = CalorieEngine.calculateTargetCalories(profile);
  const macroTargets = CalorieEngine.calculateMacroTargets(targetCalories);

  const today = new Date().setHours(0, 0, 0, 0);
  const todaysMeals = meals.filter(m => new Date(m.timestamp).setHours(0, 0, 0, 0) === today);
  const todaysWorkouts = workoutSessions.filter(s => new Date(s.timestamp).setHours(0, 0, 0, 0) === today);
  const todaysWater = waterLogs.filter(w => new Date(w.timestamp).setHours(0, 0, 0, 0) === today).reduce((acc, w) => acc + w.amount, 0);

  const consumed = todaysMeals.reduce((acc, m) => acc + m.calories, 0);
  const burned = todaysWorkouts.reduce((acc, s) => acc + s.caloriesBurned, 0);
  const net = consumed - burned;
  const progressPercent = Math.min(100, Math.round((consumed / targetCalories) * 100));

  const consumedProtein = todaysMeals.reduce((acc, m) => acc + m.protein, 0);
  const consumedCarbs = todaysMeals.reduce((acc, m) => acc + m.carbs, 0);
  const consumedFats = todaysMeals.reduce((acc, m) => acc + m.fats, 0);

  // 2. Training Metrics
  const weeklyWorkouts = TrainingEngine.calculateWeeklyWorkouts(workoutSessions);
  const weeklyBurned = TrainingEngine.calculateWeeklyCaloriesBurned(workoutSessions);
  const streak = TrainingEngine.calculateStreak(workoutSessions);
  const consistency = TrainingEngine.calculateConsistencyScore(workoutSessions);

  // 3. Goal Metrics
  const weightProgress = GoalEngine.calculateWeightProgress(profile, weightLogs);
  const estCompletion = GoalEngine.estimateCompletionDate(profile, weightLogs);
  const goalStatus = GoalEngine.getStatus(profile, weightLogs);

  // 4. Meal Status
  const hasBreakfast = todaysMeals.some(m => m.mealType === 'breakfast');
  const hasLunch = todaysMeals.some(m => m.mealType === 'lunch');
  const hasDinner = todaysMeals.some(m => m.mealType === 'dinner');

  // 5. Timeline Breakdown
  const morningCals = todaysMeals.filter(m => {
    const hour = new Date(m.timestamp).getHours();
    return hour < 12;
  }).reduce((acc, m) => acc + m.calories, 0);

  const afternoonCals = todaysMeals.filter(m => {
    const hour = new Date(m.timestamp).getHours();
    return hour >= 12 && hour < 18;
  }).reduce((acc, m) => acc + m.calories, 0);

  const eveningCals = todaysMeals.filter(m => {
    const hour = new Date(m.timestamp).getHours();
    return hour >= 18;
  }).reduce((acc, m) => acc + m.calories, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. 👋 HEADER SECTION */}
      <header className="relative rounded-[40px] overflow-hidden p-8 shadow-2xl border border-white/10 group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1200&auto=format&fit=crop" 
            alt="Dashboard Header" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">AI Sync Active</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight font-display drop-shadow-lg">
              Good Morning, <br />
              <span className="text-blue-400">{profile.name.split(' ')[0]}</span> 👋
            </h1>
            <div className="flex items-center gap-3 mt-4 bg-black/40 backdrop-blur-xl p-3 rounded-2xl border border-white/10 w-fit">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-black text-white uppercase tracking-widest">{profile.goal} • {profile.targetWeight}kg</span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm",
                goalStatus === 'On Track' ? "bg-green-500 text-white" :
                goalStatus === 'At Risk' ? "bg-yellow-500 text-black" :
                "bg-red-500 text-white"
              )}>
                {goalStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="h-16 w-16 rounded-[24px] bg-white/10 backdrop-blur-2xl border-2 border-white/20 flex items-center justify-center relative shadow-2xl group-hover:rotate-12 transition-transform duration-500">
              <Trophy className="h-8 w-8 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-black shadow-lg">
                {profile.level}
              </div>
            </div>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Level</span>
          </div>
        </div>
      </header>

      {/* 2. 🔥 DAILY SUMMARY SECTION */}
      <section className="rounded-[32px] bg-neutral-900 p-8 border border-neutral-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Flame className="h-40 w-40 text-orange-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 font-display">Today Summary</h2>
            <span className="text-sm font-black text-neutral-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Intake</p>
              <p className="text-2xl font-black text-white font-display">{Math.round(consumed)} <span className="text-xs text-neutral-500 font-bold">kcal</span></p>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Burned</p>
              <p className="text-2xl font-black text-green-500 font-display">-{Math.round(burned)} <span className="text-xs text-neutral-500 font-bold">kcal</span></p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Net</p>
              <p className="text-2xl font-black text-blue-500 font-display">{Math.round(net)} <span className="text-xs text-neutral-500 font-bold">kcal</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <p className="text-base font-black text-white font-display">{progressPercent}% <span className="text-neutral-500 font-black uppercase text-xs ml-1">of daily target</span></p>
              <p className="text-xs font-black text-neutral-500 uppercase tracking-widest">{Math.round(targetCalories)} kcal target</p>
            </div>
            <div className="h-4 w-full rounded-full bg-neutral-800 overflow-hidden p-1 border border-neutral-700">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  progressPercent > 100 ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]" : "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                )}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. 🤖 AI INSIGHT CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] bg-blue-600 p-6 text-white shadow-xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => onNavigate('intelligence')}
        >
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Brain className="h-32 w-32" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-200" />
                <h2 className="text-xs font-black uppercase tracking-widest">{aiInsight?.title || 'AI Coach Insight'}</h2>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase border border-white/10">
                Personalized
              </div>
            </div>
            
            <p className="text-lg font-black leading-tight">
              "{aiInsight?.message || "Analyzing your data to provide personalized coaching insights..."}"
            </p>
            
            <div className="flex items-center gap-2 text-xs font-bold text-blue-100">
              <span>{profile.subscription === 'Free' ? 'Unlock Pro features' : 'View full analysis'}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </motion.section>

        {motivation && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] bg-gradient-to-tr from-purple-600 to-pink-600 p-6 text-white shadow-xl relative overflow-hidden group"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
              <Zap className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-purple-200" />
                <h2 className="text-xs font-black uppercase tracking-widest">Daily Motivation</h2>
              </div>
              <p className="text-lg font-black leading-tight italic">
                "{motivation}"
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-100">
                <span>Stay strong, {profile.name.split(' ')[0]}!</span>
              </div>
            </div>
          </motion.section>
        )}
      </div>

      {suggestions.length > 0 && (
        <section className="rounded-[32px] bg-neutral-900 p-6 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">AI Suggestions</h2>
            </div>
            <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            {suggestions.map((tip, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-neutral-800 group hover:border-blue-500/50 transition-all"
              >
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-neutral-300">{tip}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 🍽️ NUTRITION SNAPSHOT SECTION */}
      <section className="rounded-[32px] bg-neutral-900 p-6 border border-neutral-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Nutrition Snapshot</h2>
          <Utensils className="h-4 w-4 text-neutral-600" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Protein', value: Math.round(consumedProtein), target: Math.round(macroTargets.protein), color: 'bg-blue-500' },
            { label: 'Carbs', value: Math.round(consumedCarbs), target: Math.round(macroTargets.carbs), color: 'bg-indigo-500' },
            { label: 'Fats', value: Math.round(consumedFats), target: Math.round(macroTargets.fats), color: 'bg-purple-500' },
          ].map((macro) => (
            <div key={macro.label} className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase text-neutral-500">{macro.label}</p>
                <p className="text-xs font-black text-white">{macro.value}g</p>
              </div>
              <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                <div 
                  className={cn("h-full", macro.color)} 
                  style={{ width: `${Math.min(100, (macro.value / macro.target) * 100)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", hasBreakfast ? "bg-green-500" : "bg-neutral-700")} />
              <span className="text-[10px] font-black uppercase text-neutral-400">Breakfast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", hasLunch ? "bg-green-500" : "bg-neutral-700")} />
              <span className="text-[10px] font-black uppercase text-neutral-400">Lunch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", hasDinner ? "bg-green-500" : "bg-neutral-700")} />
              <span className="text-[10px] font-black uppercase text-neutral-400">Dinner</span>
            </div>
          </div>
          {!hasDinner && (
            <div className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-3 w-3" />
              <span className="text-[8px] font-black uppercase">Dinner Missing</span>
            </div>
          )}
        </div>
      </section>

      {/* 5. 🏋️ TRAINING SUMMARY SECTION */}
      <section className="rounded-[32px] bg-neutral-900 border border-neutral-800 shadow-2xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform" onClick={() => onNavigate('training')}>
        <div className="absolute inset-0 opacity-20 transition-transform duration-700 group-hover:scale-110">
          <img 
            src="input_file_0.png" 
            alt="Gym Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
        </div>
        
        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Training Snapshot</h2>
            <Dumbbell className="h-4 w-4 text-neutral-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-black/60 backdrop-blur-md p-4 border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Weekly Workouts</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-black text-white">{weeklyWorkouts}</p>
                <p className="text-xs font-bold text-neutral-600 mb-1">/ 5 sessions</p>
              </div>
            </div>
            <div className="rounded-2xl bg-black/60 backdrop-blur-md p-4 border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider">Calories Burned</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-black text-green-500">{Math.round(weeklyBurned)}</p>
                <p className="text-xs font-bold text-neutral-600 mb-1">kcal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/20">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-black text-white">Streak: {streak} Days</p>
                <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Consistency: {consistency}%</p>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div 
                  key={day} 
                  className={cn(
                    "h-1.5 w-3 rounded-full",
                    day <= weeklyWorkouts ? "bg-green-500" : "bg-white/10"
                  )} 
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. 📊 PROGRESS OVERVIEW SECTION */}
      <section className="rounded-[32px] bg-neutral-900 p-6 border border-neutral-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Progress Overview</h2>
          <TrendingUp className="h-4 w-4 text-neutral-600" />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-[10px] font-black uppercase text-neutral-500">Start</p>
            <p className="text-lg font-black text-white">{weightLogs[0]?.weight || profile.weight}kg</p>
          </div>
          <div className="h-px flex-1 mx-4 bg-neutral-800 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-neutral-700" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase text-blue-500">Current</p>
            <p className="text-lg font-black text-white">{weightLogs[weightLogs.length - 1]?.weight || profile.weight}kg</p>
          </div>
          <div className="h-px flex-1 mx-4 bg-neutral-800 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-neutral-700" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase text-neutral-500">Target</p>
            <p className="text-lg font-black text-white">{profile.targetWeight}kg</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <p className="text-sm font-black text-white">{weightProgress}% <span className="text-neutral-500 font-bold uppercase text-[10px] ml-1">Transformation</span></p>
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Est. {estCompletion}</p>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${weightProgress}%` }}
              className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
            />
          </div>
        </div>
      </section>

      {/* 7. ⚡ QUICK ACTION PANEL */}
      <section className="grid grid-cols-2 gap-4">
        <button 
          onClick={onAddMeal}
          className="flex items-center gap-4 rounded-3xl bg-neutral-900 p-5 border-2 border-neutral-800 transition-all active:scale-95 hover:border-blue-500/50 shadow-lg group"
        >
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Plus className="h-7 w-7" />
          </div>
          <div className="text-left">
            <p className="text-base font-black text-white font-display">Add Meal</p>
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Log nutrition</p>
          </div>
        </button>
        <button 
          onClick={() => onNavigate('training')}
          className="flex items-center gap-4 rounded-3xl bg-neutral-900 p-5 border-2 border-neutral-800 transition-all active:scale-95 hover:border-green-500/50 shadow-lg group"
        >
          <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
            <Dumbbell className="h-7 w-7" />
          </div>
          <div className="text-left">
            <p className="text-base font-black text-white font-display">Start Workout</p>
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Burn calories</p>
          </div>
        </button>
        <button className="flex items-center gap-4 rounded-3xl bg-neutral-900 p-5 border-2 border-neutral-800 transition-all active:scale-95 hover:border-indigo-500/50 shadow-lg group">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <Droplets className="h-7 w-7" />
          </div>
          <div className="text-left">
            <p className="text-base font-black text-white font-display">Log Water</p>
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Hydrate</p>
          </div>
        </button>
        <button className="flex items-center gap-4 rounded-3xl bg-neutral-900 p-5 border-2 border-neutral-800 transition-all active:scale-95 hover:border-purple-500/50 shadow-lg group">
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <Scale className="h-7 w-7" />
          </div>
          <div className="text-left">
            <p className="text-base font-black text-white font-display">Log Weight</p>
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Track progress</p>
          </div>
        </button>
        <button 
          onClick={onScanMeal}
          className="col-span-2 flex items-center justify-center gap-4 rounded-3xl bg-blue-600 p-6 shadow-2xl shadow-blue-900/40 transition-all active:scale-95 hover:bg-blue-500 border-2 border-blue-400/20"
        >
          <Camera className="h-7 w-7 text-white" />
          <span className="text-base font-black uppercase tracking-[0.2em] text-white font-display">Scan Food with AI Camera</span>
        </button>
      </section>

      {/* 8. 📈 TODAY BREAKDOWN TIMELINE */}
      <section className="rounded-[32px] bg-neutral-900 p-6 border border-neutral-800 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Today Breakdown</h2>
          <Clock className="h-4 w-4 text-neutral-600" />
        </div>

        <div className="space-y-6 relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-neutral-800" />
          
          {[
            { label: 'Morning', calories: morningCals, icon: '🌅', status: morningCals > 0 ? 'Logged' : 'Missing' },
            { label: 'Afternoon', calories: afternoonCals, icon: '☀️', status: afternoonCals > 0 ? 'Logged' : 'Missing' },
            { label: 'Evening', calories: eveningCals, icon: '🌙', status: eveningCals > 0 ? 'Logged' : 'Missing' },
          ].map((period, i) => (
            <div key={period.label} className="flex items-center gap-6 relative z-10">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm border-2",
                period.status === 'Logged' ? "bg-blue-500 border-blue-600" : "bg-neutral-900 border-neutral-800"
              )}>
                {period.icon}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-white">{period.label}</p>
                  <p className={cn("text-[10px] font-black uppercase", period.status === 'Logged' ? "text-blue-400" : "text-neutral-600")}>
                    {period.status}
                  </p>
                </div>
                <p className="text-sm font-black text-white">{period.calories} <span className="text-[10px] text-neutral-500">kcal</span></p>
              </div>
            </div>
          ))}

          {todaysWorkouts.length > 0 && (
            <div className="flex items-center gap-6 relative z-10">
              <div className="h-8 w-8 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center text-sm">
                🏋️
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-white">Workout Session</p>
                  <p className="text-[10px] font-black uppercase text-green-400">Completed</p>
                </div>
                <p className="text-sm font-black text-green-500">-{Math.round(burned)} <span className="text-[10px] text-neutral-500">kcal</span></p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 9. 🎯 DAILY STATUS SUMMARY */}
      <section className="rounded-[32px] bg-neutral-900 p-6 border border-neutral-800 space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Daily Goal Status</h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-neutral-800/50">
            <div className="flex items-center gap-3">
              <Utensils className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Calories</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                consumed <= targetCalories ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {consumed <= targetCalories ? 'On Track' : 'Slightly High'}
              </span>
              {consumed <= targetCalories ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-neutral-800/50">
            <div className="flex items-center gap-3">
              <Dumbbell className="h-4 w-4 text-green-500" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Training</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                todaysWorkouts.length > 0 ? "bg-green-500/10 text-green-500" : "bg-neutral-700 text-neutral-500"
              )}>
                {todaysWorkouts.length > 0 ? 'Completed' : 'Not Started'}
              </span>
              {todaysWorkouts.length > 0 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-neutral-700" />}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-neutral-800/50">
            <div className="flex items-center gap-3">
              <Droplets className="h-4 w-4 text-indigo-500" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Hydration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                todaysWater >= 2000 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {todaysWater >= 2000 ? 'Good' : 'Low'}
              </span>
              {todaysWater >= 2000 ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
