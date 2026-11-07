"use client";

import { useEffect } from "react";

export default function EmbedHeightReporter() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Only post messages when we're inside an iframe
    if (window.parent === window) return;

    function reportHeight() {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "gutschein-resize", height }, "*");
    }

    reportHeight();

    const observer = new MutationObserver(reportHeight);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    const resizeObserver = new ResizeObserver(reportHeight);
    resizeObserver.observe(document.body);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return null;
}
