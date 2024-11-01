"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import {
  ObjectDetector,
  FilesetResolver,
  Detection,
  ObjectDetectorResult,
} from "@mediapipe/tasks-vision";
import { Button } from "@/components/ui/button";

const ObjectDetectionComponent = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objectDetector, setObjectDetector] = useState<ObjectDetector | null>(
    null
  );
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const childrenRef = useRef<HTMLElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const detectionDivRef = useRef<HTMLDivElement>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  let animationFrameId: number;

  // Initialize the object detector
  useEffect(() => {
    const initializeObjectDetector = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
        );
        const detector = await ObjectDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `models/efficientdet_lite0.tflite`,
          },
          scoreThreshold: 0.5,
          runningMode: "VIDEO",
        });

        setObjectDetector(detector);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing object detector:", error);
        setIsLoading(false);
      }
    };

    initializeObjectDetector();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const displayVideoDetections = useCallback((result: ObjectDetectorResult) => {
    if (!detectionDivRef.current || !webcamRef.current?.video) return;

    // Remove previous detections
    childrenRef.current.forEach((child) => {
      detectionDivRef.current?.removeChild(child);
    });
    childrenRef.current = [];

    const videoElement = webcamRef.current.video;
    const { videoWidth, videoHeight } = videoElement;
    const detectionDiv = detectionDivRef.current;
    const scale = Math.min(
      detectionDiv.offsetWidth / videoWidth,
      detectionDiv.offsetHeight / videoHeight
    );

    result.detections.forEach((detection) => {
      // Create label
      const label = document.createElement("div");
      label.className =
        "absolute z-10 bg-black/50 text-white px-2 py-1 text-sm rounded-md";
      label.textContent = `${detection.categories[0].categoryName} ${Math.round(
        detection.categories[0].score * 100
      )}%`;

      // Create bounding box
      const box = document.createElement("div");
      box.className = "absolute border-2 border-green-500 rounded-md";

      // Calculate scaled positions
      const x = detection.boundingBox.originX * scale;
      const y = detection.boundingBox.originY * scale;
      const width = detection.boundingBox.width * scale;
      const height = detection.boundingBox.height * scale;

      // Position elements
      box.style.left = `${x}px`;
      box.style.top = `${y}px`;
      box.style.width = `${width}px`;
      box.style.height = `${height}px`;

      label.style.left = `${x}px`;
      label.style.top = `${y - 25}px`;

      detectionDiv.appendChild(box);
      detectionDiv.appendChild(label);

      childrenRef.current.push(box);
      childrenRef.current.push(label);
    });
  }, []);

  const predictWebcam = useCallback(async () => {
    if (!objectDetector || !webcamRef.current?.video || !isWebcamActive) return;

    const video = webcamRef.current.video;

    // Check if video is ready and has valid dimensions
    if (
      video.readyState !== 4 ||
      !video.videoWidth ||
      !video.videoHeight ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      animationFrameId = requestAnimationFrame(predictWebcam);
      return;
    }

    // Check if we have a new frame
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      try {
        const startTimeMs = performance.now();
        const detections = objectDetector.detectForVideo(video, startTimeMs);
        console.log(detections);
        displayVideoDetections(detections);
      } catch (error) {
        console.error("Error during object detection:", error);
      }
    }

    animationFrameId = requestAnimationFrame(predictWebcam);
  }, [objectDetector, isWebcamActive, displayVideoDetections]);

  const handleStartWebcam = useCallback(() => {
    setIsWebcamActive(true);
  }, []);

  const handleStopWebcam = useCallback(() => {
    setIsWebcamActive(false);
  }, []);

  // Handle webcam initialization
  const handleWebcamLoad = useCallback(() => {
    if (webcamRef.current?.video) {
      // Ensure video is fully loaded
      webcamRef.current.video.addEventListener("loadeddata", () => {
        predictWebcam();
      });
    }
  }, [predictWebcam]);

  useEffect(() => {
    if (isWebcamActive) {
      handleWebcamLoad();
    }

    return () => {
      if (webcamRef.current?.video) {
        webcamRef.current.video.removeEventListener(
          "loadeddata",
          predictWebcam
        );
      }
    };
  }, [isWebcamActive, handleWebcamLoad, predictWebcam]);

  return (
    <div className="py-10 grid grid-cols-2 gap-4 border-2 rounded-xl p-4">
      {isLoading ? (
        <div className="text-center py-4">Loading object detector...</div>
      ) : (
        <>
          {!isWebcamActive ? (
            <Button
              onClick={handleStartWebcam}
              className="mx-auto block mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Start Webcam
            </Button>
          ) : (
            <Button
              onClick={handleStopWebcam}
              className="mx-auto block mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              Stop webcam
            </Button>
          )}

          {isWebcamActive && (
            <div className="relative" ref={detectionDivRef}>
              <Webcam
                ref={webcamRef}
                className="w-full rounded-lg"
                
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 640,
                  height: 480,
                  facingMode: "user",
                }}
                onLoadedMetadata={handleWebcamLoad}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ObjectDetectionComponent;
