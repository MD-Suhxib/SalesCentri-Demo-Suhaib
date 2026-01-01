'use client';

import { Briefcase, Handshake, Eye, CreditCard, Rocket, ShoppingBag, Users } from 'lucide-react';

export type ObjectiveType = 
  | 'sales'
  | 'partnership'
  | 'demo'
  | 'subscription'
  | 'go-live'
  | 'register-supplier'
  | 'register-buyer';

interface ObjectiveSelectorProps {
  selected: ObjectiveType | null;
  onChange: (objective: ObjectiveType) => void;
}

const objectives = [
  {
    id: 'sales' as ObjectiveType,
    label: 'Discuss Sales',
    description: 'Explore sales opportunities',
    icon: Briefcase,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'partnership' as ObjectiveType,
    label: 'Partnership',
    description: 'Collaborate and grow together',
    icon: Handshake,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'demo' as ObjectiveType,
    label: 'Book Demo (Understand More)',
    description: 'See our platform in action',
    icon: Eye,
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'subscription' as ObjectiveType,
    label: 'Subscription',
    description: 'Subscribe to our services',
    icon: CreditCard,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'go-live' as ObjectiveType,
    label: 'Go Live',
    description: 'Launch your project',
    icon: Rocket,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'register-supplier' as ObjectiveType,
    label: 'Register as Supplier',
    description: 'Join our supplier network',
    icon: ShoppingBag,
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'register-buyer' as ObjectiveType,
    label: 'Register as Buyer',
    description: 'Start purchasing with us',
    icon: Users,
    gradient: 'from-violet-500 to-purple-500',
  },
];

export default function ObjectiveSelector({ selected, onChange }: ObjectiveSelectorProps) {
  return (
    <div className="space-y-2.5">
      <label className="block text-xs font-semibold text-gray-200 mb-3">
        What would you like to discuss? <span className="text-red-500">*</span>
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
        {objectives.map((objective) => {
          const Icon = objective.icon;
          const isSelected = selected === objective.id;
          
          return (
            <button
              key={objective.id}
              type="button"
              onClick={() => onChange(objective.id)}
              className={`
                group relative p-3 rounded-lg border-2 text-left
                transition-all duration-300 ease-out
                hover:scale-[1.02] hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                ${isSelected 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-blue-500/10 shadow-md shadow-blue-500/20' 
                  : 'border-blue-500/20 bg-black hover:border-blue-500'
                }
              `}
            >
              {/* Icon with gradient background */}
              <div className={`
                inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2
                bg-gradient-to-br ${objective.gradient}
                ${isSelected ? 'scale-110' : 'scale-100'}
                transition-transform duration-300
              `}>
                <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>

              {/* Label */}
              <div className="space-y-0.5">
                <p className={`
                  font-semibold text-xs leading-tight
                  ${isSelected ? 'text-blue-500' : 'text-gray-100'}
                `}>
                  {objective.label}
                </p>
                <p className="text-[10px] leading-tight text-gray-400">
                  {objective.description}
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
