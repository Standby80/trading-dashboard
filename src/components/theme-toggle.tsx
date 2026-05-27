"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ isCollapsed }: { isCollapsed: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className={`w-full flex items-center rounded-lg h-12 text-slate-400 hover:bg-white/5 hover:text-white transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}>
        <div className="w-5 h-5 shrink-0" />
      </button>
    );
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`w-full flex items-center rounded-lg h-12 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}
    >
      {isDark ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
      {!isCollapsed && <span className="font-medium text-sm">{isDark ? "Light Mode" : "Dark Mode"}</span>}
    </button>
  );
}
