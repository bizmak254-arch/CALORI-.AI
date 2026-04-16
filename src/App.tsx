/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Meals from './components/Meals';
import Goals from './components/Goals';
import Habits from './components/Habits';
import Profile from './components/Profile';
import ProfileSetup from './components/ProfileSetup';
import LogMeal from './components/LogMeal';
import NutritionistChat from './components/NutritionistChat';
import FoodScanner from './components/FoodScanner';
import AIIntelligence from './components/AIIntelligence';
import Gamification from './components/Gamification';
import TrainingPlan from './components/TrainingPlan';
import Pricing from './components/Pricing';
import ReminderSystem from './components/ReminderSystem';
import Settings from './components/Settings';
import AIVoiceAgent from './components/AIVoiceAgent';
import Auth from './components/Auth';
import { UserProfile, Meal, WeightLog, Habit, TrainingPlan as TrainingPlanType, WorkoutSession, WaterLog, Reminder, ReminderSettings } from './types';
import { AnimatePresence } from 'motion/react';
import { CalorieEngine } from './engines/calorieEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authUser, setAuthUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlanType | null>(null);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);
  const [isScanningMeal, setIsScanningMeal] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    theme: 'dark',
    notifications: { enabled: true, voiceEnabled: true, vibration: true, intensity: 'Medium', urgencyLevels: true },
    behavior: { snoozeDuration: 5, autoReschedule: true, maxReminders: 3, quietHours: { start: '22:00', end: '07:00' }, escalationLogic: true },
    scheduling: { autoScheduling: true, priorityBased: true, timeOptimization: true },
    goals: { autoBreakdown: true, difficultyAdjustment: true, weeklyRegeneration: true, habitTracking: true },
    ai: { 
      smartRescheduling: true, 
      suggestionEngine: true, 
      suggestionFocus: ['nutrition', 'training', 'lifestyle'],
      dailySummary: true, 
      motivationMessages: true, 
      motivationFrequency: 'medium',
      motivationStyle: 'firm',
      mode: 'Smart Assistant' 
    },
    progress: { habitTracking: true, goalTracking: true, weeklyReports: true, streakTracking: true, achievementBadges: true },
    voice: { enabled: true, agentName: 'Aria', wakePhrase: 'Hey Calori', language: 'English', speed: 'Normal', gender: 'female', tone: 'motivational', personality: 'Friendly' },
    privacy: { storeVoice: false, syncAcrossDevices: true, longTermMemory: true }
  });

  // Load initial data from localStorage for demo purposes
  useEffect(() => {
    const savedAuth = localStorage.getItem('calori_auth');
    const savedProfile = localStorage.getItem('calori_profile');
    const savedMeals = localStorage.getItem('calori_meals');
    const savedWeight = localStorage.getItem('calori_weight');
    const savedHabits = localStorage.getItem('calori_habits');
    const savedPlan = localStorage.getItem('calori_training_plan');
    const savedWorkouts = localStorage.getItem('calori_workouts');
    const savedWater = localStorage.getItem('calori_water');
    const savedReminders = localStorage.getItem('calori_reminders');
    const savedSettings = localStorage.getItem('calori_settings');

    if (savedAuth) setAuthUser(JSON.parse(savedAuth));
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedWeight) setWeightLogs(JSON.parse(savedWeight));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedPlan) setTrainingPlan(JSON.parse(savedPlan));
    if (savedWorkouts) setWorkoutSessions(JSON.parse(savedWorkouts));
    if (savedWater) setWaterLogs(JSON.parse(savedWater));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setReminderSettings(settings);
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (authUser) localStorage.setItem('calori_auth', JSON.stringify(authUser));
    if (profile) localStorage.setItem('calori_profile', JSON.stringify(profile));
    localStorage.setItem('calori_meals', JSON.stringify(meals));
    localStorage.setItem('calori_weight', JSON.stringify(weightLogs));
    localStorage.setItem('calori_habits', JSON.stringify(habits));
    localStorage.setItem('calori_workouts', JSON.stringify(workoutSessions));
    localStorage.setItem('calori_water', JSON.stringify(waterLogs));
    localStorage.setItem('calori_reminders', JSON.stringify(reminders));
    localStorage.setItem('calori_settings', JSON.stringify(reminderSettings));
    if (trainingPlan) localStorage.setItem('calori_training_plan', JSON.stringify(trainingPlan));

    if (reminderSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [authUser, profile, meals, weightLogs, habits, trainingPlan, workoutSessions, waterLogs, reminders, reminderSettings]);

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    // Add initial weight log
    const initialLog: WeightLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user1',
      weight: newProfile.weight,
      timestamp: Date.now()
    };
    setWeightLogs([initialLog]);
  };

  const handleLogMeal = (mealData: Partial<Meal>) => {
    const newMeal: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'user1',
      foodName: mealData.foodName || 'Unknown Food',
      calories: mealData.calories || 0,
      protein: mealData.protein || 0,
      carbs: mealData.carbs || 0,
      fats: mealData.fats || 0,
      mealType: mealData.mealType || 'lunch',
      timestamp: mealData.timestamp || Date.now(),
      portionSize: mealData.portionSize || '1 serving'
    };
    setMeals([...meals, newMeal]);
  };

  const handleToggleHabit = (habit: Habit) => {
    const existingIndex = habits.findIndex(h => h.name === habit.name && h.date === habit.date);
    if (existingIndex > -1) {
      const newHabits = [...habits];
      newHabits[existingIndex].completed = habit.completed;
      setHabits(newHabits);
    } else {
      setHabits([...habits, { ...habit, id: Math.random().toString(36).substr(2, 9), userId: 'user1' }]);
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    setProfile(null);
    localStorage.removeItem('calori_auth');
    localStorage.removeItem('calori_profile');
    setActiveTab('dashboard');
  };

  if (!authUser) {
    return <Auth onAuthComplete={setAuthUser} theme={reminderSettings.theme} />;
  }

  if (!profile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            profile={profile} 
            meals={meals} 
            weightLogs={weightLogs} 
            workoutSessions={workoutSessions}
            waterLogs={waterLogs}
            onAddMeal={() => setIsLoggingMeal(true)} 
            onScanMeal={() => setIsScanningMeal(true)}
            onNavigate={setActiveTab}
          />
        );
      case 'meals':
        return (
          <Meals 
            meals={meals} 
            onAddClick={() => setIsLoggingMeal(true)} 
            onScanClick={() => setIsScanningMeal(true)} 
          />
        );
      case 'intelligence':
        const baseTarget = CalorieEngine.calculateTargetCalories(profile);
        const adjustment = CalorieEngine.calculateAdaptiveAdjustment(profile, weightLogs, meals);
        const adaptiveTarget = baseTarget + adjustment;
        
        const today = new Date().setHours(0, 0, 0, 0);
        const consumed = meals.filter(m => new Date(m.timestamp).setHours(0, 0, 0, 0) === today).reduce((acc, m) => acc + m.calories, 0);
        
        return (
          <AIIntelligence 
            profile={profile} 
            meals={meals} 
            weightLogs={weightLogs} 
            remainingCalories={Math.max(0, adaptiveTarget - consumed)}
          />
        );
      case 'rewards':
        return (
          <Gamification 
            profile={profile} 
            meals={meals} 
            habits={habits} 
          />
        );
      case 'training':
        return (
          <TrainingPlan 
            profile={profile} 
            plan={trainingPlan} 
            onPlanGenerated={setTrainingPlan} 
          />
        );
      case 'coach':
        return <NutritionistChat profile={profile} meals={meals} />;
      case 'goals':
        return <Goals profile={profile} weightLogs={weightLogs} />;
      case 'habits':
        return <Habits habits={habits} onToggle={handleToggleHabit} />;
      case 'reminders':
        return (
          <ReminderSystem 
            reminders={reminders} 
            settings={reminderSettings} 
            profile={profile}
            onAdd={(r) => setReminders([...reminders, { ...r, id: Math.random().toString(36).substr(2, 9), userId: profile.id, timestamp: Date.now(), status: 'pending' }])}
            onUpdate={(r) => setReminders(reminders.map(rem => rem.id === r.id ? r : rem))}
            onDelete={(id) => setReminders(reminders.filter(r => r.id !== id))}
          />
        );
      case 'settings':
        return <Settings settings={reminderSettings} onUpdate={setReminderSettings} />;
      case 'profile':
        return <Profile profile={profile} onLogout={handleLogout} onUpgradeClick={() => setShowPricing(true)} />;
      default:
        return (
          <Dashboard 
            profile={profile} 
            meals={meals} 
            weightLogs={weightLogs} 
            workoutSessions={workoutSessions}
            waterLogs={waterLogs}
            onAddMeal={() => setIsLoggingMeal(true)} 
            onScanMeal={() => setIsScanningMeal(true)}
            onNavigate={setActiveTab}
          />
        );
    }
  };

  if (showPricing) {
    return (
      <Pricing 
        currentPlan={profile.subscription} 
        onUpgrade={(plan) => {
          setProfile({ ...profile, subscription: plan });
          setShowPricing(false);
        }}
        onBack={() => setShowPricing(false)}
      />
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      theme={reminderSettings.theme}
      onThemeToggle={() => setReminderSettings({ ...reminderSettings, theme: reminderSettings.theme === 'dark' ? 'light' : 'dark' })}
    >
      {renderContent()}
      
      <AIVoiceAgent 
        settings={reminderSettings} 
        profile={profile} 
        onCommand={(cmd) => console.log("Voice Command:", cmd)}
      />

      <AnimatePresence>
        {isLoggingMeal && (
          <LogMeal 
            onLog={handleLogMeal} 
            onClose={() => setIsLoggingMeal(false)} 
          />
        )}
        {isScanningMeal && (
          <FoodScanner 
            onSave={handleLogMeal} 
            onClose={() => setIsScanningMeal(false)} 
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}

