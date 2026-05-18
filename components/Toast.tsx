"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, 0 = manual dismiss only
}

interface ToastContextValue {
  toast: (opts: Omit<ToastItem, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ─── Config ───────────────────────────────────────────────────────────
const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={20} />,
  error: <XCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

const STYLE_MAP: Record<
  ToastType,
  { bg: string; border: string; icon: string; bar: string }
> = {
  success: {
    bg: "bg-white",
    border: "border-emerald-200",
    icon: "text-emerald-500",
    bar: "bg-emerald-500",
  },
  error: {
    bg: "bg-white",
    border: "border-red-200",
    icon: "text-red-500",
    bar: "bg-red-500",
  },
  warning: {
    bg: "bg-white",
    border: "border-amber-200",
    icon: "text-amber-500",
    bar: "bg-amber-500",
  },
  info: {
    bg: "bg-white",
    border: "border-blue-200",
    icon: "text-blue-500",
    bar: "bg-blue-500",
  },
};

const DEFAULT_DURATION = 4500;

// ─── Single Toast ─────────────────────────────────────────────────────
function SingleToast({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const remainingRef = useRef(item.duration ?? DEFAULT_DURATION);

  const style = STYLE_MAP[item.type];
  const duration = item.duration ?? DEFAULT_DURATION;

  // Entrance animation
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Progress bar + auto-dismiss
  const startTimer = useCallback(() => {
    if (duration === 0) return;
    startRef.current = performance.now();

    const tick = (now: number) => {
      if (pausedRef.current) return;
      const elapsed = now - startRef.current;
      const left = Math.max(0, remainingRef.current - elapsed);
      setProgress((left / duration) * 100);

      if (left <= 0) {
        dismiss();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [duration]);

  const pauseTimer = useCallback(() => {
    pausedRef.current = true;
    cancelAnimationFrame(rafRef.current);
    remainingRef.current = Math.max(
      0,
      remainingRef.current - (performance.now() - startRef.current)
    );
  }, []);

  const resumeTimer = useCallback(() => {
    pausedRef.current = false;
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const dismiss = useCallback(() => {
    setExiting(true);
    cancelAnimationFrame(rafRef.current);
    setTimeout(() => onDismiss(item.id), 320);
  }, [item.id, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      onTouchStart={pauseTimer}
      onTouchEnd={resumeTimer}
      className={`
        relative w-full max-w-[420px] overflow-hidden rounded-2xl border shadow-lg
        ${style.bg} ${style.border}
        transform transition-all duration-300 ease-[cubic-bezier(.21,1.02,.73,1)]
        ${visible && !exiting ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"}
      `}
      style={{ willChange: "transform, opacity" }}
    >
      {/* Content */}
      <div className="flex items-start gap-3 p-4 pr-10">
        <div className={`mt-0.5 shrink-0 ${style.icon}`}>
          {ICON_MAP[item.type]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-900 leading-snug">
            {item.title}
          </p>
          {item.message && (
            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed line-clamp-3">
              {item.message}
            </p>
          )}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="absolute top-3 right-3 p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
      >
        <X size={14} />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-[3px] w-full bg-zinc-100">
          <div
            className={`h-full ${style.bar} transition-none`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { ...opts, id }]);
  }, []);

  const success = useCallback(
    (title: string, message?: string) =>
      toast({ type: "success", title, message }),
    [toast]
  );
  const error = useCallback(
    (title: string, message?: string) =>
      toast({ type: "error", title, message, duration: 6000 }),
    [toast]
  );
  const warning = useCallback(
    (title: string, message?: string) =>
      toast({ type: "warning", title, message }),
    [toast]
  );
  const info = useCallback(
    (title: string, message?: string) =>
      toast({ type: "info", title, message }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}

      {/* Toast container – bottom-center on mobile, top-right on desktop */}
      <div
        aria-label="Notifications"
        className="
          fixed z-[9999] flex flex-col gap-3 pointer-events-none
          bottom-4 left-4 right-4
          sm:top-6 sm:right-6 sm:bottom-auto sm:left-auto sm:w-[420px]
        "
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <SingleToast item={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
