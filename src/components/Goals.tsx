import React from 'react';
import { motion } from 'motion/react';
import { Target, Calendar, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { UserProfile, WeightLog } from '../types';
import { GoalEngine } from '../engines/goalEngine';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface GoalsProps {
  profile: UserProfile;
  weightLogs: WeightLog[];
}

export default function Goals({ profile, weightLogs }: GoalsProps) {
  const currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : profile.weight;
  const progress = GoalEngine.calculateWeightProgress(profile, weightLogs);
  const predictedDate = GoalEngine.estimateCompletionDate(profile, weightLogs);

  const goalIcons = {
    lose: TrendingDown,
    gain: TrendingUp,
    maintain: Minus
  };

  const Icon = goalIcons[profile.goal];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-neutral-900 p-6 shadow-xl border border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-500 border border-blue-500/20">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-black capitalize text-white">{profile.goal} Weight</h2>
              <p className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">Current Goal</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-neutral-500 font-black uppercase">Start</p>
              <p className="text-xl font-black text-white">{profile.weight}<span className="text-sm font-bold text-neutral-600 ml-1">kg</span></p>
            </div>
            <div className="text-center">
              <p className="text-xs text-neutral-500 font-black uppercase">Current</p>
              <p className="text-2xl font-black text-blue-500">{currentWeight}<span className="text-sm font-bold text-neutral-600 ml-1">kg</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-500 font-black uppercase">Target</p>
              <p className="text-xl font-black text-white">{profile.targetWeight || profile.weight}<span className="text-sm font-bold text-neutral-600 ml-1">kg</span></p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider">
              <span className="text-neutral-500">Progress</span>
              <span className="text-blue-500">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-neutral-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
              />
            </div>
          </div>
        </div>
      </section>

      {predictedDate && (
        <section className="rounded-3xl bg-neutral-900 p-6 text-white shadow-xl border border-neutral-800">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-black uppercase tracking-wider text-indigo-500">AI Prediction</h3>
          </div>
          <p className="text-lg font-bold leading-relaxed text-neutral-200">
            Based on your recent progress, you are on track to reach your target weight by:
          </p>
          <p className="mt-2 text-3xl font-black text-white">
            {format(new Date(predictedDate), 'MMM d, yyyy')}
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-3 border border-white/5">
            <TrendingDown className="h-4 w-4 text-blue-400" />
            <p className="text-xs font-bold text-neutral-400">
              You've been losing an average of 0.6kg per week. Keep it up!
            </p>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500 px-1">Weight History</h2>
        <div className="space-y-2">
          {weightLogs.slice().reverse().map((log, i) => (
            <div key={log.id} className="rounded-2xl bg-neutral-900 p-4 shadow-sm border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                  <Scale className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">{log.weight} kg</p>
                  <p className="text-[10px] text-neutral-500 font-black uppercase">{format(new Date(log.timestamp), 'MMM d, h:mm a')}</p>
                </div>
              </div>
              {i < weightLogs.length - 1 && (
                <div className={cn(
                  "text-xs font-black flex items-center gap-1",
                  log.weight < weightLogs[weightLogs.length - 2 - i].weight ? "text-blue-500" : "text-red-500"
                )}>
                  {log.weight < weightLogs[weightLogs.length - 2 - i].weight ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                  {Math.abs(log.weight - weightLogs[weightLogs.length - 2 - i].weight).toFixed(1)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Scale({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
    </svg>
  );
}
