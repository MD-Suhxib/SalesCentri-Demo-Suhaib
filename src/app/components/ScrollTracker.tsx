import { useEffect } from "react";

interface ScrollTrackerProps {
  thresholds?: number[]; // Scroll depth thresholds (0-100)
}

export const ScrollTracker: React.FC<ScrollTrackerProps> = () => {
  // External tracker handles scroll events; no-op fallback
  useEffect(() => {}, []);
  return null;
};
