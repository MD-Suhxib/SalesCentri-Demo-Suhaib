"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface FullScreenVideoPlayerProps {
  videoSrc: string;
  title: string;
  description?: string;
}

export const FullScreenVideoPlayer: React.FC<FullScreenVideoPlayerProps> = ({
  videoSrc,
  title,
  description,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMobilePrompt, setShowMobilePrompt] = useState(false);
  const router = useRouter();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      // When playing starts, set timeout to hide controls
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const requestFullscreen = async () => {
    // iOS Safari requires fullscreen on the <video> element
    if (isIOS && videoRef.current) {
      const videoElement = videoRef.current as HTMLVideoElement & {
        webkitEnterFullscreen?: () => void;
      };
      if (typeof videoElement.webkitEnterFullscreen === 'function') {
        videoElement.webkitEnterFullscreen();
        setIsFullscreen(true);
        return;
      }
    }

    if (!containerRef.current) return;

    try {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        await (containerRef.current as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        await (containerRef.current as any).mozRequestFullScreen();
        setIsFullscreen(true);
      } else if ((containerRef.current as any).msRequestFullscreen) {
        await (containerRef.current as any).msRequestFullscreen();
        setIsFullscreen(true);
      } else if (videoRef.current) {
        const videoElement = videoRef.current as HTMLVideoElement & {
          webkitEnterFullscreen?: () => void;
        };
        if (typeof videoElement.webkitEnterFullscreen === 'function') {
          videoElement.webkitEnterFullscreen();
          setIsFullscreen(true);
        }
      }
    } catch (error) {
      console.log('Fullscreen request failed:', error);
      throw error;
    }
  };

  const lockOrientation = async () => {
    if (isIOS) {
      // iOS Safari does not allow programmatic orientation locking in most contexts
      return;
    }

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
      console.log('Orientation lock failed:', error);
    }
  };

  const handleEnterFullscreen = async () => {
    try {
      await requestFullscreen();
      await lockOrientation();
      setShowMobilePrompt(false);
    } catch (error) {
      console.log('Fullscreen request failed:', error);
    }

    if (videoRef.current && videoRef.current.paused) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
        setHasStarted(true);
      } catch (error) {
        console.log('Play failed:', error);
      }
    }
  };

  // Detect mobile/iOS devices and control the prompt visibility
  useEffect(() => {
    const checkMobile = () => {
      if (typeof navigator === 'undefined') return;

      const userAgent = navigator.userAgent || '';
      const isMobileDevice =
        /iPhone|iPad|iPod|Android/i.test(userAgent) ||
        (typeof window !== 'undefined' && window.innerWidth < 768);
      const isiOSDevice = /iPhone|iPad|iPod/i.test(userAgent);

      setIsMobile(isMobileDevice);
      setIsIOS(isiOSDevice);
      setShowMobilePrompt(isMobileDevice && !isFullscreen);
    };

    checkMobile();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);

      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }

    return () => undefined;
  }, [isFullscreen]);

  // Handle fullscreen change events for non-iOS browsers
  useEffect(() => {
    if (isIOS) return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);
      if (isCurrentlyFullscreen) {
        setShowMobilePrompt(false);
      } else if (isMobile) {
        setShowMobilePrompt(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isIOS, isMobile]);

  // Handle iOS-specific fullscreen events
  useEffect(() => {
    if (!isIOS || !videoRef.current) return;

    const videoElement = videoRef.current as HTMLVideoElement & {
      webkitBeginFullscreen?: () => void;
      webkitEndFullscreen?: () => void;
    };

    const handleIOSBeginFullscreen = () => {
      setIsFullscreen(true);
      setShowMobilePrompt(false);
    };

    const handleIOSEndFullscreen = () => {
      setIsFullscreen(false);
      if (isMobile) {
        setShowMobilePrompt(true);
      }
    };

    videoElement.addEventListener('webkitbeginfullscreen' as any, handleIOSBeginFullscreen);
    videoElement.addEventListener('webkitendfullscreen' as any, handleIOSEndFullscreen);

    return () => {
      videoElement.removeEventListener('webkitbeginfullscreen' as any, handleIOSBeginFullscreen);
      videoElement.removeEventListener('webkitendfullscreen' as any, handleIOSEndFullscreen);
    };
  }, [isIOS, isMobile, videoSrc]);

  // Autoplay video when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        // Set muted for autoplay compatibility
        videoRef.current.muted = true;
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch((error) => {
            console.log('Autoplay failed:', error);
            // User interaction may be required for autoplay
            // Show play button overlay
          });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.log('Play failed:', error));
    }
  };

  const handleClose = async () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // Exit fullscreen if in fullscreen mode
    if (isFullscreen) {
      try {
        if (isIOS && videoRef.current) {
          const videoElement = videoRef.current as HTMLVideoElement & {
            webkitExitFullscreen?: () => void;
            webkitExitFullScreen?: () => void;
          };

          if (typeof videoElement.webkitExitFullscreen === 'function') {
            videoElement.webkitExitFullscreen();
          } else if (typeof videoElement.webkitExitFullScreen === 'function') {
            videoElement.webkitExitFullScreen();
          }
        } else if (document.exitFullscreen) {
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

    if (isMobile) {
      setShowMobilePrompt(true);
    }
    
    router.push('/demo');
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-black flex items-center justify-center ${
          isMobile ? 'landscape:flex-row portrait:flex-col' : ''
        }`}
        style={{
          ...(isMobile && {
            minHeight: '100dvh', // Dynamic viewport height for mobile
          })
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute z-20 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 group ${
            isMobile 
              ? 'top-2 right-2 w-10 h-10 sm:top-4 sm:right-4 sm:w-12 sm:h-12' 
              : 'top-4 right-4 w-12 h-12'
          }`}
          aria-label="Close video"
        >
          <X className={`text-white group-hover:text-gray-300 ${
            isMobile ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6'
          }`} />
        </button>

        {/* Video Container */}
        <div 
          className={`relative w-full h-full flex items-center justify-center ${
            isMobile ? 'p-2 sm:p-4' : 'p-4'
          }`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          onClick={handleMouseMove}
        >
          {isMobile && showMobilePrompt ? (
            <div className="absolute inset-x-6 top-16 z-30 flex flex-col items-center gap-3 rounded-2xl bg-black/70 p-4 text-center text-white shadow-lg sm:inset-x-auto sm:top-20 sm:max-w-xs">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
                Rotate For Best Experience
              </p>
              <p className="text-sm text-gray-200">
                Tap below and rotate your device to watch the demo in fullscreen landscape.
              </p>
              <button
                onClick={handleEnterFullscreen}
                className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
              >
                Enter Fullscreen
              </button>
            </div>
          ) : null}
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-contain"
            onClick={handlePlayPause}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            loop
            playsInline
            preload="auto"
            autoPlay
            muted={isMuted}
          />

          {/* Play/Pause Overlay - Show when video is paused */}
          {!hasStarted || !isPlaying ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-200 cursor-pointer"
              onClick={handlePlayPause}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <motion.div
                className={`bg-white/90 rounded-full flex items-center justify-center shadow-2xl ${
                  isMobile ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-20 h-20'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {!isPlaying ? (
                  <svg
                    className={`text-black ml-1 ${
                      isMobile ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg
                    className={`text-black ${
                      isMobile ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          ) : null}

          {/* Title, Description and Controls Overlay */}
          {title && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent ${
                isMobile ? 'p-4 pb-8' : 'p-8 pb-12'
              }`}
            >
              <div className="max-w-5xl mx-auto w-full space-y-4">
                {/* Progress Bar */}
                <div className="flex items-center gap-3 text-xs font-medium text-gray-300 group">
                  <span className="min-w-[40px] text-right">{formatTime(currentTime)}</span>
                  <div className="relative flex-1 h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="min-w-[40px]">{formatTime(duration)}</span>
                </div>

                <div className={`flex items-end justify-between ${
                  isMobile ? 'flex-col items-start gap-2' : ''
                }`}>
                  <div className={isMobile ? 'w-full' : ''}>
                    <h1 className={`font-bold text-white mb-1 ${
                      isMobile ? 'text-xl' : 'text-3xl'
                    }`}>
                      {title}
                    </h1>
                    {description && (
                      <p className={`text-gray-300 ${
                        isMobile ? 'text-sm' : 'text-lg'
                      }`}>
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

