import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Plus, 
  Mic, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Volume2, 
  Brain, 
  TrendingUp, 
  Trash2,
  Play,
  Pause,
  RotateCcw,
  MessageSquare,
  Sparkles,
  Zap,
  Activity,
  AlertTriangle,
  Layers,
  BarChart3
} from 'lucide-react';
import { Reminder, ReminderSettings, UserProfile } from '../types';
import { cn } from '../lib/utils';
import { AgentEngine } from '../engines/agentEngine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ReminderSystemProps {
  reminders: Reminder[];
  settings: ReminderSettings;
  profile: UserProfile;
  onAdd: (reminder: Omit<Reminder, 'id' | 'timestamp' | 'status'>) => void;
  onUpdate: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

export default function ReminderSystem({ reminders, settings, profile, onAdd, onUpdate, onDelete }: ReminderSystemProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [isPlanning, setIsPlanning] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (reminders.length > 0) {
        const feedback = await AgentEngine.adapt(reminders, settings);
        setAiFeedback(feedback);
      }
    };
    fetchFeedback();
  }, [reminders.length, settings.ai.mode]);

  const handleAddReminder = async () => {
    if (!input.trim()) return;
    
    setIsPlanning(true);
    try {
      if (settings.goals.autoBreakdown && (input.toLowerCase().includes('goal') || input.toLowerCase().includes('plan'))) {
        const tasks = await AgentEngine.plan(input, profile);
        tasks.forEach(task => {
          onAdd({
            ...task,
            frequency: 'daily',
            type: 'both',
            priority: 'Medium',
            difficulty: 'Medium',
            userId: profile.id
          });
        });
      } else {
        const parsed = await AgentEngine.understand(input, settings);
        onAdd({
          task: parsed.task || input,
          time: parsed.time || "09:00",
          frequency: parsed.frequency || 'once',
          type: 'both',
          priority: 'Medium',
          difficulty: 'Medium',
          userId: profile.id
        });
      }
    } finally {
      setIsPlanning(false);
      setInput('');
      setIsAdding(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = settings.voice.language === 'English' ? 'en-US' : 'sw-KE';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const speakReminder = (text: string) => {
    if (!settings.voice.enabled) return;
    const utterance = new SpeechSynthesisUtterance(`${settings.voice.agentName} here. ${text}`);
    utterance.rate = settings.voice.speed === 'Slow' ? 0.8 : settings.voice.speed === 'Fast' ? 1.2 : 1.0;
    utterance.pitch = settings.voice.tone === 'strict' ? 0.8 : settings.voice.tone === 'motivational' ? 1.2 : 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSubtask = (reminder: Reminder, subtaskId: string) => {
    const updatedSubtasks = reminder.subTasks?.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    ) || [];
    
    const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
    
    onUpdate({
      ...reminder,
      subTasks: updatedSubtasks,
      status: allCompleted ? 'completed' : 'pending'
    });
  };

  const handleAddSubtask = (reminder: Reminder, taskName: string) => {
    if (!taskName.trim()) return;
    const newSubtask = {
      id: Math.random().toString(36).substr(2, 9),
      task: taskName,
      completed: false
    };
    onUpdate({
      ...reminder,
      subTasks: [...(reminder.subTasks || []), newSubtask],
      status: 'pending'
    });
  };

  const completionRate = reminders.length > 0 
    ? Math.round((reminders.filter(r => r.status === 'completed').length / reminders.length) * 100)
    : 0;

  // Mock chart data
  const chartData = [
    { name: 'Mon', rate: 65 },
    { name: 'Tue', rate: 75 },
    { name: 'Wed', rate: 85 },
    { name: 'Thu', rate: 70 },
    { name: 'Fri', rate: 90 },
    { name: 'Sat', rate: 95 },
    { name: 'Sun', rate: completionRate },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-500';
      case 'High': return 'text-orange-500';
      case 'Medium': return 'text-blue-500';
      default: return 'text-neutral-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Siri-like Voice UI Overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-32 w-32 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 blur-2xl opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Mic className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="mt-12 text-2xl font-black text-white uppercase tracking-widest">Listening...</h2>
            <p className="mt-4 text-neutral-400 font-bold italic">"{input || 'What can I help you with?'}"</p>
            <button 
              onClick={() => setIsListening(false)}
              className="mt-12 px-8 py-4 rounded-2xl bg-white/10 text-white text-xs font-black uppercase tracking-widest border border-white/10"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Stats */}
      <header className="relative h-48 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
        <img 
          src="https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=1200&auto=format&fit=crop" 
          alt="AI Coach Agent" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">AI Agent: {settings.voice.agentName}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">Smart Reminders</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-xs font-black text-white uppercase tracking-widest">{completionRate}% Done</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-black text-white uppercase tracking-widest">{settings.ai.mode}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Chart */}
      <section className="bg-neutral-900 rounded-[32px] p-6 border border-neutral-800 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <h2 className="text-xs font-black uppercase tracking-widest text-neutral-400">Weekly Performance</h2>
          </div>
          <span className="text-[10px] font-black text-green-500 uppercase">+12% vs Last Week</span>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* AI Insights Card */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] p-6 text-white shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Brain className="h-24 w-24" />
        </div>
        <div className="relative z-10 flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">{settings.voice.agentName}'s Insights</p>
            <p className="text-sm font-bold leading-relaxed">
              {aiFeedback || `"Hey ${profile.name.split(' ')[0]}, I'm ${settings.voice.agentName}. You've completed ${reminders.filter(r => r.status === 'completed').length}/${reminders.length} tasks today. Great consistency!"`}
            </p>
          </div>
        </div>
      </section>

      {/* Add Reminder Input */}
      <section className="bg-neutral-900 rounded-[32px] p-6 border border-neutral-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Set a goal to lose 5kg"
              className="w-full bg-black border border-neutral-800 rounded-2xl px-6 py-4 text-white text-sm font-bold placeholder:text-neutral-600 focus:border-blue-500 transition-all"
            />
            <button 
              onClick={handleVoiceInput}
              className={cn(
                "absolute right-2 top-2 h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                isListening ? "bg-red-500 animate-pulse" : "bg-neutral-800 text-neutral-400 hover:text-white"
              )}
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>
          <button 
            onClick={handleAddReminder}
            disabled={isPlanning}
            className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all",
              isPlanning ? "bg-neutral-800" : "bg-blue-600 shadow-blue-900/40"
            )}
          >
            {isPlanning ? <RotateCcw className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
          </button>
        </div>
        {settings.goals.autoBreakdown && (
          <div className="mt-4 flex items-center gap-2 px-2">
            <Layers className="h-3 w-3 text-blue-500" />
            <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">AI Goal Breakdown Enabled</p>
          </div>
        )}
      </section>

      {/* Reminders List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-500">Active Reminders</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-[8px] font-black text-neutral-600 uppercase">Urgent</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-[8px] font-black text-neutral-600 uppercase">Normal</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {reminders.map((reminder) => (
              <motion.div 
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={cn(
                  "rounded-3xl p-5 flex items-center justify-between border transition-all relative overflow-hidden",
                  reminder.status === 'completed' ? "bg-green-500/10 border-green-500/20" : "bg-neutral-900 border-neutral-800"
                )}
              >
                {/* Urgency Indicator */}
                {settings.notifications.urgencyLevels && (
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    reminder.priority === 'Urgent' ? "bg-red-500" : 
                    reminder.priority === 'High' ? "bg-orange-500" : "bg-blue-500"
                  )} />
                )}

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onUpdate({ ...reminder, status: reminder.status === 'completed' ? 'pending' : 'completed' })}
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center transition-all border-2",
                      reminder.status === 'completed' ? "bg-green-500 border-green-400 text-white" : "bg-black border-neutral-800 text-neutral-700"
                    )}
                  >
                    <CheckCircle2 className="h-6 w-6" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={cn(
                        "text-sm font-black uppercase tracking-widest",
                        reminder.status === 'completed' ? "text-green-500 line-through opacity-50" : "text-white"
                      )}>
                        {reminder.task}
                      </h3>
                      {reminder.priority === 'Urgent' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-neutral-500" />
                        <span className="text-[10px] font-black text-neutral-500 uppercase">{reminder.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RotateCcw className="h-3 w-3 text-neutral-500" />
                        <span className="text-[10px] font-black text-neutral-500 uppercase">{reminder.frequency}</span>
                      </div>
                      {reminder.type !== 'notification' && (
                        <Volume2 className="h-3 w-3 text-blue-500" />
                      )}
                    </div>

                    {/* Subtasks Display */}
                    {reminder.subTasks && reminder.subTasks.length > 0 && (
                      <div className="mt-4 space-y-2 pl-2 border-l-2 border-neutral-800">
                        {reminder.subTasks.map((st) => (
                          <div key={st.id} className="flex items-center gap-3 group/st">
                            <button 
                              onClick={() => handleToggleSubtask(reminder, st.id)}
                              className={cn(
                                "h-5 w-5 rounded-md flex items-center justify-center border transition-all",
                                st.completed ? "bg-green-500 border-green-400 text-white" : "bg-black border-neutral-700 text-neutral-800"
                              )}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </button>
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider transition-all",
                              st.completed ? "text-green-500/50 line-through" : "text-neutral-400"
                            )}>
                              {st.task}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Subtask Input */}
                    <div className="mt-4 flex items-center gap-2">
                      <input 
                        type="text"
                        placeholder="Add subtask..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSubtask(reminder, (e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                        className="flex-1 bg-black/50 border border-neutral-800 rounded-lg px-3 py-1.5 text-[10px] font-bold text-white placeholder:text-neutral-600 focus:border-blue-500 transition-all"
                      />
                      <button 
                        onClick={(e) => {
                          const input = (e.currentTarget.previousSibling as HTMLInputElement);
                          handleAddSubtask(reminder, input.value);
                          input.value = '';
                        }}
                        className="h-7 w-7 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => speakReminder(`It's time to complete your task: ${reminder.task}`)}
                    className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(reminder.id)}
                    className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {reminders.length === 0 && (
            <div className="rounded-[32px] bg-neutral-900 p-12 text-center border border-dashed border-neutral-800">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-neutral-700">
                <Bell className="h-8 w-8" />
              </div>
              <p className="text-sm font-bold text-neutral-500">No reminders scheduled.</p>
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mt-1">Try "Set a goal to lose 5kg"</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
