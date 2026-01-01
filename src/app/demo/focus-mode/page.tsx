"use client";

import { FullScreenVideoPlayer } from "../../components/FullScreenVideoPlayer";

export default function FocusModeDemoPage() {
  return (
    <FullScreenVideoPlayer
      videoSrc="https://cdn.salescentri.com/focus-mode-demo-video-h264.mp4"
      title="Focus Mode"
      description="Experience distraction-free sales automation"
    />
  );
}

