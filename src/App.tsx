import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Activity, Cpu } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono selection:bg-magenta-500/50 overflow-hidden relative">
      <div className="static-overlay" />
      <div className="scanline" />

      {/* Header / Terminal Interface */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b-2 border-magenta-500 bg-black/80">
        <div className="flex items-center gap-4">
          <Terminal className="w-8 h-8 text-magenta-500 animate-pulse" />
          <h1 className="text-3xl font-bold tracking-widest glitch-text">
            SNAKE_PROTOCOL_V.04
          </h1>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-tighter text-magenta-500">DATA_YIELD</span>
            <span className="text-4xl font-bold glitch-text">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-tighter text-magenta-500">PEAK_EFFICIENCY</span>
            <span className="text-4xl font-bold text-white">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left - System Status */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div className="p-4 glitch-border bg-black/60 space-y-4">
            <h3 className="text-lg font-bold uppercase text-magenta-500 flex items-center gap-2">
              <Activity className="w-5 h-5" /> SYSTEM_LOG
            </h3>
            <div className="text-xs space-y-1 opacity-80">
              <p className="text-cyan-400">[OK] NEURAL_LINK_ESTABLISHED</p>
              <p className="text-magenta-400">[WARN] BUFFER_OVERFLOW_IMMUTABLE</p>
              <p className="text-cyan-400">[OK] AUDIO_STREAM_SYNCED</p>
              <p className="text-yellow-400">[!] ENTROPY_LEVELS_RISING</p>
            </div>
          </div>

          <div className="p-4 glitch-border bg-black/60 space-y-4">
            <h3 className="text-lg font-bold uppercase text-cyan-400 flex items-center gap-2">
              <Cpu className="w-5 h-5" /> INPUT_MAP
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="border border-magenta-500/30 p-1">DIR_UP: ↑</div>
              <div className="border border-magenta-500/30 p-1">DIR_DN: ↓</div>
              <div className="border border-magenta-500/30 p-1">DIR_LT: ←</div>
              <div className="border border-magenta-500/30 p-1">DIR_RT: →</div>
              <div className="border border-magenta-500/30 p-1 col-span-2 text-center">HALT: SPACE</div>
            </div>
          </div>
        </div>

        {/* Center - Execution Grid */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="relative p-2 glitch-border bg-magenta-500/10">
            <SnakeGame onScoreChange={handleScoreChange} />
          </div>
        </div>

        {/* Right - Sonic Module */}
        <div className="lg:col-span-3 flex flex-col items-center lg:items-end order-3">
          <div className="w-full glitch-border p-1 bg-black">
            <MusicPlayer />
          </div>
          
          <div className="mt-8 text-right hidden lg:block">
            <p className="text-xs tracking-widest text-magenta-500 font-bold animate-pulse">
              MACHINE_ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
            <div className="flex justify-end gap-1 mt-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-1 h-8 bg-magenta-500/20 border-x border-cyan-400/20">
                  <motion.div 
                    className="w-full bg-magenta-500"
                    animate={{ height: [Math.random()*100 + '%', Math.random()*100 + '%', Math.random()*100 + '%'] }}
                    transition={{ repeat: Infinity, duration: 0.2 + Math.random()*0.5 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="absolute bottom-0 w-full px-6 py-2 flex justify-between items-center text-xs tracking-tighter text-magenta-500 border-t-2 border-cyan-400 bg-black/90">
        <div>CORE_TEMP: 42°C // MEM_LOAD: 88% // STATUS: UNSTABLE</div>
        <div className="flex gap-8">
          <span className="hover:text-white cursor-crosshair">[REDACTED]</span>
          <span className="hover:text-white cursor-crosshair">VOID_LINK</span>
        </div>
      </footer>
    </div>
  );
}
