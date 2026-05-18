"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Type } from "lucide-react";

// Title suggestions grouped by asset type
const TITLE_SUGGESTIONS: Record<string, string[]> = {
  Property: [
    "Modern Villa with Garden",
    "Modern Apartment in Bole",
    "Luxury Penthouse Suite",
    "Spacious Family Home",
    "Studio Apartment for Rent",
    "2 Bedroom Apartment",
    "3 Bedroom Apartment",
    "4 Bedroom House",
    "5 Bedroom Villa",
    "Furnished Apartment",
    "Unfurnished House",
    "Duplex with Parking",
    "Commercial Office Space",
    "Retail Shop for Rent",
    "Warehouse for Lease",
    "Newly Built Condominium",
    "G+1 House with Compound",
    "G+2 House for Sale",
    "G+3 Building for Sale",
    "Renovated Town House",
    "Service Apartment",
    "Cozy One Bedroom Flat",
    "Penthouse with City View",
    "House with Swimming Pool",
    "Gated Community Villa",
    "Budget Friendly Apartment",
  ],
  Vehicle: [
    "Toyota Corolla 2024",
    "Toyota Land Cruiser V8",
    "Toyota Hilux Double Cab",
    "Toyota Vitz",
    "Toyota Yaris",
    "Toyota RAV4",
    "Toyota Camry Hybrid",
    "Suzuki Vitara",
    "Suzuki Swift",
    "Suzuki Alto",
    "Hyundai Tucson",
    "Hyundai Santa Fe",
    "Hyundai Accent",
    "Kia Sportage",
    "Kia Sorento",
    "Honda CR-V",
    "Honda Fit",
    "Nissan Patrol",
    "Nissan X-Trail",
    "Ford Ranger",
    "Mitsubishi Outlander",
    "Mitsubishi L200",
    "Mercedes-Benz C-Class",
    "BMW X5",
    "Volkswagen Tiguan",
    "Isuzu D-Max",
    "Lifan X60",
  ],
  Land: [
    "Residential Plot in Bole",
    "Commercial Land for Sale",
    "Agricultural Land",
    "500 sqm Plot for Sale",
    "1000 sqm Residential Land",
    "2000 sqm Commercial Plot",
    "Land with Title Deed",
    "Corner Plot with Road Access",
    "Land Near Main Road",
    "Industrial Zone Land",
    "Plot in Gated Community",
    "Farmland for Lease",
    "Land for Real Estate Development",
    "Hilltop Land with View",
    "Flat Land for Construction",
    "Land with Building Permit",
    "Prime Location Plot",
    "Investment Land",
    "Land Near School",
    "Land Near Hospital",
  ],
};

interface TitleInputProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  assetType: string;
}

export default function TitleInput({
  name,
  required,
  defaultValue = "",
  placeholder = "e.g. Modern Cliffside Villa",
  className = "",
  assetType,
}: TitleInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filterSuggestions = useCallback(
    (input: string) => {
      if (!input.trim()) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      const lower = input.toLowerCase();
      const pool = TITLE_SUGGESTIONS[assetType] || TITLE_SUGGESTIONS["Property"];
      const matches = pool
        .filter((t) => t.toLowerCase().includes(lower))
        .slice(0, 6);
      setSuggestions(matches);
      setOpen(matches.length > 0);
      setActiveIndex(-1);
    },
    [assetType]
  );

  // Re-filter when assetType changes
  useEffect(() => {
    if (query.trim()) filterSuggestions(query);
  }, [assetType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    filterSuggestions(val);
  };

  const handleSelect = (title: string) => {
    setQuery(title);
    setOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[activeIndex]) {
        (items[activeIndex] as HTMLElement).scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [activeIndex]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Highlight matching text
  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-emerald-700 font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <input type="hidden" name={name} value={query} />

      <input
        type="text"
        required={required}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() =>
          query.trim() && suggestions.length > 0 && setOpen(true)
        }
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none bg-zinc-50/50 font-medium"
      />

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="
            absolute z-50 mt-1.5 w-full bg-white border border-zinc-200 rounded-xl shadow-xl
            max-h-[220px] overflow-y-auto
            animate-[dialogIn_180ms_ease-out]
          "
        >
          {suggestions.map((title, i) => (
            <li
              key={title}
              onMouseDown={() => handleSelect(title)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors
                ${i === activeIndex ? "bg-emerald-50 text-emerald-900" : "text-zinc-700 hover:bg-zinc-50"}
                ${i === 0 ? "rounded-t-xl" : ""}
                ${i === suggestions.length - 1 ? "rounded-b-xl" : "border-b border-zinc-100"}
              `}
            >
              <Type
                size={14}
                className={`shrink-0 ${i === activeIndex ? "text-emerald-600" : "text-zinc-400"}`}
              />
              <span className="font-medium">{highlight(title)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
