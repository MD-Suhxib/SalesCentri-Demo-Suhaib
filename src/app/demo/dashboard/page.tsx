"use client";

import { FullScreenVideoPlayer } from "../../components/FullScreenVideoPlayer";

export default function DashboardDemoPage() {
  return (
    <FullScreenVideoPlayer
      videoSrc="https://cdn.salescentri.com/dashboard-demo-video.mp4"
      title="Dashboard"
      description="Comprehensive analytics and insights"
    />
  );
}

