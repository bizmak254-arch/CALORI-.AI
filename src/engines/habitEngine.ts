import { Habit } from '../types';
import { startOfDay, subDays, isSameDay } from 'date-fns';

/**
 * HABIT TRACKING ENGINE
 * Calculates streaks and consistency scores
 */
export class HabitEngine {
  static calculateStreak(habits: Habit[]): number {
    if (habits.length === 0) return 0;

    const sortedHabits = [...habits]
      .filter(h => h.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedHabits.length === 0) return 0;

    let streak = 0;
    let currentDate = startOfDay(new Date());

    // Check if there's a completion today or yesterday to keep streak alive
    const lastCompletion = new Date(sortedHabits[0].date);
    if (!isSameDay(lastCompletion, currentDate) && !isSameDay(lastCompletion, subDays(currentDate, 1))) {
      return 0;
    }

    for (let i = 0; i < sortedHabits.length; i++) {
      const habitDate = startOfDay(new Date(sortedHabits[i].date));
      if (isSameDay(habitDate, currentDate)) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else if (habitDate < currentDate) {
        // Gap in streak
        break;
      }
    }

    return streak;
  }

  static calculateConsistencyScore(habits: Habit[], days: number = 30): number {
    if (habits.length === 0) return 0;
    const completedCount = habits.filter(h => h.completed).length;
    return Math.min(100, (completedCount / days) * 100);
  }
}
