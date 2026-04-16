import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  X, 
  Volume2, 
  Sparkles, 
  Brain, 
  Zap, 
  MessageSquare,
  Activity,
  Target,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import { ReminderSettings, UserProfile } from '../types';
import { cn } from '../lib/utils';
import { AgentEngine } from '../engines/agentEngine';

interface AIVoiceAgentProps {
  settings: ReminderSettings;
  profile: UserProfile;
  onCommand?: (command: string) => void;
}

export default function AIVoiceAgent({ settings, profile, onCommand }: AIVoiceAgentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(20).fill(0));
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVisualizerData(prev => prev.map(() => Math.random() * 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setVisualizerData(new Array(20).fill(0));
    }
  }, [isListening]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = settings.voice.language === 'English' ? 'en-US' : 'sw-KE';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setAiResponse('');
    };

    recognition.onresult = (event: any) => {
      const current = event.results[event.results.length - 1][0].transcript;
      setTranscript(current);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        processCommand(transcript);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    try {
      const response = await AgentEngine.understand(command, settings);
      setAiResponse(`I've understood your request: ${response.task}. Should I schedule this for ${response.time}?`);
      speakResponse(`I've understood your request: ${response.task}. Should I schedule this for ${response.time}?`);
      if (onCommand) onCommand(command);
    } catch (error) {
      setAiResponse("I'm sorry, I couldn't process that. Could you repeat?");
      speakResponse("I'm sorry, I couldn't process that. Could you repeat?");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (!settings.voice.enabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.voice.speed === 'Slow' ? 0.8 : settings.voice.speed === 'Fast' ? 1.2 : 1.0;
    utterance.pitch = settings.voice.tone === 'strict' ? 0.8 : settings.voice.tone === 'motivational' ? 1.2 : 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-blue-900/40 flex items-center justify-center z-40 border-2 border-white/20"
      >
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-20" />
        <Mic className="h-8 w-8 text-white" />
      </motion.button>

      {/* Voice Agent Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative mb-12">
              <motion.div 
                animate={{ 
                  scale: isListening ? [1, 1.2, 1] : 1,
                  opacity: isListening ? [0.5, 1, 0.5] : 0.5
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-48 w-48 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 blur-3xl opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-32 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  <Mic className={cn("h-12 w-12 text-white transition-all", isListening && "animate-pulse scale-110")} />
                </div>
              </div>
              
              {/* Visualizer Bars */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12">
                {visualizerData.map((val, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: `${val}%` }}
                    className="w-1 bg-blue-500 rounded-full opacity-50"
                  />
                ))}
              </div>
            </div>

            <div className="max-w-md space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase tracking-widest font-display">
                  {isListening ? "Listening..." : isProcessing ? "Processing..." : `Hey ${profile.name.split(' ')[0]}`}
                </h2>
                <p className="text-neutral-400 font-bold italic min-h-[1.5em]">
                  {transcript ? `"${transcript}"` : "How can I help you today?"}
                </p>
              </div>

              {aiResponse && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{settings.voice.agentName}</span>
                  </div>
                  <p className="text-sm font-bold text-white leading-relaxed">{aiResponse}</p>
                </motion.div>
              )}

              <div className="flex flex-col gap-4 pt-8">
                {!isListening && !isProcessing && (
                  <button 
                    onClick={startListening}
                    className="px-12 py-5 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 border-2 border-blue-400/20 active:scale-95 transition-all"
                  >
                    Start Speaking
                  </button>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-left hover:bg-white/10 transition-all">
                    <Target className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-white">Set Goal</p>
                      <p className="text-[8px] font-bold text-neutral-500 uppercase">"Lose 5kg"</p>
                    </div>
                  </button>
                  <button className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-left hover:bg-white/10 transition-all">
                    <Activity className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-white">Log Activity</p>
                      <p className="text-[8px] font-bold text-neutral-500 uppercase">"Ran 5km"</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
