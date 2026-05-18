"use client";

import React, { useState, useCallback, createContext, useContext } from "react";
import { AlertTriangle, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

interface ConfirmContextValue {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
}

// ─── Context ──────────────────────────────────────────────────────────
const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx;
}

// ─── Styles ───────────────────────────────────────────────────────────
const VARIANT_STYLES = {
  danger: {
    icon: "bg-red-100 text-red-600",
    button: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
  },
  warning: {
    icon: "bg-amber-100 text-amber-600",
    button: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400 text-white",
  },
  default: {
    icon: "bg-emerald-100 text-emerald-600",
    button: "bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-500 text-white",
  },
};

// ─── Provider ─────────────────────────────────────────────────────────
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    open: boolean;
    opts: ConfirmOptions;
    resolve: ((v: boolean) => void) | null;
  }>({
    open: false,
    opts: { title: "", message: "" },
    resolve: null,
  });

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ open: true, opts, resolve });
    });
  }, []);

  const handleClose = useCallback(
    (result: boolean) => {
      state.resolve?.(result);
      setState((prev) => ({ ...prev, open: false, resolve: null }));
    },
    [state.resolve]
  );

  const variant = state.opts.variant || "danger";
  const styles = VARIANT_STYLES[variant];

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Backdrop + Dialog */}
      {state.open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
            onClick={() => handleClose(false)}
          />

          {/* Dialog */}
          <div
            className="
              relative w-full max-w-[400px] bg-white rounded-2xl shadow-2xl border border-zinc-200
              animate-[dialogIn_280ms_cubic-bezier(.21,1.02,.73,1)]
            "
          >
            {/* Close button */}
            <button
              onClick={() => handleClose(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="p-6 pt-8 flex flex-col items-center text-center">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.icon}`}
              >
                <AlertTriangle size={22} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                {state.opts.title}
              </h3>

              {/* Message */}
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed max-w-[320px]">
                {state.opts.message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 pt-0 px-6 pb-6">
              <button
                onClick={() => handleClose(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300"
              >
                {state.opts.cancelLabel || "Cancel"}
              </button>
              <button
                onClick={() => handleClose(true)}
                autoFocus
                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors focus:outline-none focus:ring-2 ${styles.button}`}
              >
                {state.opts.confirmLabel || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
