import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Star, Rocket, Diamond, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface PricingProps {
  currentPlan: string;
  onUpgrade: (plan: 'Free' | 'Basic' | 'Pro' | 'Elite') => void;
  onBack: () => void;
}

export default function Pricing({ currentPlan, onUpgrade, onBack }: PricingProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'Free',
      name: 'Free',
      price: 0,
      icon: Zap,
      description: 'Perfect for getting started with basic tracking.',
      features: [
        'Basic calorie tracking',
        'Manual food logging',
        'Daily dashboard',
        'Basic goal setting',
        'Water tracking',
        'Limited AI tips'
      ],
      limitations: [
        'No AI coaching',
        'No training plans',
        'No advanced analytics',
        'No food scanning'
      ],
      cta: 'Start Free',
      color: 'bg-neutral-800'
    },
    {
      id: 'Basic',
      name: 'Basic',
      price: 8.99,
      icon: Star,
      description: 'Enhanced insights for consistent progress.',
      features: [
        'Everything in Free',
        'Basic AI insights (daily tips)',
        'Advanced analytics (basic)',
        'Weekly summaries'
      ],
      limitations: [
        'No training plans',
        'No AI chat',
        'No food scanning'
      ],
      cta: 'Upgrade to Basic',
      color: 'bg-neutral-800'
    },
    {
      id: 'Pro',
      name: 'Pro',
      price: 16.99,
      icon: Rocket,
      badge: 'Most Popular',
      description: 'The complete AI health cockpit experience.',
      features: [
        'Everything in Basic',
        'Full AI coaching system',
        'Personalized training plans',
        'Advanced analytics dashboard',
        'Goal prediction engine',
        'Insights & learning hub',
        'Adaptive calorie adjustments',
        'Weekly performance reports'
      ],
      cta: 'Upgrade to Pro',
      color: 'bg-blue-600',
      highlight: true
    },
    {
      id: 'Elite',
      name: 'Elite',
      price: 24.99,
      icon: Diamond,
      description: 'Maximum performance with priority AI tools.',
      features: [
        'Everything in Pro',
        'AI food image scanning',
        'Voice food logging',
        'AI chat assistant (Coach)',
        'Advanced predictive analysis',
        'Deep nutrition insights',
        'Priority AI processing',
        'Personalized AI reports'
      ],
      cta: 'Go Elite',
      color: 'bg-neutral-800'
    }
  ];

  const getPrice = (price: number) => {
    if (billingCycle === 'yearly') {
      return (price * 0.8).toFixed(2); // 20% discount
    }
    return price.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-md px-4 py-6 border-b border-neutral-800">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="h-10 w-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800 active:scale-90 transition-transform"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black font-display tracking-tight">Choose Your Plan</h1>
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Unlock your full potential</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-8 space-y-10 max-w-7xl mx-auto">
        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800 flex gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                billingCycle === 'monthly' ? "bg-white text-black shadow-lg" : "text-neutral-500"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                billingCycle === 'yearly' ? "bg-white text-black shadow-lg" : "text-neutral-500"
              )}
            >
              Yearly
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-green-500 text-white">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "relative rounded-[32px] p-8 border-2 transition-all duration-500 flex flex-col h-full",
                plan.highlight 
                  ? "bg-neutral-900 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)] scale-105 z-10" 
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-xl",
                currentPlan === plan.id && "ring-4 ring-green-500/20"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/40 z-20">
                  {plan.badge}
                </div>
              )}

              <div className="mb-8 space-y-4">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner",
                  plan.highlight ? "bg-blue-500 text-white" : "bg-neutral-800 text-neutral-400"
                )}>
                  <plan.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-display text-white">{plan.name}</h3>
                  <p className="text-xs font-bold text-neutral-500 mt-1">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display text-white">${getPrice(plan.price)}</span>
                  <span className="text-sm font-black text-neutral-500 uppercase tracking-widest">/mo</span>
                </div>
                {billingCycle === 'yearly' && plan.price > 0 && (
                  <p className="text-[10px] font-black text-green-500 uppercase mt-1 tracking-widest">Billed annually</p>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">What's included:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-4 w-4 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-sm font-bold text-neutral-300 leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="pt-4 space-y-3 opacity-40">
                    {plan.limitations.map((limit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1 h-4 w-4 rounded-full bg-neutral-800 flex items-center justify-center shrink-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
                        </div>
                        <span className="text-sm font-bold text-neutral-500 leading-tight">{limit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onUpgrade(plan.id as any)}
                disabled={currentPlan === plan.id}
                className={cn(
                  "w-full py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl font-display border-2",
                  currentPlan === plan.id 
                    ? "bg-neutral-800 border-neutral-700 text-neutral-500 cursor-default"
                    : plan.highlight
                      ? "bg-blue-600 border-blue-400/20 text-white shadow-blue-900/40 hover:bg-blue-500"
                      : "bg-white border-white/20 text-black hover:bg-neutral-200"
                )}
              >
                {currentPlan === plan.id ? 'Current Plan' : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust Footer */}
        <div className="pt-10 text-center space-y-6">
          <p className="text-xs font-black text-neutral-500 uppercase tracking-[0.3em]">Trusted by 50,000+ athletes worldwide</p>
          <div className="flex justify-center gap-8 opacity-30 grayscale">
            <div className="h-8 w-24 bg-neutral-800 rounded-lg" />
            <div className="h-8 w-24 bg-neutral-800 rounded-lg" />
            <div className="h-8 w-24 bg-neutral-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
