import { GoogleGenAI } from "@google/genai";
import { Reminder, ReminderSettings, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export class AgentEngine {
  /**
   * Understand: Extracts intent and structured data from natural language input.
   */
  static async understand(input: string, settings: ReminderSettings): Promise<Partial<Reminder>> {
    const prompt = `
      Extract task, time (HH:mm), and frequency (once, daily, weekly) from this input: "${input}".
      Return ONLY a JSON object like: {"task": "...", "time": "...", "frequency": "..."}.
      If no time is specified, suggest a logical one based on the task.
      Current behavior mode: ${settings.ai.mode}.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      const text = response.text || "{}";
      const jsonStr = text.match(/\{.*\}/s)?.[0] || "{}";
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("AI Understand Error:", error);
      return { task: input, time: "09:00", frequency: "once" };
    }
  }

  /**
   * Plan: Breaks a large goal into smaller, manageable tasks.
   */
  static async plan(goal: string, profile: UserProfile): Promise<{ task: string; time: string }[]> {
    const prompt = `
      Break down this fitness/productivity goal into 3-5 small, actionable daily tasks for a user with these stats:
      Goal: ${goal}
      User Activity Level: ${profile.activityLevel}
      User Goal: ${profile.goal}
      Return ONLY a JSON array of objects like: [{"task": "...", "time": "HH:mm"}].
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      const text = response.text || "[]";
      const jsonStr = text.match(/\[.*\]/s)?.[0] || "[]";
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("AI Plan Error:", error);
      return [];
    }
  }

  /**
   * Adapt: Adjusts future plans based on completion history.
   */
  static async adapt(reminders: Reminder[], settings: ReminderSettings): Promise<string> {
    const completed = reminders.filter(r => r.status === 'completed').length;
    const total = reminders.length;
    const rate = total > 0 ? (completed / total) * 100 : 0;

    const prompt = `
      Analyze this user's productivity performance:
      Completion Rate: ${rate}%
      Tasks: ${reminders.map(r => `${r.task} (${r.status})`).join(", ")}
      AI Mode: ${settings.ai.mode}
      Agent Name: ${settings.voice.agentName}
      Motivation Style: ${settings.ai.motivationStyle}
      Provide a short (2 sentence) motivational or corrective feedback message as the AI agent.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      return response.text || "Keep pushing towards your goals! Consistency is key.";
    } catch (error) {
      console.error("AI Adapt Error:", error);
      return "Keep pushing towards your goals! Consistency is key.";
    }
  }

  /**
   * Get Motivation: Generates a standalone motivational message.
   */
  static async getMotivation(profile: UserProfile, settings: ReminderSettings): Promise<string> {
    const prompt = `
      Generate a highly personalized motivational message for ${profile.name.split(' ')[0]}.
      Goal: ${profile.goal}
      Current Level: ${profile.level}
      AI Mode: ${settings.ai.mode}
      Agent Name: ${settings.voice.agentName}
      Motivation Style: ${settings.ai.motivationStyle} (gentle, firm, or extreme)
      Tone: ${settings.voice.tone}
      Keep it under 20 words.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      return response.text || "You've got this! Every step counts.";
    } catch (error) {
      console.error("AI Motivation Error:", error);
      return "Keep pushing! You're doing great.";
    }
  }

  /**
   * Get Suggestions: Generates actionable tips based on focus areas.
   */
  static async getSuggestions(profile: UserProfile, settings: ReminderSettings): Promise<string[]> {
    const prompt = `
      Provide 3 quick, actionable health/productivity tips for ${profile.name.split(' ')[0]}.
      Focus Areas: ${settings.ai.suggestionFocus.join(", ")}
      User Goal: ${profile.goal}
      Return ONLY a JSON array of strings.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      const text = response.text || "[]";
      const jsonStr = text.match(/\[.*\]/s)?.[0] || "[]";
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("AI Suggestions Error:", error);
      return ["Stay hydrated!", "Take a 5-minute break.", "Review your goals."];
    }
  }
}
