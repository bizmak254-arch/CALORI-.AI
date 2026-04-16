import { UserProfile, WeightLog, Meal } from '../types';

/**
 * CALORIE CALCULATOR ENGINE
 * Calculates BMR and TDEE based on user profile
 */
export class CalorieEngine {
  /**
   * Calculates Basal Metabolic Rate using Mifflin-St Jeor Equation
   */
  static calculateBMR(profile: UserProfile): number {
    const { weight, height, age, gender } = profile;
    // Use average height if not provided (175cm for male, 162cm for female)
    const effectiveHeight = height || (gender === 'male' ? 175 : 162);
    
    if (gender === 'male') {
      return 10 * weight + 6.25 * effectiveHeight - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * effectiveHeight - 5 * age - 161;
    }
  }

  /**
   * Calculates Total Daily Energy Expenditure
   */
  static calculateTDEE(profile: UserProfile): number {
    const bmr = this.calculateBMR(profile);
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    return bmr * activityMultipliers[profile.activityLevel];
  }

  /**
   * Calculates target calories based on goal
   */
  static calculateTargetCalories(profile: UserProfile): number {
    const tdee = this.calculateTDEE(profile);
    const { goal, weeklyGoal = 0.5 } = profile;

    // 1kg of fat is roughly 7700 calories
    // 0.5kg/week deficit is ~550 calories/day
    const dailyAdjustment = (weeklyGoal * 7700) / 7;

    if (goal === 'lose') {
      return Math.max(1200, tdee - dailyAdjustment);
    } else if (goal === 'gain') {
      return tdee + dailyAdjustment;
    }
    return tdee;
  }

  /**
   * Calculates macronutrient targets
   * Standard balanced ratio: 30% Protein, 40% Carbs, 30% Fats
   */
  static calculateMacroTargets(targetCalories: number) {
    return {
      protein: (targetCalories * 0.3) / 4, // 4 cal per gram
      carbs: (targetCalories * 0.4) / 4,   // 4 cal per gram
      fats: (targetCalories * 0.3) / 9,    // 9 cal per gram
    };
  }

  /**
   * Adaptive Calorie Adjustment
   * Adjusts targets based on actual weight change vs expected weight change
   */
  static calculateAdaptiveAdjustment(profile: UserProfile, weightLogs: WeightLog[], meals: Meal[]) {
    if (weightLogs.length < 7) return 0; // Need at least a week of data

    const sortedLogs = [...weightLogs].sort((a, b) => b.timestamp - a.timestamp);
    const latestWeight = sortedLogs[0].weight;
    const weekAgoWeight = sortedLogs.find(l => l.timestamp <= Date.now() - 7 * 24 * 60 * 60 * 1000)?.weight || sortedLogs[sortedLogs.length - 1].weight;
    
    const actualChange = latestWeight - weekAgoWeight;
    
    // Calculate expected change based on calorie deficit/surplus
    // 7700 calories roughly equals 1kg
    const bmr = this.calculateBMR(profile);
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const tdee = bmr * activityMultipliers[profile.activityLevel];
    
    const last7Days = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentMeals = meals.filter(m => m.timestamp >= last7Days);
    const avgDailyIntake = recentMeals.reduce((acc, m) => acc + m.calories, 0) / 7;
    
    const expectedDailyDeficit = tdee - avgDailyIntake;
    const expectedWeeklyChange = -(expectedDailyDeficit * 7) / 7700;

    // If actual change is significantly different from expected, suggest adjustment
    const variance = actualChange - expectedWeeklyChange;
    
    if (Math.abs(variance) > 0.2) { // More than 200g variance
      // Suggest adjusting daily target by 100-200 calories to compensate
      return variance > 0 ? -150 : 150; 
    }

    return 0;
  }
}
