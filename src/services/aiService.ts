import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class AIService {
  /**
   * AI Food Scanner - Multimodal analysis
   */
  static async scanFoodImage(base64Image: string) {
    const prompt = `
      Analyze this food image and provide a detailed nutritional breakdown.
      1. Identify all food items in the image.
      2. Estimate the portion size for each item.
      3. Calculate total calories, protein, carbs, and fats.
      
      Return the data in the following JSON format:
      {
        "foodName": "Main items found (e.g. Grilled Chicken with Salad)",
        "calories": number,
        "protein": number,
        "carbs": number,
        "fats": number,
        "items": [
          { "name": "item name", "portion": "estimated portion", "calories": number }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  portion: { type: Type.STRING },
                  calories: { type: Type.NUMBER }
                }
              }
            }
          },
          required: ["foodName", "calories", "protein", "carbs", "fats", "items"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse scanner response", e);
      return null;
    }
  }

  /**
   * Behavior Intelligence & Pattern Detection
   */
  static async analyzeBehavior(userData: any, meals: any[], weightLogs: any[]) {
    const prompt = `
      Analyze the following user data for behavioral patterns:
      User Profile: ${JSON.stringify(userData)}
      Meals (Last 30 days): ${JSON.stringify(meals)}
      Weight Logs: ${JSON.stringify(weightLogs)}
      
      Identify:
      1. Meal skipping patterns (e.g. "Skips breakfast 40% of the time").
      2. Time-based overeating (e.g. "Consumes 60% of calories after 8 PM").
      3. Macro imbalances (e.g. "Protein intake is consistently 20% below target").
      4. Weekend vs Weekday variance.
      
      Return a JSON object:
      {
        "patterns": [{ "title": string, "description": string, "impact": "positive" | "negative" | "neutral" }],
        "healthScore": number (0-100),
        "recommendations": [string]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patterns: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING, enum: ["positive", "negative", "neutral"] }
                }
              }
            },
            healthScore: { type: Type.NUMBER },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return null;
    }
  }

  /**
   * Smart Meal Recommendations
   */
  static async getSmartRecommendations(userData: any, remainingCalories: number, remainingMacros: any) {
    const prompt = `
      Suggest 3 meal options for a user with:
      Remaining Calories: ${remainingCalories}
      Remaining Macros: ${JSON.stringify(remainingMacros)}
      Goal: ${userData.goal}
      
      Suggestions should be realistic, healthy, and fit the remaining budget.
      Return JSON:
      {
        "suggestions": [
          { "name": string, "calories": number, "protein": number, "carbs": number, "fats": number, "why": string }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fats: { type: Type.NUMBER },
                  why: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return null;
    }
  }

  /**
   * Estimates nutrition from a text description of a meal
   */
  static async estimateNutrition(mealDescription: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Estimate the calories, protein, carbs, and fats for the following meal description: "${mealDescription}". Provide a single best estimate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
            portionSize: { type: Type.STRING }
          },
          required: ["foodName", "calories", "protein", "carbs", "fats", "portionSize"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return null;
    }
  }

  /**
   * Provides health coaching insights based on user data
   */
  static async getCoachingInsights(userData: any, recentMeals: any[], recentWeight: any[]) {
    const prompt = `
      User Profile: ${JSON.stringify(userData)}
      Recent Meals: ${JSON.stringify(recentMeals)}
      Recent Weight Logs: ${JSON.stringify(recentWeight)}
      
      As an AI Health Coach for CALORI AI, provide 3 concise, actionable insights or motivational messages.
      Focus on patterns, improvements, or warnings.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, enum: ["insight", "motivation", "warning"] },
              message: { type: Type.STRING }
            },
            required: ["type", "message"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return [];
    }
  }

  /**
   * Predicts goal completion based on behavior
   */
  static async predictGoalOutcome(userData: any, progressData: any) {
    const prompt = `
      User Goal: ${userData.goal}
      Target Weight: ${userData.targetWeight}
      Current Progress: ${JSON.stringify(progressData)}
      
      Predict the likelihood of reaching the goal on time and provide a brief forecast.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            likelihood: { type: Type.STRING, enum: ["high", "medium", "low"] },
            predictedDate: { type: Type.STRING },
            forecast: { type: Type.STRING }
          },
          required: ["likelihood", "predictedDate", "forecast"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse AI response", e);
      return null;
    }
  }

  /**
   * AI Nutritionist Chat
   */
  static async chatWithNutritionist(message: string, history: any[], userData: any, recentMeals: any[]) {
    const today = new Date().toLocaleDateString();
    const systemInstruction = `
      You are a professional AI Nutritionist for CALORI AI. 
      Today's Date: ${today}
      User Profile: ${JSON.stringify(userData)}
      Recent Meals (last 10): ${JSON.stringify(recentMeals)}
      
      Your goal is to provide expert, evidence-based nutrition advice that is highly personalized to the user's specific logs and goals.
      
      Guidelines:
      1. Be encouraging, professional, and concise.
      2. Use Markdown for formatting (bolding, lists, etc.) to make advice readable.
      3. If the user asks for a meal plan, suggest one that fits their daily calorie target and macro balance.
      4. Always refer to their recent logs. For example: "I see you had ${recentMeals[0]?.foodName || 'a meal'} recently, which was a great choice for protein."
      5. If they are over their limit, suggest low-calorie, high-volume foods (like leafy greens, berries).
      6. If they are under, suggest nutrient-dense additions.
      7. Focus on long-term sustainability, not crash dieting.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }]
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text;
  }

  /**
   * Generates a personalized motivational message
   */
  static async getMotivationalMessage(userData: any, progress: any) {
    const prompt = `
      User: ${userData.name}
      Goal: ${userData.goal}
      Current Progress: ${JSON.stringify(progress)}
      
      Generate a short, punchy, and highly motivational message for this user. 
      Use their name and be specific about their progress or goal.
      Keep it under 15 words.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text.trim();
  }

  /**
   * Generates a personalized training plan
   */
  static async generateTrainingPlan(userData: any) {
    const prompt = `
      Generate a personalized 7-day training plan for a user with the following profile:
      User Profile: ${JSON.stringify(userData)}
      
      The plan should include:
      1. A name for the plan.
      2. A brief description.
      3. 7 daily workouts (including rest days).
      
      Each workout should have:
      - Day (e.g., "Monday")
      - Title (e.g., "Upper Body Strength")
      - Exercises (list of objects with name, sets, reps, rest)
      - Duration (e.g., "45 mins")
      - Intensity (Low, Medium, High)
      
      Return JSON:
      {
        "name": string,
        "description": string,
        "workouts": [
          {
            "day": string,
            "title": string,
            "exercises": [{ "name": string, "sets": number, "reps": string, "rest": string }],
            "duration": string,
            "intensity": "Low" | "Medium" | "High"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            workouts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  title: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.NUMBER },
                        reps: { type: Type.STRING },
                        rest: { type: Type.STRING }
                      }
                    }
                  },
                  duration: { type: Type.STRING },
                  intensity: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
                }
              }
            }
          }
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return null;
    }
  }
}
