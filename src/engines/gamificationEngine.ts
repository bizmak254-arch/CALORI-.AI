import { UserProfile, Challenge, Meal, Habit } from '../types';

export class GamificationEngine {
  static calculateLevel(points: number): number {
    return Math.floor(Math.sqrt(points / 100)) + 1;
  }

  static getPointsToNextLevel(points: number): number {
    const currentLevel = this.calculateLevel(points);
    const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
    return nextLevelPoints - points;
  }

  static generateDailyChallenges(profile: UserProfile, meals: Meal[], habits: Habit[]): Challenge[] {
    const today = new Date().setHours(0, 0, 0, 0);
    const todaysMeals = meals.filter(m => new Date(m.timestamp).setHours(0, 0, 0, 0) === today);
    
    const challenges: Challenge[] = [
      {
        id: 'log_3_meals',
        title: 'Meal Master',
        description: 'Log at least 3 meals today',
        type: 'daily',
        points: 50,
        completed: todaysMeals.length >= 3,
        progress: todaysMeals.length,
        target: 3,
        unit: 'meals'
      },
      {
        id: 'protein_target',
        title: 'Protein Power',
        description: 'Reach 80% of your protein target',
        type: 'daily',
        points: 75,
        completed: false, // Logic would go here
        progress: 0,
        target: 80,
        unit: '%'
      },
      {
        id: 'habit_streak',
        title: 'Consistency King',
        description: 'Complete all your daily habits',
        type: 'daily',
        points: 100,
        completed: false,
        progress: 0,
        target: 1,
        unit: 'set'
      }
    ];

    return challenges;
  }

  static checkBadges(profile: UserProfile, meals: Meal[], weightLogs: any[]): string[] {
    const newBadges: string[] = [...(profile.badges || [])];
    
    if (meals.length >= 10 && !newBadges.includes('Early Logger')) {
      newBadges.push('Early Logger');
    }
    
    if (meals.length >= 100 && !newBadges.includes('Meal Veteran')) {
      newBadges.push('Meal Veteran');
    }

    if (weightLogs.length >= 5 && !newBadges.includes('Weight Watcher')) {
      newBadges.push('Weight Watcher');
    }

    return newBadges;
  }
}
