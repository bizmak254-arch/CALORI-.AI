import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, User, Ruler, Weight, Activity, Target, Globe, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { CalorieEngine } from '../engines/calorieEngine';
import { cn } from '../lib/utils';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'lose',
    weeklyGoal: 0.5,
    points: 0,
    level: 1,
    badges: [],
    subscription: 'Free'
  });
  const [heightFeet, setHeightFeet] = useState<string>('');
  const [heightInches, setHeightInches] = useState<string>('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    let heightCm = undefined;
    if (heightFeet) {
      const feet = parseInt(heightFeet) || 0;
      const inches = parseInt(heightInches) || 0;
      heightCm = (feet * 30.48) + (inches * 2.54);
    }

    if (formData.name && formData.age && formData.weight) {
      onComplete({ ...formData, height: heightCm } as UserProfile);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="relative h-48 rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-blue-900/20">
              <img 
                src="input_file_1.png" 
                alt="Wellness" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                  <Sparkles className="h-3 w-3" />
                  AI Powered
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white">Welcome to CALORI AI</h2>
              <p className="text-neutral-500 font-bold">Let's start with the basics</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-neutral-400">Your Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-2xl border-2 border-neutral-800 bg-neutral-900 p-4 font-black text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-neutral-700"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-neutral-400">Nationality</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="text"
                    placeholder="e.g. American"
                    className="w-full rounded-2xl border-2 border-neutral-800 bg-neutral-900 p-4 pl-12 font-black text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-neutral-700"
                    value={formData.nationality || ''}
                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wider text-neutral-400">Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    className="w-full rounded-2xl border-2 border-neutral-800 bg-neutral-900 p-4 font-black text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-neutral-700"
                    value={formData.age || ''}
                    onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-wider text-neutral-400">Gender</label>
                  <div className="flex rounded-2xl border-2 border-neutral-800 p-1 bg-neutral-900">
                    <button
                      onClick={() => setFormData({ ...formData, gender: 'male' })}
                      className={cn("flex-1 rounded-xl py-3 text-sm font-black transition-colors", formData.gender === 'male' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-neutral-500")}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, gender: 'female' })}
                      className={cn("flex-1 rounded-xl py-3 text-sm font-black transition-colors", formData.gender === 'female' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-neutral-500")}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white">Physical Stats</h2>
              <p className="text-neutral-500 font-bold">Used to calculate your BMR</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-black uppercase tracking-wider text-neutral-400">Height (Optional)</label>
                  <span className="text-[10px] font-black text-neutral-600 uppercase">Feet & Inches</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
                    <input
                      type="number"
                      placeholder="5"
                      className="w-full rounded-2xl border-2 border-neutral-800 bg-neutral-900 p-4 pl-12 font-black text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-neutral-700"
                      value={heightFeet}
                      onChange={e => setHeightFeet(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-600">ft</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="7"
                      className="w-full rounded-2xl border-2 border-neutral-800 bg-neutral-900 p-4 font-black text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-neutral-700"
                      value={heightInches}
                      onChange={e => setHeightInches(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-neutral-600">in</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-neutral-400">Weight (kg)</label>
                <div className="relative">
                  <Weight className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="number"
                    placeholder="75"
                    className="w-full rounded-2xl border-2 border-neutral-800 bg-neutral-900 p-4 pl-12 font-black text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-neutral-700"
                    value={formData.weight || ''}
                    onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        const activityOptions = [
          { id: 'sedentary', label: 'Little to no exercise', sub: 'Desk job, mostly sitting' },
          { id: 'light', label: 'Light exercise', sub: '1-3 days per week' },
          { id: 'moderate', label: 'Moderate exercise', sub: '3-5 days per week' },
          { id: 'active', label: 'Hard exercise', sub: '6-7 days per week' },
          { id: 'very_active', label: 'Very hard exercise', sub: 'Physical job or 2x training' },
        ];
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white">Activity & Goals</h2>
              <p className="text-neutral-500 font-bold">How active are you?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-neutral-400">Activity Level</label>
                <div className="grid grid-cols-1 gap-2">
                  {activityOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, activityLevel: opt.id as any })}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border-2 p-4 transition-all text-left",
                        formData.activityLevel === opt.id ? "border-blue-600 bg-blue-600/10 text-blue-500" : "border-neutral-800 bg-neutral-900 text-neutral-500"
                      )}
                    >
                      <div>
                        <p className="text-sm font-black">{opt.label}</p>
                        <p className="text-[10px] font-bold opacity-70">{opt.sub}</p>
                      </div>
                      {formData.activityLevel === opt.id && <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-neutral-400">Your Goal</label>
                <div className="flex rounded-2xl border-2 border-neutral-800 p-1 bg-neutral-900">
                  {['lose', 'maintain', 'gain'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, goal: g as any })}
                      className={cn(
                        "flex-1 rounded-xl py-3 text-xs font-black transition-colors capitalize",
                        formData.goal === g ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-neutral-500"
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black p-6">
      <div className="flex-1">
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={cn("h-1.5 w-8 rounded-full transition-colors", i <= step ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "bg-neutral-800")} />
          ))}
        </div>
        {renderStep()}
      </div>
      <div className="flex gap-4 pt-6">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="flex h-14 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 px-6 text-neutral-500"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <button
          onClick={step === 3 ? handleSubmit : nextStep}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 font-black uppercase tracking-widest text-white shadow-xl shadow-blue-900/40 transition-transform active:scale-95"
        >
          <span>{step === 3 ? 'Get Started' : 'Continue'}</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
