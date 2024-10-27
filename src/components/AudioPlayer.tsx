"use client";

import React, { useEffect, useState } from "react";
import { useAudioPlayer } from "react-use-audio-player";

export default function AudioPlayer({ audioSrc }: { audioSrc: Blob }) {
  const { load, play, playing } = useAudioPlayer();
  const [audioURL, setAudioURL] = useState<string | null>(null);

  useEffect(() => {
    // Convert Blob to a URL and set it as the audio source
    if (audioSrc) {
      const url = URL.createObjectURL(audioSrc);
      setAudioURL(url);

      // Cleanup on unmount
      return () => URL.revokeObjectURL(url);
    }
  }, [audioSrc]);

  const handleClick = () => {
    if (audioURL) {
      load(audioURL);
      play();
    }
  };

  return (
    <div>
      <button onClick={handleClick}>{playing ? "Pause" : "Play"}</button>
    </div>
  );
}
