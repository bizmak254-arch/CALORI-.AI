import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Clock, ChevronRight, Plus, Camera } from 'lucide-react';
import { Meal } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

interface MealsProps {
  meals: Meal[];
  onAddClick: () => void;
  onScanClick: () => void;
}

export default function Meals({ meals, onAddClick, onScanClick }: MealsProps) {
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  
  const mealsByDate = meals.reduce((acc, meal) => {
    const date = format(new Date(meal.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

  const sortedDates = Object.keys(mealsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 group">
        <img 
          src="input_file_2.png" 
          alt="Healthy Food" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 w-full pt-12">
          <h1 className="text-2xl font-black text-white tracking-tight">Nutrition Log</h1>
          <p className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Fuel your performance</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500 font-display">Meal History</h2>
        <div className="flex gap-3">
          <button 
            onClick={onScanClick}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-900/40 active:scale-95 transition-transform"
          >
            <Camera className="h-4 w-4" />
            Scan
          </button>
          <button 
            onClick={onAddClick}
            className="flex items-center gap-2 rounded-xl bg-neutral-800 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-400 shadow-xl border border-neutral-700 active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="rounded-3xl bg-neutral-900 p-12 text-center border border-dashed border-neutral-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-neutral-700">
            <Utensils className="h-8 w-8" />
          </div>
          <p className="text-sm font-bold text-neutral-500">No meals logged yet.</p>
          <button 
            onClick={onAddClick}
            className="mt-4 text-sm font-black text-blue-500 uppercase tracking-widest"
          >
            Log your first meal
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-1">
                {format(new Date(date), 'EEEE, MMM d')}
              </h3>
              <div className="space-y-2">
                {mealsByDate[date].sort((a, b) => b.timestamp - a.timestamp).map((meal) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-neutral-900 p-4 shadow-sm border border-neutral-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src={`https://picsum.photos/seed/${meal.foodName.replace(/\s+/g, '').toLowerCase()}/100/100`}
                          alt={meal.foodName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className={cn(
                          "absolute inset-0 opacity-40",
                          meal.mealType === 'breakfast' ? "bg-yellow-500" :
                          meal.mealType === 'lunch' ? "bg-blue-500" :
                          meal.mealType === 'dinner' ? "bg-indigo-500" :
                          "bg-purple-500"
                        )} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Utensils className="h-4 w-4 text-white drop-shadow-md" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{meal.foodName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-neutral-500">{meal.mealType}</span>
                          <span className="h-1 w-1 rounded-full bg-neutral-800" />
                          <span className="text-[10px] font-bold text-neutral-600">{format(new Date(meal.timestamp), 'h:mm a')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-white">{meal.calories}</p>
                      <p className="text-[10px] font-black uppercase text-neutral-500">kcal</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
