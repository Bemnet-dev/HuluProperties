"use client";

import React, { useState, useRef } from "react";

interface PriceInputProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

/**
 * Formats a raw number string with commas (e.g. 2500000 → 2,500,000).
 * Strips non-digit characters before formatting.
 */
function formatWithCommas(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-US");
}

/**
 * Returns the raw numeric string (no commas).
 */
function stripCommas(value: string): string {
  return value.replace(/,/g, "");
}

export default function PriceInput({
  name,
  required,
  defaultValue = "",
  placeholder = "2,500,000",
  className = "",
}: PriceInputProps) {
  const [display, setDisplay] = useState(() => formatWithCommas(defaultValue));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Only allow digits and commas during typing
    const cleaned = raw.replace(/[^\d]/g, "");
    const formatted = formatWithCommas(cleaned);

    // Preserve cursor position relative to digits
    const el = e.target;
    const prevPos = el.selectionStart ?? 0;
    const prevCommas = (raw.slice(0, prevPos).match(/,/g) || []).length;
    const prevDigitPos = prevPos - prevCommas;

    setDisplay(formatted);

    // Restore cursor after React re-render
    requestAnimationFrame(() => {
      if (inputRef.current) {
        let digitsSeen = 0;
        let newPos = 0;
        for (let i = 0; i < formatted.length; i++) {
          if (formatted[i] !== ",") {
            digitsSeen++;
          }
          if (digitsSeen > prevDigitPos) break;
          newPos = i + 1;
        }
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden input sends the raw numeric value to the form */}
      <input type="hidden" name={name} value={stripCommas(display)} />

      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold pointer-events-none">
        ETB
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        required={required}
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full pl-14 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none bg-zinc-50/50 font-medium"
      />
    </div>
  );
}
