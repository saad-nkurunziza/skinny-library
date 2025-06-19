"use client";

import { useEffect } from "react";

export function BackgroundTaskTrigger() {
  useEffect(() => {
    fetch("/api/background-task", {
      method: "POST",
    }).catch((error) => {
      console.error("Background task failed:", error);
    });
  }, []);

  return null;
}
