import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, Target, Zap, Award, ChevronRight, Flame } from 'lucide-react';
import { UserProfile, Challenge, Meal, Habit } from '../types';
import { GamificationEngine } from '../engines/gamificationEngine';
import { cn } from '../lib/utils';

interface GamificationProps {
  profile: UserProfile;
  meals: Meal[];
  habits: Habit[];
}

export default function Gamification({ profile, meals, habits }: GamificationProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  
  useEffect(() => {
    const daily = GamificationEngine.generateDailyChallenges(profile, meals, habits);
    setChallenges(daily);
  }, [profile, meals, habits]);

  const level = GamificationEngine.calculateLevel(profile.points || 0);
  const nextLevelPoints = GamificationEngine.getPointsToNextLevel(profile.points || 0);
  const currentLevelPoints = Math.pow(level - 1, 2) * 100;
  const progressToNext = ((profile.points - currentLevelPoints) / (Math.pow(level, 2) * 100 - currentLevelPoints)) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Tracking Header */}
      <header className="relative h-48 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1200&auto=format&fit=crop" 
          alt="Progress Tracking" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">Achievement Unlocked</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">Your Progress Journey</h1>
          <p className="text-xs font-bold text-neutral-300 max-w-[250px]">Happy fit woman celebrating fitness progress with charts.</p>
        </div>
      </header>

      {/* Level & Progress Card */}
      <section className="rounded-3xl bg-neutral-900 p-6 shadow-xl border border-neutral-800 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Trophy className="h-32 w-32 text-blue-500" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
                <span className="text-xl font-black text-white">{level}</span>
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-widest">Level {level}</h2>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Master Nutritionist</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-blue-500">{profile.points || 0}</p>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Total Points</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-neutral-500">Progress to Level {level + 1}</span>
              <span className="text-blue-500">{Math.round(nextLevelPoints)} XP Left</span>
            </div>
            <div className="h-3 w-full rounded-full bg-black overflow-hidden border border-neutral-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Daily Challenges */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500">Daily Challenges</h2>
          <div className="flex items-center gap-1 text-blue-500">
            <Zap className="h-4 w-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Bonus XP</span>
          </div>
        </div>

        <div className="space-y-3">
          {challenges.map((challenge) => (
            <div 
              key={challenge.id}
              className={cn(
                "rounded-3xl border p-5 flex items-center justify-between transition-all",
                challenge.completed 
                  ? "bg-green-500/10 border-green-500/20" 
                  : "bg-neutral-900 border-neutral-800"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center",
                  challenge.completed ? "bg-green-500/20 text-green-500" : "bg-black text-blue-500"
                )}>
                  <Star className={cn("h-6 w-6", challenge.completed && "fill-current")} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">{challenge.title}</h3>
                  <p className="text-[10px] font-bold text-neutral-500">{challenge.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 w-24 rounded-full bg-black overflow-hidden">
                      <div 
                        className={cn("h-full", challenge.completed ? "bg-green-500" : "bg-blue-500")}
                        style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-black text-neutral-600 uppercase">
                      {challenge.progress}/{challenge.target} {challenge.unit}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={cn("text-lg font-black", challenge.completed ? "text-green-500" : "text-white")}>
                  +{challenge.points}
                </p>
                <p className="text-[8px] font-black text-neutral-600 uppercase">XP</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Badges & Achievements */}
      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500 px-1">Achievements</h2>
        <div className="grid grid-cols-3 gap-3">
          {['Early Logger', 'Meal Veteran', 'Weight Watcher', 'Water Hero', 'Streak King', 'Macro Pro'].map((badge) => {
            const isUnlocked = profile.badges?.includes(badge);
            return (
              <div 
                key={badge}
                className={cn(
                  "rounded-3xl p-4 flex flex-col items-center gap-2 text-center border transition-all",
                  isUnlocked 
                    ? "bg-neutral-900 border-blue-500/30 shadow-lg shadow-blue-900/20" 
                    : "bg-neutral-900/50 border-neutral-800 opacity-40 grayscale"
                )}
              >
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center",
                  isUnlocked ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-600"
                )}>
                  <Award className="h-6 w-6" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-tighter leading-tight">{badge}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="rounded-3xl bg-neutral-900 p-6 border border-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500">Global Ranking</h2>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Rank #1,242</span>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Sarah K.', points: 12400, rank: 1 },
            { name: 'Mike R.', points: 11200, rank: 2 },
            { name: 'You', points: profile.points || 0, rank: 1242, isMe: true }
          ].map((user) => (
            <div key={user.name} className={cn("flex items-center justify-between p-2 rounded-xl", user.isMe && "bg-blue-600/10 border border-blue-600/20")}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-neutral-500 w-4">#{user.rank}</span>
                <span className={cn("text-xs font-black", user.isMe ? "text-blue-500" : "text-white")}>{user.name}</span>
              </div>
              <span className="text-xs font-black text-white">{user.points} XP</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
