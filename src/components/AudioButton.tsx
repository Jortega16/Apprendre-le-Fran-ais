/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { speakWord } from '../data';

interface AudioButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AudioButton({ text, className = "", size = "md" }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useSlowMode, setUseSlowMode] = useState(false);

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;

    setIsPlaying(true);
    
    // Slow down speed rate if slow mode is toggled
    const rateOverride = useSlowMode ? 0.6 : 0.85;
    
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = rateOverride;

        // Load voices
        const voices = window.speechSynthesis.getVoices();
        const frVoice = voices.find(v => v.lang.toLowerCase().includes('fr-') || v.lang.toLowerCase() === 'fr');
        if (frVoice) {
          utterance.voice = frVoice;
        }

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Speech Synthesis Error:", err);
      setIsPlaying(false);
    }
  };

  const toggleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUseSlowMode(!useSlowMode);
  };

  const sizeClasses = {
    sm: "p-1 text-xs",
    md: "p-2 text-sm",
    lg: "p-3 text-base"
  };

  return (
    <div id={`audio-button-container-${text.slice(0, 5).replace(/[^a-zA-Z]/g, '')}`} className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        id={`audio-play-${text.slice(0, 5).replace(/[^a-zA-Z]/g, '')}`}
        type="button"
        onClick={handleSpeak}
        title="Escuchar pronunciación"
        className={`flex items-center justify-center rounded-lg transition-all border ${
          isPlaying 
            ? "bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300 animate-pulse" 
            : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
        } ${sizeClasses[size]}`}
      >
        <Volume2 className={`w-4 h-4 ${isPlaying ? "scale-110" : ""}`} />
        {isPlaying && <span className="ml-1 text-[10px] font-medium tracking-wide">Écoute...</span>}
      </button>

      <button
        id={`audio-speed-toggle-${text.slice(0, 5).replace(/[^a-zA-Z]/g, '')}`}
        type="button"
        onClick={toggleSpeed}
        title={useSlowMode ? "Velocidad: Lenta (clic para Normal)" : "Velocidad: Normal (clic para Lenta)"}
        className={`flex items-center justify-center rounded-lg transition-all border p-1 text-[10px] uppercase font-bold tracking-tight ${
          useSlowMode
            ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
        }`}
      >
        {useSlowMode ? "0.6x 🐢" : "1.0x ⚡"}
      </button>
    </div>
  );
}
