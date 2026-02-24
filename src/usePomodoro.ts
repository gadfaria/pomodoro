import { useState, useEffect, useCallback, useRef } from "react";

export type Mode = "pomodoro" | "shortBreak" | "longBreak";

interface PomodoroState {
  mode: Mode;
  timeLeft: number;
  isRunning: boolean;
  pomodoroCount: number;
}

const DURATIONS: Record<Mode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const LABELS: Record<Mode, string> = {
  pomodoro: "Pomodoro",
  shortBreak: "Pausa Curta",
  longBreak: "Pausa Longa",
};

export function usePomodoro() {
  const [state, setState] = useState<PomodoroState>({
    mode: "pomodoro",
    timeLeft: DURATIONS.pomodoro,
    isRunning: false,
    pomodoroCount: 0,
  });

  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback(() => {
    try {
      const ctx = audioRef.current ?? new AudioContext();
      audioRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio not available
    }
  }, []);

  const switchMode = useCallback((newMode: Mode) => {
    setState((prev) => ({
      ...prev,
      mode: newMode,
      timeLeft: DURATIONS[newMode],
      isRunning: false,
    }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      timeLeft: DURATIONS[prev.mode],
      isRunning: false,
    }));
  }, []);

  // Timer tick
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.timeLeft <= 1) {
            playBeep();
            // Auto-switch on completion
            if (prev.mode === "pomodoro") {
              const newCount = prev.pomodoroCount + 1;
              // Every 4 pomodoros → long break
              const nextMode: Mode = newCount % 4 === 0 ? "longBreak" : "shortBreak";
              return {
                mode: nextMode,
                timeLeft: DURATIONS[nextMode],
                isRunning: false,
                pomodoroCount: newCount,
              };
            } else {
              return {
                mode: "pomodoro",
                timeLeft: DURATIONS.pomodoro,
                isRunning: false,
                pomodoroCount: prev.pomodoroCount,
              };
            }
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, playBeep]);

  // Update document title
  useEffect(() => {
    const mins = Math.floor(state.timeLeft / 60);
    const secs = state.timeLeft % 60;
    const time = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    document.title = `${time} - ${LABELS[state.mode]}`;
  }, [state.timeLeft, state.mode]);

  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = 1 - state.timeLeft / DURATIONS[state.mode];

  return {
    mode: state.mode,
    isRunning: state.isRunning,
    pomodoroCount: state.pomodoroCount,
    formattedTime,
    progress,
    switchMode,
    toggle,
    reset,
    labels: LABELS,
  };
}
