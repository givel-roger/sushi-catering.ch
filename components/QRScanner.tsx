"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onScan: (code: string) => void;
  scanning: boolean;
};

export default function QRScanner({ onScan, scanning }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!scanning) {
      stopCamera();
      return;
    }
    startCamera();
    return () => stopCamera();
  }, [scanning]);

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        startScanLoop();
      }
    } catch {
      setError("Kamera-Zugriff verweigert. Bitte erlaube den Kamera-Zugriff in den Browser-Einstellungen.");
    }
  }

  function stopCamera() {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }

  function startScanLoop() {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      try {
        const { BarcodeDetector } = globalThis as any;
        if (typeof BarcodeDetector !== "undefined") {
          const detector = new BarcodeDetector({ formats: ["qr_code"] });
          const barcodes = await detector.detect(canvas);
          if (barcodes.length > 0) {
            const url = barcodes[0].rawValue;
            const code = extractCode(url);
            if (code) {
              stopCamera();
              onScan(code);
              return;
            }
          }
        }
      } catch {
        // BarcodeDetector not available — fallback below
      }

      // BarcodeDetector covers Chrome, Edge, Android WebView, Safari 17.2+
      // For older browsers, manual code entry is available as fallback
    }, 500);
  }

  function extractCode(text: string): string | null {
    // URL: /r/slug/einloesen?code=XX-XXXX-XXXX
    try {
      const url = new URL(text);
      const code = url.searchParams.get("code");
      if (code) return code;
    } catch {
      // Not a URL
    }
    // Direct code pattern
    if (/^[A-Z]{2,4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(text)) return text;
    return null;
  }

  return (
    <div className="relative">
      {error && (
        <div className="bg-red-50 text-red-700 rounded-lg p-4 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="relative aspect-square max-w-sm mx-auto bg-black rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {cameraActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-white/60 rounded-lg relative">
              <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-3 border-l-3 border-white rounded-tl-md" />
              <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-3 border-r-3 border-white rounded-tr-md" />
              <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-3 border-l-3 border-white rounded-bl-md" />
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-3 border-r-3 border-white rounded-br-md" />
            </div>
          </div>
        )}

        {!cameraActive && !error && scanning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
