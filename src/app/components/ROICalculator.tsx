"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Clock, Target, ArrowRight } from "lucide-react";

interface ROICalculatorData {
  numberOfReps: number;
  averageDealSize: number;
  currentClosingRate: number;
  monthlyLeadsPerRep: number;
  hoursProspectingPerDay: number;
  averageHourlyRate: number;
}

interface ROIResults {
  currentMonthlyRevenue: number;
  projectedMonthlyRevenue: number;
  additionalRevenue: number;
  timeSavedPerRep: number;
  totalTimeSaved: number;
  costSavings: number;
  monthlyROI: number;
  annualROI: number;
  additionalDealsPerMonth: number;
  paybackPeriod: number;
}

export const ROICalculator = () => {
  const [isCalculated, setIsCalculated] = useState(false);
  const [data, setData] = useState<ROICalculatorData>({
    numberOfReps: 2,
    averageDealSize: 5000,
    currentClosingRate: 10,
    monthlyLeadsPerRep: 30,
    hoursProspectingPerDay: 4,
    averageHourlyRate: 35,
  });

  const [results, setResults] = useState<ROIResults>({
    currentMonthlyRevenue: 0,
    projectedMonthlyRevenue: 0,
    additionalRevenue: 0,
    timeSavedPerRep: 0,
    totalTimeSaved: 0,
    costSavings: 0,
    monthlyROI: 0,
    annualROI: 0,
    additionalDealsPerMonth: 0,
    paybackPeriod: 0,
  });

  // SalesCentri platform cost (monthly per rep)
  const platformCostPerRep = 995;

  const calculateROI = () => {
    // Optional: programmatic ROI calc event via external tracker
    try {
      const w = window as unknown as {
        salescentriTrackerReady?: boolean;
        tracker?: {
          trackEvent: (
            eventType: string,
            data?: Record<string, unknown>
          ) => void;
        };
      };
      const payload = {
        numberOfReps: data.numberOfReps,
        averageDealSize: data.averageDealSize,
        currentClosingRate: data.currentClosingRate,
        monthlyLeadsPerRep: data.monthlyLeadsPerRep,
        hoursProspectingPerDay: data.hoursProspectingPerDay,
        averageHourlyRate: data.averageHourlyRate,
      } as Record<string, unknown>;
      const fire = () => {
        if (w.tracker?.trackEvent)
          w.tracker.trackEvent("roi_calculation", payload);
      };
      if (w.salescentriTrackerReady) fire();
      else setTimeout(fire, 200);
    } catch {}

    // Current metrics
    const currentDealsPerMonth =
      ((data.monthlyLeadsPerRep * data.currentClosingRate) / 100) *
      data.numberOfReps;
    const currentMonthlyRevenue = currentDealsPerMonth * data.averageDealSize;

    // Much more conservative improvements with SalesCentri
    // - 1.08x more qualified leads through AI prospecting
    // - 5% better closing rates with verified contacts
    // - 10% time savings from automation
    const qualifiedLeadsMultiplier = 1.08;
    const closingRateImprovement = 0.04; // 5% improvement
    const timeSavingsPercentage = 0.08; // 10% time savings

    const projectedLeadsPerRep =
      data.monthlyLeadsPerRep * qualifiedLeadsMultiplier;
    const projectedClosingRate = Math.min(
      data.currentClosingRate * (1 + closingRateImprovement),
      30
    ); // Cap at 40%
    const projectedDealsPerMonth =
      ((projectedLeadsPerRep * projectedClosingRate) / 100) * data.numberOfReps;
    const projectedMonthlyRevenue =
      projectedDealsPerMonth * data.averageDealSize;

    const additionalRevenue = projectedMonthlyRevenue - currentMonthlyRevenue;
    const additionalDealsPerMonth =
      projectedDealsPerMonth - currentDealsPerMonth;

    // Time savings calculation
    const timeSavedPerRep = data.hoursProspectingPerDay * timeSavingsPercentage;
    const totalTimeSaved = timeSavedPerRep * data.numberOfReps * 22; // 22 working days per month
    const costSavings = totalTimeSaved * data.averageHourlyRate;

    // Platform cost
    const monthlyPlatformCost = platformCostPerRep * data.numberOfReps;

    // ROI calculations
    const monthlyROI =
      ((additionalRevenue + costSavings - monthlyPlatformCost) /
        monthlyPlatformCost) *
      100;
    const annualROI =
      (((additionalRevenue + costSavings - monthlyPlatformCost) * 12) /
        monthlyPlatformCost) *
      100;
    const paybackPeriod =
      additionalRevenue + costSavings > 0
        ? monthlyPlatformCost / (additionalRevenue + costSavings)
        : 0;

    setResults({
      currentMonthlyRevenue,
      projectedMonthlyRevenue,
      additionalRevenue,
      timeSavedPerRep,
      totalTimeSaved,
      costSavings,
      monthlyROI,
      annualROI,
      additionalDealsPerMonth,
      paybackPeriod,
    });

    setIsCalculated(true);
  };

  const handleInputChange = (field: keyof ROICalculatorData, value: number) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const SliderInput = ({
    label,
    value,
    min,
    max,
    step = 1,
    field,
    suffix = "",
    prefix = "",
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    field: keyof ROICalculatorData;
    suffix?: string;
    prefix?: string;
  }) => {
    const progress = ((value - min) / (max - min)) * 100;

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-white text-sm font-medium">{label}</label>
          <span className="text-blue-400 font-bold text-sm bg-blue-500/10 px-2 py-1 rounded">
            {prefix}
            {value.toLocaleString()}
            {suffix}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => handleInputChange(field, Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            style={{ "--progress": `${progress}%` } as React.CSSProperties}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden px-4 md:px-6">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-blue-900/5 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-semibold text-sm tracking-wider uppercase mb-3 block">Cost & Impact</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Measure Your <span className="text-blue-500">Potential</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            See how AI-powered sales automation directly impacts your bottom line with our interactive calculator.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-gray-900/30 border border-white/10 rounded-3xl p-8 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Team Parameters</h3>
            </div>

            <div className="space-y-8">
              <SliderInput
                label="Sales Reps"
                value={data.numberOfReps}
                min={1}
                max={50}
                field="numberOfReps"
              />
              <SliderInput
                label="Avg Deal Size"
                value={data.averageDealSize}
                min={1000}
                max={100000}
                step={500}
                field="averageDealSize"
                prefix="$"
              />
              <SliderInput
                label="Close Rate"
                value={data.currentClosingRate}
                min={1}
                max={50}
                field="currentClosingRate"
                suffix="%"
              />
              <SliderInput
                label="Leads / Month"
                value={data.monthlyLeadsPerRep}
                min={10}
                max={500}
                field="monthlyLeadsPerRep"
              />
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={calculateROI}
                className="w-full mt-8 bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
              >
                Calculate ROI
              </motion.button>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            {!isCalculated ? (
              <div className="h-full min-h-[500px] bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 relative z-10">
                  <DollarSign className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Awaiting Data</h3>
                <p className="text-gray-500 max-w-xs relative z-10">Adjust the sliders and hit calculate to see your potential earnings.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Main Metric */}
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-3xl p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <p className="text-blue-400 font-medium mb-2 uppercase tracking-wide text-sm">Projected Monthly Gain</p>
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                    +{formatCurrency(results.additionalRevenue)}
                  </div>
                  <p className="text-gray-400 text-sm">Additional revenue per month with AI optimization</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Secondary Metrics */}
                  <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-400" /></div>
                      <span className="text-gray-300 font-medium">Annual ROI</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{Math.round(results.annualROI)}%</p>
                  </div>

                  <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-500/20 rounded-lg"><Clock className="w-5 h-5 text-purple-400" /></div>
                      <span className="text-gray-300 font-medium">Hours Saved</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{Math.round(results.totalTimeSaved)} <span className="text-lg text-gray-500 font-normal">hrs/mo</span></p>
                  </div>
                  
                  <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-500/20 rounded-lg"><Target className="w-5 h-5 text-orange-400" /></div>
                      <span className="text-gray-300 font-medium">Extra Deals</span>
                    </div>
                    <p className="text-3xl font-bold text-white">+{Math.round(results.additionalDealsPerMonth)} <span className="text-lg text-gray-500 font-normal">/mo</span></p>
                  </div>

                  <div className="bg-gray-900/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                     <p className="text-gray-400 text-xs mb-3">Based on conservative estimates</p>
                     <a href="/get-started" className="text-blue-400 text-sm font-bold hover:text-blue-300 flex items-center gap-1">
                       Start Now <ArrowRight className="w-3 h-3" />
                     </a>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          background: #1f2937;
          height: 6px;
          border-radius: 3px;
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
          transition: transform 0.1s;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        /* Progress fill effect */
        .slider {
          background: linear-gradient(to right, #3B82F6 0%, #3B82F6 var(--progress, 0%), #374151 var(--progress, 0%), #374151 100%);
          background-size: 100% 8px;
          background-repeat: no-repeat;
          background-position: center;
        }
      `}</style>
    </section>
  );
};
