'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

interface Lap {
  lapNumber: number;
  time: number;
}

export default function WorkoutTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const centis = Math.floor((ms % 1000) / 10);
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  };

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    const startTime = Date.now() - time;
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTime);
    }, 10);
  }, [isRunning, time]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    pause();
    setTime(0);
    setLaps([]);
  }, [pause]);

  const lap = useCallback(() => {
    if (!isRunning || time === 0) return;
    const lastLapTime = laps.length > 0 ? laps.reduce((sum, l) => sum + l.time, 0) : 0;
    setLaps(prev => [...prev, { lapNumber: prev.length + 1, time: time - lastLapTime }]);
  }, [isRunning, time, laps]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const totalTime = time;

  return (
    <div className="bg-surface rounded-xl border border-outline-variant p-6 shadow-elevated">
      <h3 className="text-headline-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
        Workout Timer
      </h3>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <p className="text-headline-lg font-bold text-on-surface font-mono tracking-wider">
          {formatTime(time)}
        </p>
        {laps.length > 0 && (
          <p className="text-label-md text-on-surface-variant mt-1">
            Lap {laps.length}: {formatTime(laps[laps.length - 1].time)}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 mb-4">
        {!isRunning ? (
          <button
            onClick={start}
            className="w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-all shadow-lg"
          >
            <Play className="w-6 h-6 ml-0.5" />
          </button>
        ) : (
          <button
            onClick={pause}
            className="w-14 h-14 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center hover:bg-tertiary/90 transition-all shadow-lg"
          >
            <Pause className="w-6 h-6" />
          </button>
        )}
        <button
          onClick={lap}
          disabled={!isRunning || time === 0}
          className="w-14 h-14 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center hover:bg-surface-container-high transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Flag className="w-5 h-5" />
        </button>
        <button
          onClick={reset}
          disabled={time === 0}
          className="w-14 h-14 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center hover:bg-surface-container-high transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="mt-4 space-y-1 max-h-40 overflow-y-auto">
          {laps.map((lap) => (
            <div
              key={lap.lapNumber}
              className="flex justify-between items-center py-1.5 px-3 rounded-lg bg-surface-container text-sm"
            >
              <span className="text-on-surface-variant">Lap {lap.lapNumber}</span>
              <span className="font-mono font-semibold text-on-surface">{formatTime(lap.time)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
