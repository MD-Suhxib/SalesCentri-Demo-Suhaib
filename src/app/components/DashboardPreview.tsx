import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";

export const DashboardPreview = () => {
  return (
    <div className="relative">
      {/* Main dashboard card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-2xl"
        onAnimationComplete={() => {
          const w = window as unknown as {
            salescentriTrackerReady?: boolean;
            tracker?: {
              trackEvent: (
                eventType: string,
                data?: Record<string, unknown>
              ) => void;
            };
          };
          const fire = () => {
            if (w.tracker && typeof w.tracker.trackEvent === "function") {
              w.tracker.trackEvent("dashboard_preview_loaded", {
                section: "hero_section",
              });
            }
          };
          if (w.salescentriTrackerReady) {
            fire();
          } else {
            let done = false;
            const onReady = () => {
              if (done) return;
              done = true;
              fire();
              window.removeEventListener(
                "salescentri:tracker-ready",
                onReady as EventListener
              );
            };
            window.addEventListener(
              "salescentri:tracker-ready",
              onReady as EventListener,
              { once: true }
            );
            setTimeout(onReady, 200);
          }
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold">Sales Performance</h3>
          <div className="flex items-center space-x-2 text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+24.5%</span>
          </div>
        </div>

        {/* Chart area */}
        <div className="h-32 mb-6 relative">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,100 L50,80 L100,60 L150,40 L200,30 L250,20 L300,10"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
            />
            <motion.path
              d="M0,100 L50,80 L100,60 L150,40 L200,30 L250,20 L300,10 L300,100 Z"
              fill="url(#gradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            />
          </svg>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              icon: DollarSign,
              label: "Revenue",
              value: "$2.4M",
              change: "+18%",
            },
            { icon: Users, label: "Leads", value: "1,247", change: "+32%" },
            {
              icon: Target,
              label: "Conversion",
              value: "23.4%",
              change: "+12%",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-white font-bold text-sm">{stat.value}</div>
              <div className="text-slate-400 text-xs">{stat.label}</div>
              <div className="text-green-400 text-xs">{stat.change}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute -left-4 top-20 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-3"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm">AI Active</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute -right-4 bottom-20 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-3"
      >
        <div className="text-center">
          <div className="text-blue-400 font-bold text-lg">94%</div>
          <div className="text-slate-300 text-xs">Accuracy</div>
        </div>
      </motion.div>
    </div>
  );
};
