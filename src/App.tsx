import { usePomodoro, type Mode } from "./usePomodoro";

const BG_COLORS: Record<Mode, string> = {
  pomodoro: "bg-pomodoro",
  shortBreak: "bg-short-break",
  longBreak: "bg-long-break",
};

// const BTN_COLORS: Record<Mode, string> = {
//   pomodoro: "bg-pomodoro-dark hover:bg-pomodoro-light",
//   shortBreak: "bg-short-break-dark hover:bg-short-break-light",
//   longBreak: "bg-long-break-dark hover:bg-long-break-light",
// };

const TEXT_COLORS: Record<Mode, string> = {
  pomodoro: "text-pomodoro-dark",
  shortBreak: "text-short-break-dark",
  longBreak: "text-long-break-dark",
};

const MODES: { key: Mode; label: string }[] = [
  { key: "pomodoro", label: "Pomodoro" },
  { key: "shortBreak", label: "Pausa Curta" },
  { key: "longBreak", label: "Pausa Longa" },
];

function App() {
  const {
    mode,
    isRunning,
    pomodoroCount,
    formattedTime,
    progress,
    switchMode,
    toggle,
    reset,
  } = usePomodoro();

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${BG_COLORS[mode]}`}
    >
      <div className="w-full max-w-md px-4">
        {/* Header */}
        <h1 className="text-white text-2xl font-bold text-center mb-8 tracking-wide">
          🍅 Pomodoro
        </h1>

        {/* Mode selector */}
        <div className="flex justify-center gap-2 mb-8">
          {MODES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchMode(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-all cursor-pointer ${
                mode === key
                  ? "bg-black/20 scale-105"
                  : "bg-transparent hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Timer card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center shadow-lg">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/20 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-white/70 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Time display */}
          <div className="text-white text-8xl font-bold tabular-nums tracking-tight mb-8 select-none">
            {formattedTime}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={toggle}
              className={`px-12 py-4 rounded-xl text-lg font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-95 ${TEXT_COLORS[mode]} bg-white hover:bg-white/90`}
            >
              {isRunning ? "Pausar" : "Iniciar"}
            </button>

            {(isRunning || progress > 0) && (
              <button
                onClick={reset}
                className="p-4 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Resetar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Pomodoro counter */}
        <div className="mt-8 text-center text-white/70 text-sm">
          <span>#{pomodoroCount} pomodoros completos</span>
          <div className="flex justify-center gap-1.5 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < pomodoroCount % 4
                    ? "bg-white scale-110"
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
