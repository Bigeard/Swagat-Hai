import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") ?? "coffee");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        checked={theme === "coffee"}
        onChange={(e) => setTheme(e.target.checked ? "coffee" : "emerald")}
      />
      <SunIcon className="swap-off h-10 w-10" />
      <MoonIcon className="swap-on h-10 w-10" />
    </label>
  );
}
