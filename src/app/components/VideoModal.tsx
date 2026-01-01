"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, X, Volume2, VolumeX } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoSrc,
  title = "Video Player"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!showControls) return;
    
    const timer = setTimeout(() => {
      if (isPlaying && !isDragging) {
        setShowControls(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [showControls, isPlaying, isDragging]);

  // Update time while playing
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const updateTime = () => setCurrentTime(video.currentTime);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', () => setDuration(video.duration));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', () => setDuration(video.duration));
    };
  }, [isOpen]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle seek
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Skip forward/backward
  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Exit fullscreen if in fullscreen mode
        if (isFullscreen) {
          try {
            if (document.exitFullscreen) {
              await document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
              await (document as any).webkitExitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
              await (document as any).mozCancelFullScreen();
            } else if ((document as any).msExitFullscreen) {
              await (document as any).msExitFullscreen();
            }
          } catch (error) {
            console.log('Exit fullscreen failed:', error);
          }
        }
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isFullscreen]);

  // Detect mobile and handle fullscreen when modal opens
  useEffect(() => {
    if (isOpen) {
      const checkMobile = () => {
        const userAgent = navigator.userAgent;
        const isAndroid = /Android/i.test(userAgent);
        const isSamsung = /Samsung/i.test(userAgent);
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(userAgent) || 
                              (typeof window !== 'undefined' && window.innerWidth < 1024);
        setIsMobile(isMobileDevice);
        
        if (isMobileDevice && containerRef.current) {
          // Request fullscreen on mobile (especially for Samsung devices)
          const requestFullscreen = async () => {
            try {
              if (containerRef.current) {
                if (containerRef.current.requestFullscreen) {
                  await containerRef.current.requestFullscreen();
                } else if ((containerRef.current as any).webkitRequestFullscreen) {
                  await (containerRef.current as any).webkitRequestFullscreen();
                } else if ((containerRef.current as any).mozRequestFullScreen) {
                  await (containerRef.current as any).mozRequestFullScreen();
                } else if ((containerRef.current as any).msRequestFullscreen) {
                  await (containerRef.current as any).msRequestFullscreen();
                }
                setIsFullscreen(true);
              }
            } catch (error) {
              console.log('Fullscreen request failed:', error);
            }
          };

          // Try to lock orientation to landscape (optional, may not work on all devices)
          const lockOrientation = async () => {
            try {
              if (screen.orientation && (screen.orientation as any).lock) {
                await (screen.orientation as any).lock('landscape');
              } else if ((screen as any).lockOrientation) {
                await (screen as any).lockOrientation('landscape');
              } else if ((screen as any).mozLockOrientation) {
                await (screen as any).mozLockOrientation('landscape');
              } else if ((screen as any).msLockOrientation) {
                await (screen as any).msLockOrientation('landscape');
              }
            } catch (error) {
              // Orientation lock often fails, that's okay
              console.log('Orientation lock failed (this is normal):', error);
            }
          };

          // Small delay to ensure component is mounted
          // Longer delay for Samsung devices to ensure proper rendering
          const delay = isSamsung ? 500 : 300;
          setTimeout(() => {
            requestFullscreen();
            // Only try orientation lock on Android/Samsung devices
            if (isAndroid || isSamsung) {
              lockOrientation();
            }
          }, delay);
        }
      };

      checkMobile();

      // Handle fullscreen change events
      const handleFullscreenChange = () => {
        const isCurrentlyFullscreen = !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        );
        setIsFullscreen(isCurrentlyFullscreen);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);

      setIsPlaying(false);
      setCurrentTime(0);
      setShowControls(true);
      
      // Autoplay when modal opens
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Autoplay failed, that's okay
            console.log('Autoplay failed');
          });
        }
      }, 100); // Small delay to ensure video is ready
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      };
    }
    
    return undefined; // Explicit return for when isOpen is false
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm ${
            isMobile ? 'landscape:flex-row portrait:flex-col' : ''
          }`}
          onClick={async () => {
            // Exit fullscreen if in fullscreen mode
            if (isFullscreen) {
              try {
                if (document.exitFullscreen) {
                  await document.exitFullscreen();
                } else if ((document as any).webkitExitFullscreen) {
                  await (document as any).webkitExitFullscreen();
                } else if ((document as any).mozCancelFullScreen) {
                  await (document as any).mozCancelFullScreen();
                } else if ((document as any).msExitFullscreen) {
                  await (document as any).msExitFullscreen();
                }
              } catch (error) {
                console.log('Exit fullscreen failed:', error);
              }
            }
            onClose();
          }}
          style={{
            ...(isMobile && {
              minHeight: '100dvh', // Dynamic viewport height for mobile
            })
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`relative bg-black overflow-hidden shadow-2xl ${
              isMobile 
                ? 'w-full h-full rounded-none' 
                : 'w-[90vw] max-w-6xl max-h-[90vh] rounded-2xl'
            }`}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={() => setShowControls(true)}
            onTouchStart={() => setShowControls(true)}
          >
            {/* Close Button */}
            <button
              onClick={async () => {
                // Exit fullscreen if in fullscreen mode
                if (isFullscreen) {
                  try {
                    if (document.exitFullscreen) {
                      await document.exitFullscreen();
                    } else if ((document as any).webkitExitFullscreen) {
                      await (document as any).webkitExitFullscreen();
                    } else if ((document as any).mozCancelFullScreen) {
                      await (document as any).mozCancelFullScreen();
                    } else if ((document as any).msExitFullscreen) {
                      await (document as any).msExitFullscreen();
                    }
                  } catch (error) {
                    console.log('Exit fullscreen failed:', error);
                  }
                }
                onClose();
              }}
              className={`absolute z-20 bg-black/70 hover:bg-black/90 active:bg-black/95 rounded-full flex items-center justify-center transition-all duration-200 touch-manipulation ${
                isMobile 
                  ? 'top-3 right-3 w-12 h-12 sm:top-4 sm:right-4 sm:w-14 sm:h-14' 
                  : 'top-4 right-4 w-10 h-10'
              }`}
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <X className={`text-white ${
                isMobile ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5'
              }`} />
            </button>

            {/* Video Element */}
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-contain"
              onClick={togglePlayPause}
              onTouchStart={togglePlayPause}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              muted={isMuted}
              playsInline
              style={{
                WebkitTapHighlightColor: 'transparent',
              }}
            />

            {/* Video Controls */}
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent ${
                    isMobile ? 'p-4 sm:p-6' : 'p-6'
                  }`}
                  onTouchStart={(e) => e.stopPropagation()}
                >
                  {/* Progress Bar */}
                  <div className={`mb-3 ${isMobile ? 'mb-4 sm:mb-5' : 'mb-4'}`}>
                    <div
                      className={`w-full bg-gray-600 rounded-full cursor-pointer relative group touch-manipulation ${
                        isMobile ? 'h-3 sm:h-3.5' : 'h-2'
                      }`}
                      onClick={handleSeek}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        setIsDragging(true);
                        const rect = e.currentTarget.getBoundingClientRect();
                        const touch = e.touches[0];
                        const percent = (touch.clientX - rect.left) / rect.width;
                        const newTime = percent * duration;
                        if (videoRef.current) {
                          videoRef.current.currentTime = newTime;
                          setCurrentTime(newTime);
                        }
                      }}
                      onTouchEnd={() => setIsDragging(false)}
                      onMouseDown={() => setIsDragging(true)}
                      onMouseUp={() => setIsDragging(false)}
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <div
                        className={`h-full bg-blue-500 rounded-full relative ${
                          isMobile ? 'h-3 sm:h-3.5' : 'h-2'
                        }`}
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      >
                        <div className={`absolute right-0 top-1/2 -translate-y-1/2 bg-blue-500 rounded-full transition-opacity ${
                          isMobile 
                            ? 'w-5 h-5 sm:w-6 sm:h-6 opacity-100' 
                            : 'w-4 h-4 opacity-0 group-hover:opacity-100'
                        }`} />
                      </div>
                    </div>
                  </div>

                  {/* Controls Row */}
                  <div className={`flex items-center justify-between flex-wrap gap-2 ${
                    isMobile ? 'gap-3 sm:gap-4' : ''
                  }`}>
                    <div className={`flex items-center ${
                      isMobile ? 'space-x-3 sm:space-x-4' : 'space-x-4'
                    }`}>
                      {/* Skip Back */}
                      <button
                        onClick={() => skipTime(-10)}
                        className={`flex items-center justify-center text-white hover:text-blue-400 active:text-blue-500 transition-colors touch-manipulation ${
                          isMobile ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10'
                        }`}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <SkipBack className={isMobile ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5'} />
                      </button>

                      {/* Play/Pause */}
                      <button
                        onClick={togglePlayPause}
                        className={`flex items-center justify-center bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-full text-white transition-colors touch-manipulation ${
                          isMobile ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-12 h-12'
                        }`}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        {isPlaying ? (
                          <Pause className={isMobile ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-6 h-6'} />
                        ) : (
                          <Play className={`ml-1 ${isMobile ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-6 h-6'}`} />
                        )}
                      </button>

                      {/* Skip Forward */}
                      <button
                        onClick={() => skipTime(10)}
                        className={`flex items-center justify-center text-white hover:text-blue-400 active:text-blue-500 transition-colors touch-manipulation ${
                          isMobile ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10'
                        }`}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        <SkipForward className={isMobile ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5'} />
                      </button>

                      {/* Time Display */}
                      <div className={`text-white font-mono ${
                        isMobile ? 'text-sm sm:text-base' : 'text-sm'
                      }`}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className={`flex items-center ${
                      isMobile ? 'space-x-3 sm:space-x-4' : 'space-x-4'
                    }`}>
                      {/* Mute Button */}
                      <button
                        onClick={toggleMute}
                        className={`flex items-center justify-center text-white hover:text-blue-400 active:text-blue-500 transition-colors touch-manipulation ${
                          isMobile ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10'
                        }`}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        {isMuted ? (
                          <VolumeX className={isMobile ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5'} />
                        ) : (
                          <Volume2 className={isMobile ? 'w-6 h-6 sm:w-7 sm:h-7' : 'w-5 h-5'} />
                        )}
                      </button>

                      {/* Title */}
                      <div className={`text-white font-semibold ${
                        isMobile ? 'text-sm sm:text-base' : ''
                      }`}>
                        {title}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};