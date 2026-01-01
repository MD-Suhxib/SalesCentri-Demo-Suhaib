"use client";

import { FullScreenVideoPlayer } from "../../components/FullScreenVideoPlayer";

export default function LightningModeDemoPage() {
  return (
    <FullScreenVideoPlayer
      videoSrc="https://cdn.salescentri.com/lightning-mode-demo-video-h264.mp4"
      title="Lightning Mode"
      description="Ultra-fast AI-powered research and insights"
    />
  );
}

