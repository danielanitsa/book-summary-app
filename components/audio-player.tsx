"use client";

import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  audioPath: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioPath }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10); // Skip back 10 seconds
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10); // Skip forward 10 seconds
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="relative p-4 w-full max-w-lg mx-auto bg-glass backdrop-blur-md rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="text-left">
          <h2 className="text-lg font-bold text-white">
            {isPlaying ? "Now Playing" : "Press The Button To Play"}
          </h2>
          <p className="text-sm text-gray-300">{`Duration ${formatTime(duration)}`}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleSkipBack}>
            <SkipBack size={24} />
          </Button>
          <Button onClick={togglePlayPause}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </Button>
          <Button onClick={handleSkipForward}>
            <SkipForward size={24} />
          </Button>
        </div>
      </div>
      <div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full"
        />
      </div>
      <audio ref={audioRef} src={audioPath} />
    </div>
  );
};

export default AudioPlayer;
