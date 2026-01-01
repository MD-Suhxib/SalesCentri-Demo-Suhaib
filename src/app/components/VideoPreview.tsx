"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

interface VideoPreviewProps {
  isVisible: boolean;
  videoSrc: string;
  position: { x: number; y: number };
  onVideoClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  title?: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  isVisible,
  videoSrc,
  position,
  onVideoClick,
  onMouseEnter,
  onMouseLeave,
  title = "Preview"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-play when visible
  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Video play failed, that's okay for preview
      });
    }
  }, [isVisible]);

  // Handle video load
  const handleVideoLoad = () => {
    setIsLoaded(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-50 pointer-events-auto cursor-pointer"
          style={{
            left: position.x - 150, // Center the preview
            top: position.y + 20, // Position below cursor
          }}
          onClick={onVideoClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="relative w-80 h-48 bg-black rounded-xl overflow-hidden shadow-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200">
            {/* Video Element */}
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              onLoadedData={handleVideoLoad}
            />

            {/* Loading state */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Tooltip arrow */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black rotate-45 border-l border-t border-blue-500/30" />

            {/* Preview label */}
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm font-medium">{title}</span>
                <div className="text-blue-400 text-xs mt-1">Click to view full video</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};