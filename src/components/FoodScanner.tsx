import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  X, 
  Zap, 
  Image as ImageIcon, 
  Settings, 
  ChevronLeft, 
  Loader2, 
  Check, 
  RotateCcw, 
  Plus, 
  Minus,
  Edit2,
  Trash2,
  Diamond
} from 'lucide-react';
import { AIService } from '../services/aiService';
import { cn } from '../lib/utils';

interface FoodScannerProps {
  onClose: () => void;
  onSave: (meal: any) => void;
}

type ScannerState = 'idle' | 'capturing' | 'processing' | 'results';

export default function FoodScanner({ onClose, onSave }: FoodScannerProps) {
  // Check subscription first
  const savedProfile = localStorage.getItem('calori_profile');
  const profile = savedProfile ? JSON.parse(savedProfile) : null;

  if (profile?.subscription !== 'Elite') {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-black text-white"
      >
        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-md border-b border-white/5">
          <button onClick={onClose} className="p-2">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-black uppercase tracking-widest">AI Scanner</h1>
          <div className="h-6 w-6" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 relative">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop" 
              alt="Food Scan" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
          </div>

          <div className="relative z-10 space-y-8 flex flex-col items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-[32px] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-900/40 border border-white/20 backdrop-blur-xl">
                <Camera className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center border-4 border-neutral-900 shadow-lg">
                <Diamond className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white font-display uppercase tracking-tight">Elite AI Scanner</h2>
              <p className="text-base font-bold text-neutral-400 max-w-[300px] leading-relaxed">
                Smartphone scanning a healthy meal with AI detection labels.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full max-w-[300px]">
              {[
                'Instant Food Recognition',
                'Portion Size Estimation',
                'Automatic Macro Logging',
                'Voice Logging Support'
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/5">
                  <Check className="h-4 w-4 text-blue-500" />
                  <span className="text-xs font-black text-neutral-300 uppercase tracking-widest">{f}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                onClose();
                (window as any).setActiveTab('profile');
              }}
              className="w-full max-w-[300px] py-5 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all hover:bg-blue-500 border border-white/10"
            >
              Upgrade to Elite
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const [state, setState] = useState<ScannerState>('capturing');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [portion, setPortion] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [mealType, setMealType] = useState('lunch');
  
  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snack' },
  ];
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start Camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  }, []);

  useEffect(() => {
    if (state === 'capturing') {
      startCamera();
    }
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [state, startCamera]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8);
        setCapturedImage(base64);
        processImage(base64);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCapturedImage(base64);
        processImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (base64: string) => {
    setState('processing');
    const imageContent = base64.split(',')[1];
    const result = await AIService.scanFoodImage(imageContent);
    if (result) {
      setScanResult(result);
      setState('results');
    } else {
      setState('capturing');
      alert("Failed to analyze image. Please try again.");
    }
  };

  const handleSave = () => {
    if (scanResult) {
      const finalMeal = {
        ...scanResult,
        calories: Math.round(scanResult.calories * portion),
        protein: Math.round(scanResult.protein * portion),
        carbs: Math.round(scanResult.carbs * portion),
        fats: Math.round(scanResult.fats * portion),
        mealType: mealType,
        timestamp: Date.now(),
        id: Math.random().toString(36).substr(2, 9)
      };
      onSave(finalMeal);
      onClose();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-md">
        <button onClick={onClose} className="p-2">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-black uppercase tracking-widest">Scan Meal</h1>
        <div className="flex items-center gap-1 text-blue-500">
          <Zap className="h-5 w-5 fill-current" />
          <span className="text-xs font-black">AI</span>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {state === 'capturing' && (
            <motion.div 
              key="capturing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 relative"
            >
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                <div className="w-full aspect-square border-2 border-white/50 rounded-3xl relative">
                  <div className="absolute -top-2 -left-2 h-8 w-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                  <div className="absolute -top-2 -right-2 h-8 w-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                  <div className="absolute -bottom-2 -left-2 h-8 w-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                  <div className="absolute -bottom-2 -right-2 h-8 w-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-sm font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                      Align your food in frame
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-around">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-2 opacity-70"
                >
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase">Gallery</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />

                <button 
                  onClick={captureImage}
                  className="h-20 w-20 rounded-full border-4 border-white p-1"
                >
                  <div className="h-full w-full rounded-full bg-white active:scale-90 transition-transform" />
                </button>

                <button className="flex flex-col items-center gap-2 opacity-70">
                  <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Settings className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase">Options</span>
                </button>
              </div>
            </motion.div>
          )}

          {state === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 space-y-8"
            >
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-blue-500/20 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50"
                >
                  <Zap className="h-5 w-5 text-white fill-current" />
                </motion.div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-white">Processing your meal... 🤖</h2>
                <p className="text-neutral-400 font-bold">Our AI is analyzing every detail</p>
              </div>

              <div className="w-full max-w-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">Analyzing image</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">Detecting food items</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  </div>
                  <span className="text-sm font-bold text-white">Estimating portion size</span>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="h-6 w-6 rounded-full bg-neutral-800 flex items-center justify-center" />
                  <span className="text-sm font-bold text-white">Calculating calories</span>
                </div>
              </div>
            </motion.div>
          )}

          {state === 'results' && scanResult && (
            <motion.div 
              key="results"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex-1 flex flex-col bg-black text-white"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Image Preview */}
                <div className="h-48 w-full rounded-3xl overflow-hidden shadow-lg border-4 border-neutral-800">
                  <img src={capturedImage!} alt="Meal" className="h-full w-full object-cover" />
                </div>

                {/* Detected Items */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500">🍽️ Detected Meal</h3>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-xs font-black text-blue-500 uppercase flex items-center gap-1"
                    >
                      <Edit2 className="h-3 w-3" />
                      {isEditing ? 'Done' : 'Edit'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {mealTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setMealType(type.id)}
                          className={cn(
                            "whitespace-nowrap rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
                            mealType === type.id 
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" 
                              : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                          )}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-neutral-900 rounded-3xl p-6 shadow-xl border border-neutral-800 space-y-4">
                    <h4 className="text-xl font-black leading-tight text-white">{scanResult.foodName}</h4>
                    
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-2 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <p className="text-[10px] font-black text-blue-400 uppercase">Cals</p>
                        <p className="text-sm font-black text-blue-500">{Math.round(scanResult.calories * portion)}</p>
                      </div>
                      <div className="text-center p-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                        <p className="text-[10px] font-black text-indigo-400 uppercase">Prot</p>
                        <p className="text-sm font-black text-indigo-500">{Math.round(scanResult.protein * portion)}g</p>
                      </div>
                      <div className="text-center p-2 rounded-2xl bg-green-500/10 border border-green-500/20">
                        <p className="text-[10px] font-black text-green-400 uppercase">Carb</p>
                        <p className="text-sm font-black text-green-500">{Math.round(scanResult.carbs * portion)}g</p>
                      </div>
                      <div className="text-center p-2 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                        <p className="text-[10px] font-black text-purple-400 uppercase">Fat</p>
                        <p className="text-sm font-black text-purple-500">{Math.round(scanResult.fats * portion)}g</p>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="pt-4 border-t border-neutral-800 space-y-3">
                        {scanResult.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm font-bold text-neutral-300">{item.name}</span>
                            <button className="text-red-500 p-1">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button className="w-full py-2 rounded-xl border-2 border-dashed border-neutral-800 text-neutral-600 text-xs font-black uppercase flex items-center justify-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add Item
                        </button>
                      </div>
                    )}
                  </div>
                </section>

                {/* Portion Control */}
                <section className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500">⚖️ Portion Size</h3>
                  <div className="bg-neutral-900 rounded-3xl p-4 shadow-xl border border-neutral-800 flex items-center justify-between">
                    <button 
                      onClick={() => setPortion(p => Math.max(0.25, p - 0.25))}
                      className="h-12 w-12 rounded-2xl bg-neutral-800 flex items-center justify-center active:scale-95 transition-transform border border-neutral-700"
                    >
                      <Minus className="h-6 w-6 text-white" />
                    </button>
                    <div className="text-center">
                      <p className="text-xl font-black text-white">{portion}x</p>
                      <p className="text-[10px] font-black text-neutral-500 uppercase">Standard Plate</p>
                    </div>
                    <button 
                      onClick={() => setPortion(p => p + 0.25)}
                      className="h-12 w-12 rounded-2xl bg-neutral-800 flex items-center justify-center active:scale-95 transition-transform border border-neutral-700"
                    >
                      <Plus className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </section>
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-neutral-900 border-t border-neutral-800 flex gap-4">
                <button 
                  onClick={() => setState('capturing')}
                  className="h-14 px-6 rounded-2xl border border-neutral-800 bg-black text-neutral-500 font-black uppercase text-xs flex items-center gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Retake
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 h-14 rounded-2xl bg-blue-600 text-white font-black uppercase text-xs shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Save Meal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
}
