export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  nationality?: string;
  weight: number; // in kg
  height?: number; // in cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'gain' | 'maintain';
  targetWeight?: number;
  weeklyGoal?: number; // e.g., 0.5kg per week
  points: number;
  level: number;
  badges: string[];
  subscription: 'Free' | 'Basic' | 'Pro' | 'Elite';
}

export interface Meal {
  id: string;
  userId: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: number;
  portionSize: string;
}

export interface WeightLog {
  id: string;
  userId: string;
  weight: number;
  timestamp: number;
}

export interface WaterLog {
  id: string;
  userId: string;
  amount: number; // in ml
  timestamp: number;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export interface Goal {
  userId: string;
  goalType: 'lose' | 'gain' | 'maintain';
  startWeight: number;
  targetWeight: number;
  startDate: number;
  targetDate?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  points: number;
  completed: boolean;
  progress: number;
  target: number;
  unit: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface Workout {
  day: string;
  title: string;
  exercises: Exercise[];
  duration: string;
  intensity: 'Low' | 'Medium' | 'High';
}

export interface TrainingPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  workouts: Workout[];
  createdAt: number;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  title: string;
  caloriesBurned: number;
  duration: number; // in minutes
  timestamp: number;
  intensity: 'Low' | 'Medium' | 'High';
}

export interface Reminder {
  id: string;
  userId: string;
  task: string;
  time: string; // HH:mm
  frequency: 'once' | 'daily' | 'weekly';
  type: 'voice' | 'notification' | 'both';
  status: 'pending' | 'completed' | 'missed' | 'snoozed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timestamp: number;
  linkedGoalId?: string;
  lastTriggered?: number;
  subTasks?: { id: string; task: string; completed: boolean }[];
}

export interface ReminderSettings {
  theme: 'light' | 'dark';
  notifications: {
    enabled: boolean;
    voiceEnabled: boolean;
    vibration: boolean;
    intensity: 'Low' | 'Medium' | 'High';
    urgencyLevels: boolean;
  };
  behavior: {
    snoozeDuration: number; // minutes
    autoReschedule: boolean;
    maxReminders: number;
    quietHours: { start: string; end: string };
    escalationLogic: boolean;
  };
  scheduling: {
    autoScheduling: boolean;
    priorityBased: boolean;
    timeOptimization: boolean;
  };
  goals: {
    autoBreakdown: boolean;
    difficultyAdjustment: boolean;
    weeklyRegeneration: boolean;
    habitTracking: boolean;
  };
  ai: {
    smartRescheduling: boolean;
    suggestionEngine: boolean;
    suggestionFocus: ('nutrition' | 'training' | 'lifestyle' | 'mindset')[];
    dailySummary: boolean;
    motivationMessages: boolean;
    motivationFrequency: 'low' | 'medium' | 'high';
    motivationStyle: 'gentle' | 'firm' | 'extreme';
    mode: 'Strict Coach' | 'Smart Assistant' | 'Motivational Trainer' | 'Passive Observer';
  };
  progress: {
    habitTracking: boolean;
    goalTracking: boolean;
    weeklyReports: boolean;
    streakTracking: boolean;
    achievementBadges: boolean;
  };
  voice: {
    enabled: boolean;
    agentName: string;
    wakePhrase: string;
    language: 'Arabic' | 'Chinese' | 'English' | 'French' | 'German' | 'Hindi' | 'Italian' | 'Japanese' | 'Korean' | 'Portuguese' | 'Russian' | 'Spanish' | 'Swahili';
    speed: 'Slow' | 'Normal' | 'Fast';
    gender: 'male' | 'female';
    tone: 'calm' | 'motivational' | 'strict';
    personality: 'Professional' | 'Friendly' | 'Robotic' | 'Energetic';
  };
  privacy: {
    storeVoice: boolean;
    syncAcrossDevices: boolean;
    longTermMemory: boolean;
  };
}
