"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "agentflow-day-theme";

export default function ThemeToggle() {
  const [isDay, setIsDay] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY) === "true";
    setIsDay(saved);
    document.body.classList.toggle("day-theme", saved);
  }, []);

  const toggleTheme = () => {
    setIsDay((current) => {
      const next = !current;
      document.body.classList.toggle("day-theme", next);
      window.localStorage.setItem(THEME_STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <button
      type="button"
      aria-pressed={isDay}
      aria-label={isDay ? "Switch to night theme" : "Switch to day theme"}
      onClick={toggleTheme}
      className="theme-toggle"
    >
      {isDay ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span>Day</span>
    </button>
  );
}
