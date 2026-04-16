import { WorkoutSession } from '../types';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export class TrainingEngine {
  static calculateWeeklyWorkouts(sessions: WorkoutSession[]): number {
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    
    return sessions.filter(s => 
      isWithinInterval(new Date(s.timestamp), { start, end })
    ).length;
  }

  static calculateWeeklyCaloriesBurned(sessions: WorkoutSession[]): number {
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    
    return sessions
      .filter(s => isWithinInterval(new Date(s.timestamp), { start, end }))
      .reduce((acc, s) => acc + s.caloriesBurned, 0);
  }

  static calculateStreak(sessions: WorkoutSession[]): number {
    if (sessions.length === 0) return 0;
    
    const sortedSessions = [...sessions].sort((a, b) => b.timestamp - a.timestamp);
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if there's a workout today or yesterday to continue streak
    const lastSessionDate = new Date(sortedSessions[0].timestamp);
    lastSessionDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((currentDate.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return 0;

    const seenDates = new Set();
    for (const session of sortedSessions) {
      const date = new Date(session.timestamp);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString();
      
      if (seenDates.has(dateStr)) continue;
      
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(currentDate.getDate() - streak);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (date.getTime() === expectedDate.getTime()) {
        streak++;
        seenDates.add(dateStr);
      } else if (date.getTime() < expectedDate.getTime()) {
        break;
      }
    }
    
    return streak;
  }

  static calculateConsistencyScore(sessions: WorkoutSession[], targetPerWeek: number = 4): number {
    const weeklyCount = this.calculateWeeklyWorkouts(sessions);
    return Math.min(100, Math.round((weeklyCount / targetPerWeek) * 100));
  }
}
