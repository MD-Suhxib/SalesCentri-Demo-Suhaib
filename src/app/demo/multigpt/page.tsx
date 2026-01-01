"use client";

import { FullScreenVideoPlayer } from "../../components/FullScreenVideoPlayer";

export default function MultiGPTDemoPage() {
  return (
    <FullScreenVideoPlayer
      videoSrc="https://cdn.salescentri.com/multi-gpt-demo-video-h264.mp4"
      title="MultiGPT"
      description="Multi-source aggregated AI research"
    />
  );
}

