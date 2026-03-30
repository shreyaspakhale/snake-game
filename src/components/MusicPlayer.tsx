import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#22d3ee"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "Glitch Master",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#d946ef"
  },
  {
    id: 3,
    title: "Digital Sunset",
    artist: "Lo-Fi Bot",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#84cc16"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md p-4 bg-black border-2 border-cyan-400 shadow-[4px_4px_0_#f0f]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-12 h-12 border-2 border-magenta-500 flex items-center justify-center bg-black"
        >
          <Music className="w-6 h-6 text-magenta-500 animate-pulse" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-bold text-cyan-400 truncate glitch-text">{currentTrack.title}</h3>
          <p className="text-xs text-magenta-400/70 truncate uppercase tracking-tighter">SOURCE: {currentTrack.artist}</p>
        </div>
      </div>

      <div className="relative w-full h-2 bg-magenta-500/20 border border-magenta-500/30 mb-4 overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_10px_#0ff]"
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button onClick={skipBackward} className="p-2 text-magenta-500 hover:text-white transition-colors">
          <SkipBack className="w-8 h-8" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-cyan-400 text-black border-2 border-magenta-500 shadow-[4px_4px_0_#f0f] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>

        <button onClick={skipForward} className="p-2 text-magenta-500 hover:text-white transition-colors">
          <SkipForward className="w-8 h-8" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-cyan-400/40 text-[10px]">
        <Volume2 className="w-3 h-3" />
        <div className="flex-1 h-1 bg-cyan-400/10 border border-cyan-400/20">
          <div className="w-2/3 h-full bg-magenta-500" />
        </div>
      </div>
    </div>
  );
}
