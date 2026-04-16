import React from 'react';
import { User, Settings, LogOut, Bell, Shield, HelpCircle, ChevronRight, Moon, Sun, Sparkles, Star, Rocket, Diamond } from 'lucide-react';
import { UserProfile } from '../types';
import { cn } from '../lib/utils';

interface ProfileProps {
  profile: UserProfile;
  onLogout: () => void;
  onUpgradeClick: () => void;
}

export default function Profile({ profile, onLogout, onUpgradeClick }: ProfileProps) {
  const menuItems = [
    { icon: Settings, label: 'Account Settings', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Bell, label: 'Notifications', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { icon: Shield, label: 'Privacy & Security', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: HelpCircle, label: 'Help & Support', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  ];

  return (
    <div className="space-y-6">
      {/* User Header */}
      <section className="text-center space-y-4 py-4">
        <div className="relative mx-auto h-24 w-24">
          <div className="h-full w-full rounded-full overflow-hidden border-4 border-neutral-800 shadow-xl">
            <img 
              src={`https://picsum.photos/seed/${profile.name.replace(/\s+/g, '').toLowerCase()}/200/200`}
              alt={profile.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-blue-600 border-2 border-neutral-900 flex items-center justify-center shadow-lg">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">{profile.name}</h2>
          <p className="text-sm text-neutral-500 font-bold">{profile.email}</p>
        </div>

        {/* Subscription Status */}
        <div className="mx-auto max-w-[280px] rounded-2xl bg-neutral-900 border border-neutral-800 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center",
              profile.subscription === 'Free' ? "bg-neutral-800 text-neutral-500" :
              profile.subscription === 'Basic' ? "bg-blue-500/10 text-blue-500" :
              profile.subscription === 'Pro' ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" :
              "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-900/40"
            )}>
              {profile.subscription === 'Free' ? <User className="h-5 w-5" /> :
               profile.subscription === 'Basic' ? <Star className="h-5 w-5" /> :
               profile.subscription === 'Pro' ? <Rocket className="h-5 w-5" /> :
               <Diamond className="h-5 w-5" />}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Current Plan</p>
              <p className="text-sm font-black text-white">{profile.subscription}</p>
            </div>
          </div>
          <button 
            onClick={onUpgradeClick}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40 active:scale-95 transition-transform"
          >
            {profile.subscription === 'Elite' ? 'View Plans' : 'Upgrade'}
          </button>
        </div>

        <div className="flex justify-center gap-2">
          <span className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-500">
            {profile.gender}
          </span>
          <span className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-500">
            {profile.age} Years
          </span>
          {profile.nationality && (
            <span className="rounded-full bg-neutral-900 border border-neutral-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-500">
              {profile.nationality}
            </span>
          )}
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-neutral-900 p-4 shadow-sm border border-neutral-800">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1">Height</p>
          <p className="text-lg font-black text-white">
            {profile.height ? (
              <>
                {Math.floor(profile.height / 30.48)}'
                {Math.round((profile.height % 30.48) / 2.54)}"
              </>
            ) : '—'}
          </p>
        </div>
        <div className="rounded-2xl bg-neutral-900 p-4 shadow-sm border border-neutral-800">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1">Weight</p>
          <p className="text-lg font-black text-white">{profile.weight} <span className="text-xs font-bold text-neutral-600">kg</span></p>
        </div>
      </div>

      {/* Menu Items */}
      <section className="rounded-3xl bg-neutral-900 shadow-xl border border-neutral-800 overflow-hidden">
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center justify-between p-5 transition-colors active:bg-neutral-800",
              i !== menuItems.length - 1 && "border-b border-neutral-800"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn("rounded-xl p-2", item.bg, item.color)}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="font-black text-sm text-white">{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-700" />
          </button>
        ))}
      </section>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full rounded-2xl bg-red-600 p-5 text-white font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-red-900/40 border-2 border-red-500/20 hover:bg-red-500"
      >
        <LogOut className="h-5 w-5" />
        <span className="uppercase tracking-[0.2em] text-sm font-display">Log Out</span>
      </button>

      <div className="text-center pb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-700">CALORI AI v1.0.0</p>
      </div>
    </div>
  );
}
