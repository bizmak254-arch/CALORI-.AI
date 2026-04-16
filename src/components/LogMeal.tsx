import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Loader2, X, Check, Mic, MicOff } from 'lucide-react';
import { AIService } from '../services/aiService';
import { Meal } from '../types';
import { cn } from '../lib/utils';

interface LogMealProps {
  onLog: (meal: Partial<Meal>) => void;
  onClose: () => void;
}

export default function LogMeal({ onLog, onClose }: LogMealProps) {
  const [description, setDescription] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [mealType, setMealType] = useState<Meal['mealType']>('lunch');

  const mealTypes: { id: Meal['mealType']; label: string }[] = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snack' },
  ];

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.start();
  };

  const handleEstimate = async () => {
    if (!description.trim()) return;
    setIsEstimating(true);
    const result = await AIService.estimateNutrition(description);
    setEstimate(result);
    setIsEstimating(false);
  };

  const handleConfirm = () => {
    if (estimate) {
      onLog({
        foodName: estimate.foodName,
        calories: estimate.calories,
        protein: estimate.protein,
        carbs: estimate.carbs,
        fats: estimate.fats,
        portionSize: estimate.portionSize,
        mealType: mealType,
        timestamp: Date.now()
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full max-w-md rounded-t-[32px] bg-neutral-900 p-6 pb-12 shadow-2xl border-t border-neutral-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white uppercase tracking-widest">Log a Meal</h2>
          <button onClick={onClose} className="rounded-full bg-neutral-800 p-2 text-neutral-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Meal Type</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {mealTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setMealType(type.id)}
                  className={cn(
                    "whitespace-nowrap rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all",
                    mealType === type.id 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
                      : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              placeholder="Describe your meal (e.g., 'Grilled chicken salad with avocado and balsamic dressing')"
              className="h-32 w-full rounded-2xl border border-neutral-800 bg-black p-4 pt-4 pr-12 focus:border-blue-500 focus:outline-none resize-none text-sm leading-relaxed text-white placeholder:text-neutral-700"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={startListening}
                className={cn(
                  "rounded-xl p-2 transition-all active:scale-95",
                  isListening ? "bg-red-500 text-white animate-pulse" : "bg-neutral-800 text-neutral-500"
                )}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <button
                onClick={handleEstimate}
                disabled={isEstimating || !description.trim()}
                className="rounded-xl bg-blue-600 p-2 text-white shadow-lg shadow-blue-900/40 disabled:opacity-50 transition-transform active:scale-95"
              >
                {isEstimating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {estimate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl bg-black p-4 border border-neutral-800 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-white uppercase tracking-wider">{estimate.foodName}</h3>
                      <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">{estimate.portionSize}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-blue-500">{estimate.calories}</p>
                      <p className="text-[10px] font-black uppercase text-neutral-600">Calories</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-neutral-900 p-2 text-center border border-neutral-800">
                      <p className="text-xs font-black text-white">{estimate.protein}g</p>
                      <p className="text-[10px] font-black text-neutral-500 uppercase">Protein</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-2 text-center border border-neutral-800">
                      <p className="text-xs font-black text-white">{estimate.carbs}g</p>
                      <p className="text-[10px] font-black text-neutral-500 uppercase">Carbs</p>
                    </div>
                    <div className="rounded-xl bg-neutral-900 p-2 text-center border border-neutral-800">
                      <p className="text-xs font-black text-white">{estimate.fats}g</p>
                      <p className="text-[10px] font-black text-neutral-500 uppercase">Fats</p>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirm}
                    className="w-full rounded-xl bg-blue-600 py-3 font-black uppercase tracking-widest text-xs text-white flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-900/20"
                  >
                    <Check className="h-4 w-4" />
                    <span>Confirm & Log</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!estimate && !isEstimating && (
            <div className="text-center py-4">
              <p className="text-xs text-neutral-400 font-medium italic">
                "AI will estimate nutrition based on your description"
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
