import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Volume2, 
  Brain, 
  TrendingUp, 
  Mic, 
  Shield, 
  Smartphone, 
  ChevronRight, 
  Check, 
  X, 
  Clock, 
  Zap, 
  MessageSquare, 
  Settings as SettingsIcon,
  Trash2,
  Download,
  Globe,
  User,
  Activity,
  Award,
  Calendar,
  Moon,
  Sun,
  Volume1,
  VolumeX,
  Vibrate,
  AlertTriangle,
  Target
} from 'lucide-react';
import { ReminderSettings } from '../types';
import { cn } from '../lib/utils';

interface SettingsProps {
  settings: ReminderSettings;
  onUpdate: (settings: ReminderSettings) => void;
}

export default function Settings({ settings, onUpdate }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'notifications' | 'ai' | 'scheduling' | 'goals' | 'voice' | 'privacy' | 'device'>('notifications');

  const updateSection = (section: keyof ReminderSettings, data: any) => {
    const current = settings[section];
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      onUpdate({
        ...settings,
        [section]: { ...current, ...data }
      });
    } else {
      onUpdate({
        ...settings,
        [section]: data
      });
    }
  };

  const tabs = [
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'ai', icon: Brain, label: 'AI Agent' },
    { id: 'scheduling', icon: Clock, label: 'Scheduling' },
    { id: 'goals', icon: Target, label: 'Goals' },
    { id: 'voice', icon: Mic, label: 'Voice' },
    { id: 'privacy', icon: Shield, label: 'Privacy' },
    { id: 'device', icon: Smartphone, label: 'Device' },
  ];

  const Toggle = ({ enabled, onChange, label, description }: { enabled: boolean, onChange: (val: boolean) => void, label: string, description?: string }) => (
    <div className="flex items-center justify-between py-4">
      <div className="space-y-1">
        <p className="text-sm font-black text-white uppercase tracking-widest">{label}</p>
        {description && <p className="text-[10px] font-bold text-neutral-500 max-w-[200px]">{description}</p>}
      </div>
      <button 
        onClick={() => onChange(!enabled)}
        className={cn(
          "h-6 w-12 rounded-full transition-all relative border-2",
          enabled ? "bg-blue-600 border-blue-400" : "bg-neutral-800 border-neutral-700"
        )}
      >
        <motion.div 
          animate={{ x: enabled ? 24 : 2 }}
          className={cn(
            "h-4 w-4 rounded-full absolute top-0.5",
            enabled ? "bg-white" : "bg-neutral-500"
          )}
        />
      </button>
    </div>
  );

  const Select = ({ value, options, onChange, label }: { value: string, options: string[], onChange: (val: any) => void, label: string }) => (
    <div className="space-y-3 py-4">
      <p className="text-sm font-black text-white uppercase tracking-widest">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
              value === opt 
                ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40" 
                : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="relative h-48 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 group">
        <img 
          src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format&fit=crop" 
          alt="Settings Header" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-2">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Control Center</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight font-display">System Settings</h1>
          <p className="text-xs font-bold text-neutral-300 max-w-[250px]">Configure your AI productivity coach and reminder engine.</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto pb-2 gap-2 snap-x scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 snap-center border-2",
              activeTab === tab.id 
                ? "bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-900/40" 
                : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-neutral-900 rounded-[32px] p-8 border border-neutral-800 shadow-2xl min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2 divide-y divide-neutral-800"
          >
            {activeTab === 'notifications' && (
              <>
                <Toggle 
                  label="Push Notifications" 
                  description="Receive visual alerts on your device"
                  enabled={settings.notifications.enabled} 
                  onChange={(val) => updateSection('notifications', { enabled: val })} 
                />
                <Toggle 
                  label="Voice Reminders" 
                  description="AI will speak your reminders aloud"
                  enabled={settings.notifications.voiceEnabled} 
                  onChange={(val) => updateSection('notifications', { voiceEnabled: val })} 
                />
                <Toggle 
                  label="Urgency Levels" 
                  description="Enable visual priority indicators for reminders"
                  enabled={settings.notifications.urgencyLevels} 
                  onChange={(val) => updateSection('notifications', { urgencyLevels: val })} 
                />
                <Toggle 
                  label="Vibration Alerts" 
                  enabled={settings.notifications.vibration} 
                  onChange={(val) => updateSection('notifications', { vibration: val })} 
                />
                <Select 
                  label="Notification Intensity" 
                  value={settings.notifications.intensity} 
                  options={['Low', 'Medium', 'High']} 
                  onChange={(val) => updateSection('notifications', { intensity: val })} 
                />
              </>
            )}

            {activeTab === 'ai' && (
              <>
                <Select 
                  label="System Theme" 
                  value={settings.theme} 
                  options={['light', 'dark']} 
                  onChange={(val) => onUpdate({ ...settings, theme: val })} 
                />
                <Select 
                  label="AI Agent Behavior Mode" 
                  value={settings.ai.mode} 
                  options={['Strict Coach', 'Smart Assistant', 'Motivational Trainer', 'Passive Observer']} 
                  onChange={(val) => updateSection('ai', { mode: val })} 
                />
                <Toggle 
                  label="Smart Rescheduling" 
                  description="AI optimizes your schedule based on behavior"
                  enabled={settings.ai.smartRescheduling} 
                  onChange={(val) => updateSection('ai', { smartRescheduling: val })} 
                />
                <Toggle 
                  label="Suggestion Engine" 
                  description="Get AI tips for better productivity"
                  enabled={settings.ai.suggestionEngine} 
                  onChange={(val) => updateSection('ai', { suggestionEngine: val })} 
                />
                {settings.ai.suggestionEngine && (
                  <div className="py-4 space-y-3">
                    <p className="text-sm font-black text-white uppercase tracking-widest">Suggestion Focus</p>
                    <div className="flex flex-wrap gap-2">
                      {['nutrition', 'training', 'lifestyle', 'mindset'].map((focus) => (
                        <button
                          key={focus}
                          onClick={() => {
                            const current = settings.ai.suggestionFocus;
                            const updated = current.includes(focus as any)
                              ? current.filter(f => f !== focus)
                              : [...current, focus as any];
                            updateSection('ai', { suggestionFocus: updated });
                          }}
                          className={cn(
                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                            settings.ai.suggestionFocus.includes(focus as any)
                              ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40" 
                              : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700"
                          )}
                        >
                          {focus}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Toggle 
                  label="Daily Summary" 
                  enabled={settings.ai.dailySummary} 
                  onChange={(val) => updateSection('ai', { dailySummary: val })} 
                />
                <Toggle 
                  label="Motivation Messages" 
                  enabled={settings.ai.motivationMessages} 
                  onChange={(val) => updateSection('ai', { motivationMessages: val })} 
                />
                {settings.ai.motivationMessages && (
                  <>
                    <Select 
                      label="Motivation Frequency" 
                      value={settings.ai.motivationFrequency} 
                      options={['low', 'medium', 'high']} 
                      onChange={(val) => updateSection('ai', { motivationFrequency: val })} 
                    />
                    <Select 
                      label="Motivation Style" 
                      value={settings.ai.motivationStyle} 
                      options={['gentle', 'firm', 'extreme']} 
                      onChange={(val) => updateSection('ai', { motivationStyle: val })} 
                    />
                  </>
                )}
              </>
            )}

            {activeTab === 'scheduling' && (
              <>
                <Toggle 
                  label="Auto-Scheduling" 
                  description="AI automatically assigns time slots for new tasks"
                  enabled={settings.scheduling.autoScheduling} 
                  onChange={(val) => updateSection('scheduling', { autoScheduling: val })} 
                />
                <Toggle 
                  label="Priority-Based Scheduling" 
                  description="Prioritize urgent tasks in your daily flow"
                  enabled={settings.scheduling.priorityBased} 
                  onChange={(val) => updateSection('scheduling', { priorityBased: val })} 
                />
                <Toggle 
                  label="Time Optimization" 
                  description="AI finds the best time for tasks based on your energy"
                  enabled={settings.scheduling.timeOptimization} 
                  onChange={(val) => updateSection('scheduling', { timeOptimization: val })} 
                />
                <Toggle 
                  label="Auto-Reschedule Missed Tasks" 
                  enabled={settings.behavior.autoReschedule} 
                  onChange={(val) => updateSection('behavior', { autoReschedule: val })} 
                />
                <div className="py-4 space-y-3">
                  <p className="text-sm font-black text-white uppercase tracking-widest">Quiet Hours</p>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-[8px] font-black text-neutral-500 uppercase">Start Time</p>
                      <input 
                        type="time" 
                        value={settings.behavior.quietHours.start}
                        onChange={(e) => updateSection('behavior', { quietHours: { ...settings.behavior.quietHours, start: e.target.value } })}
                        className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-black"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[8px] font-black text-neutral-500 uppercase">End Time</p>
                      <input 
                        type="time" 
                        value={settings.behavior.quietHours.end}
                        onChange={(e) => updateSection('behavior', { quietHours: { ...settings.behavior.quietHours, end: e.target.value } })}
                        className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-black"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'goals' && (
              <>
                <Toggle 
                  label="Auto Goal Breakdown" 
                  description="AI splits large goals into smaller, manageable tasks"
                  enabled={settings.goals.autoBreakdown} 
                  onChange={(val) => updateSection('goals', { autoBreakdown: val })} 
                />
                <Toggle 
                  label="Difficulty Adjustment" 
                  description="AI adjusts task difficulty based on performance"
                  enabled={settings.goals.difficultyAdjustment} 
                  onChange={(val) => updateSection('goals', { difficultyAdjustment: val })} 
                />
                <Toggle 
                  label="Weekly Goal Regeneration" 
                  enabled={settings.goals.weeklyRegeneration} 
                  onChange={(val) => updateSection('goals', { weeklyRegeneration: val })} 
                />
                <Toggle 
                  label="Habit Tracking System" 
                  enabled={settings.goals.habitTracking} 
                  onChange={(val) => updateSection('goals', { habitTracking: val })} 
                />
                <Toggle 
                  label="Achievement Badges" 
                  enabled={settings.progress.achievementBadges} 
                  onChange={(val) => updateSection('progress', { achievementBadges: val })} 
                />
              </>
            )}

            {activeTab === 'voice' && (
              <>
                <Toggle 
                  label="Voice Assistant" 
                  enabled={settings.voice.enabled} 
                  onChange={(val) => updateSection('voice', { enabled: val })} 
                />
                <Select 
                  label="AI Agent Name" 
                  value={settings.voice.agentName} 
                  options={['Eli', 'Mira', 'Ada', 'Zane', 'Sasha', 'Blue', 'Chelsea', 'Aria', 'Nova', 'Juno', 'Lia', 'Kai', 'Rhea', 'Atlas', 'Vera', 'Zephyr']} 
                  onChange={(val) => updateSection('voice', { agentName: val })} 
                />
                <div className="py-4 space-y-3">
                  <p className="text-sm font-black text-white uppercase tracking-widest">Wake Phrase</p>
                  <input 
                    type="text" 
                    value={settings.voice.wakePhrase}
                    onChange={(e) => updateSection('voice', { wakePhrase: e.target.value })}
                    placeholder={`e.g. Hey ${settings.voice.agentName}`}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-black"
                  />
                </div>
                <Select 
                  label="Voice Personality" 
                  value={settings.voice.personality} 
                  options={['Professional', 'Friendly', 'Robotic', 'Energetic']} 
                  onChange={(val) => updateSection('voice', { personality: val })} 
                />
                <Select 
                  label="Voice Gender" 
                  value={settings.voice.gender} 
                  options={['male', 'female']} 
                  onChange={(val) => updateSection('voice', { gender: val })} 
                />
                <Select 
                  label="Voice Tone" 
                  value={settings.voice.tone} 
                  options={['calm', 'motivational', 'strict']} 
                  onChange={(val) => updateSection('voice', { tone: val })} 
                />
                <Select 
                  label="Speech Speed" 
                  value={settings.voice.speed} 
                  options={['Slow', 'Normal', 'Fast']} 
                  onChange={(val) => updateSection('voice', { speed: val })} 
                />
                <Select 
                  label="Voice Language" 
                  value={settings.voice.language} 
                  options={['Arabic', 'Chinese', 'English', 'French', 'German', 'Hindi', 'Italian', 'Japanese', 'Korean', 'Portuguese', 'Russian', 'Spanish', 'Swahili']} 
                  onChange={(val) => updateSection('voice', { language: val })} 
                />
              </>
            )}

            {activeTab === 'privacy' && (
              <>
                <Toggle 
                  label="Long-Term Memory" 
                  description="AI remembers your past performance to improve planning"
                  enabled={settings.privacy.longTermMemory} 
                  onChange={(val) => updateSection('privacy', { longTermMemory: val })} 
                />
                <Toggle 
                  label="Store Voice Recordings" 
                  enabled={settings.privacy.storeVoice} 
                  onChange={(val) => updateSection('privacy', { storeVoice: val })} 
                />
                <Toggle 
                  label="Sync Across Devices" 
                  enabled={settings.privacy.syncAcrossDevices} 
                  onChange={(val) => updateSection('privacy', { syncAcrossDevices: val })} 
                />
                <div className="py-6 space-y-4">
                  <button className="w-full py-4 rounded-2xl bg-neutral-800 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-neutral-700">
                    <Download className="h-4 w-4" />
                    Export Performance History
                  </button>
                  <button className="w-full py-4 rounded-2xl bg-red-600/10 text-red-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-red-500/20">
                    <Trash2 className="h-4 w-4" />
                    Clear Memory Data
                  </button>
                </div>
              </>
            )}

            {activeTab === 'device' && (
              <>
                <div className="py-6 space-y-4">
                  <div className="p-4 rounded-2xl bg-black border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-xs font-black text-white uppercase">Mobile App Sync</p>
                        <p className="text-[10px] font-bold text-neutral-500">Last synced: 2 mins ago</p>
                      </div>
                    </div>
                    <Check className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="p-4 rounded-2xl bg-black border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-xs font-black text-white uppercase">Google Calendar</p>
                        <p className="text-[10px] font-bold text-neutral-500">Not connected</p>
                      </div>
                    </div>
                    <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Connect</button>
                  </div>
                  <div className="p-4 rounded-2xl bg-black border border-neutral-800 flex items-center justify-between opacity-50">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-xs font-black text-white uppercase">WhatsApp Integration</p>
                        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">Coming Soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
