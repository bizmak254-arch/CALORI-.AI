import { UserProfile, WeightLog } from '../types';
import { addDays, differenceInDays } from 'date-fns';

export class GoalEngine {
  static calculateWeightProgress(profile: UserProfile, logs: WeightLog[]): number {
    if (logs.length < 1 || !profile.targetWeight) return 0;
    
    const startWeight = logs[0].weight;
    const currentWeight = logs[logs.length - 1].weight;
    const targetWeight = profile.targetWeight;
    
    const totalToLose = Math.abs(startWeight - targetWeight);
    const lostSoFar = Math.abs(startWeight - currentWeight);
    
    if (totalToLose === 0) return 100;
    return Math.min(100, Math.round((lostSoFar / totalToLose) * 100));
  }

  static estimateCompletionDate(profile: UserProfile, logs: WeightLog[]): string {
    if (logs.length < 2 || !profile.targetWeight || !profile.weeklyGoal) return 'TBD';
    
    const currentWeight = logs[logs.length - 1].weight;
    const targetWeight = profile.targetWeight;
    const remainingWeight = Math.abs(currentWeight - targetWeight);
    
    const weeksRemaining = remainingWeight / profile.weeklyGoal;
    const daysRemaining = Math.round(weeksRemaining * 7);
    
    const completionDate = addDays(new Date(), daysRemaining);
    return completionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  static getStatus(profile: UserProfile, logs: WeightLog[]): 'On Track' | 'At Risk' | 'Behind' {
    if (logs.length < 2 || !profile.weeklyGoal) return 'On Track';
    
    const lastLog = logs[logs.length - 1];
    const firstLog = logs[0];
    const daysDiff = differenceInDays(new Date(lastLog.timestamp), new Date(firstLog.timestamp));
    
    if (daysDiff === 0) return 'On Track';
    
    const actualLossPerDay = (firstLog.weight - lastLog.weight) / daysDiff;
    const targetLossPerDay = profile.weeklyGoal / 7;
    
    if (actualLossPerDay >= targetLossPerDay) return 'On Track';
    if (actualLossPerDay >= targetLossPerDay * 0.7) return 'At Risk';
    return 'Behind';
  }
}
