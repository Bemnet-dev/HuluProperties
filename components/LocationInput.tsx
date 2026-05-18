"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { MapPin } from "lucide-react";

// Ethiopian cities & neighborhoods — sorted alphabetically
const ETHIOPIAN_LOCATIONS = [
  "Addis Ababa, Bole",
  "Addis Ababa, Kazanchis",
  "Addis Ababa, Piassa",
  "Addis Ababa, Sarbet",
  "Addis Ababa, CMC",
  "Addis Ababa, Summit",
  "Addis Ababa, Gerji",
  "Addis Ababa, Megenagna",
  "Addis Ababa, Meskel Square",
  "Addis Ababa, Arat Kilo",
  "Addis Ababa, Sidist Kilo",
  "Addis Ababa, Merkato",
  "Addis Ababa, Lebu",
  "Addis Ababa, Ayat",
  "Addis Ababa, Jemo",
  "Addis Ababa, Kotebe",
  "Addis Ababa, Yeka",
  "Addis Ababa, Lideta",
  "Addis Ababa, Arada",
  "Addis Ababa, Nifas Silk-Lafto",
  "Addis Ababa, Kolfe Keranio",
  "Addis Ababa, Akaki Kality",
  "Addis Ababa, Gulele",
  "Addis Ababa, Kirkos",
  "Addis Ababa, Addis Ketema",
  "Addis Ababa, Lemi Kura",
  "Addis Ababa, Mexico",
  "Addis Ababa, Gotera",
  "Addis Ababa, Hayahulet",
  "Addis Ababa, Saris",
  "Addis Ababa, Mekanisa",
  "Addis Ababa, Old Airport",
  "Addis Ababa, Olympia",
  "Addis Ababa, Bisrate Gabriel",
  "Addis Ababa, Lafto",
  "Addis Ababa, 22 Mazoria",
  "Addis Ababa, 4 Kilo",
  "Addis Ababa, 5 Kilo",
  "Addis Ababa, 6 Kilo",
  "Adama, Oromia",
  "Bahir Dar, Amhara",
  "Dire Dawa",
  "Gondar, Amhara",
  "Hawassa, Sidama",
  "Jimma, Oromia",
  "Mekelle, Tigray",
  "Dessie, Amhara",
  "Bishoftu (Debre Zeit), Oromia",
  "Shashamane, Oromia",
  "Arba Minch, SNNPR",
  "Harar, Harari",
  "Dilla, SNNPR",
  "Nekemte, Oromia",
  "Debre Berhan, Amhara",
  "Debre Markos, Amhara",
  "Kombolcha, Amhara",
  "Assosa, Benishangul-Gumuz",
  "Gambella, Gambella",
  "Semera, Afar",
  "Jijiga, Somali",
  "Wolkite, SNNPR",
  "Hosaena, SNNPR",
  "Sodo, SNNPR",
  "Axum, Tigray",
  "Lalibela, Amhara",
  "Woldia, Amhara",
  "Bale Robe, Oromia",
  "Asella, Oromia",
  "Ambo, Oromia",
  "Ziway, Oromia",
  "Sebeta, Oromia",
  "Dukem, Oromia",
  "Burayu, Oromia",
  "Sululta, Oromia",
  "Sendafa, Oromia",
  "Holeta, Oromia",
  "Legatafo, Oromia",
  "Legetafo Legedadi, Oromia",
];

interface LocationInputProps {
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export default function LocationInput({
  name,
  required,
  defaultValue = "",
  placeholder = "Search for a location...",
  className = "",
}: LocationInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter suggestions
  const filterSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const lower = input.toLowerCase();
    const matches = ETHIOPIAN_LOCATIONS.filter((loc) =>
      loc.toLowerCase().includes(lower)
    ).slice(0, 8);
    setSuggestions(matches);
    setOpen(matches.length > 0);
    setActiveIndex(-1);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    filterSuggestions(val);
  };

  const handleSelect = (location: string) => {
    setQuery(location);
    setOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
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
        (items[activeIndex] as HTMLElement).scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Highlight matching text
  const highlight = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
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
      {/* Hidden native input for form submission */}
      <input type="hidden" name={name} value={query} />

      <div className="relative">
        <MapPin
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          size={18}
        />
        <input
          type="text"
          required={required}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none bg-zinc-50/50 font-medium"
        />
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="
            absolute z-50 mt-1.5 w-full bg-white border border-zinc-200 rounded-xl shadow-xl
            max-h-[240px] overflow-y-auto
            animate-[dialogIn_180ms_ease-out]
          "
        >
          {suggestions.map((loc, i) => (
            <li
              key={loc}
              onMouseDown={() => handleSelect(loc)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`
                flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors
                ${i === activeIndex ? "bg-emerald-50 text-emerald-900" : "text-zinc-700 hover:bg-zinc-50"}
                ${i === 0 ? "rounded-t-xl" : ""}
                ${i === suggestions.length - 1 ? "rounded-b-xl" : "border-b border-zinc-100"}
              `}
            >
              <MapPin
                size={14}
                className={`shrink-0 ${i === activeIndex ? "text-emerald-600" : "text-zinc-400"}`}
              />
              <span className="font-medium">{highlight(loc)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
