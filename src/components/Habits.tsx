import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Flame, Target, Trophy } from 'lucide-react';
import { Habit } from '../types';
import { HabitEngine } from '../engines/habitEngine';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface HabitsProps {
  habits: Habit[];
  onToggle: (habit: Habit) => void;
}

export default function Habits({ habits, onToggle }: HabitsProps) {
  const streak = HabitEngine.calculateStreak(habits);
  const consistency = HabitEngine.calculateConsistencyScore(habits);

  const today = format(new Date(), 'yyyy-MM-dd');
  const dailyHabits = [
    { id: 'log_meals', name: 'Log all meals', icon: Target },
    { id: 'water_target', name: 'Drink 2L water', icon: Circle },
    { id: 'calorie_target', name: 'Stay within calories', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      {/* Streak & Consistency Stats */}
      <div className="grid grid-cols-2 gap-4">
        <section className="rounded-3xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-900/40">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-5 w-5 text-blue-200" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Streak</span>
          </div>
          <p className="text-4xl font-black">{streak}</p>
          <p className="text-xs font-bold text-blue-100 mt-1 uppercase tracking-widest">Days in a row</p>
        </section>
        <section className="rounded-3xl bg-neutral-900 p-6 text-white shadow-xl border border-neutral-800">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-neutral-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Consistency</span>
          </div>
          <p className="text-4xl font-black">{Math.round(consistency)}%</p>
          <p className="text-xs font-bold text-neutral-500 mt-1 uppercase tracking-widest">Last 30 days</p>
        </section>
      </div>

      {/* Daily Checklist */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500">Daily Checklist</h2>
          <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">{format(new Date(), 'EEEE, MMM d')}</span>
        </div>
        
        <div className="space-y-3">
          {dailyHabits.map((habit) => {
            const isCompleted = habits.some(h => h.name === habit.id && h.date === today && h.completed);
            return (
              <button
                key={habit.id}
                onClick={() => onToggle({ userId: '', name: habit.id, completed: !isCompleted, date: today } as Habit)}
                className={cn(
                  "w-full rounded-3xl border p-5 flex items-center justify-between transition-all active:scale-[0.98]",
                  isCompleted 
                    ? "bg-green-500/10 border-green-500/20 text-green-500" 
                    : "bg-neutral-900 border-neutral-800 text-white shadow-xl"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "rounded-2xl p-3",
                    isCompleted ? "bg-green-500/20" : "bg-black"
                  )}>
                    <habit.icon className="h-6 w-6" />
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs">{habit.name}</span>
                </div>
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                  isCompleted ? "bg-green-500 text-white" : "border-2 border-neutral-800 text-transparent"
                )}>
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Weekly View */}
      <section className="rounded-3xl bg-neutral-900 p-6 shadow-xl border border-neutral-800">
        <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500 mb-4">Weekly Consistency</h2>
        <div className="flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = subDays(new Date(), 6 - i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayName = format(date, 'EEEEE');
            const dayCompleted = habits.filter(h => h.date === dateStr && h.completed).length;
            const totalHabits = dailyHabits.length;
            const percent = (dayCompleted / totalHabits) * 100;

            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="relative h-12 w-2 rounded-full bg-black overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percent}%` }}
                    className="absolute bottom-0 w-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase",
                  isSameDay(date, new Date()) ? "text-blue-500" : "text-neutral-700"
                )}>
                  {dayName}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}
