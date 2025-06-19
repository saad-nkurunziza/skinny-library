"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CircleDashed, CircleDotDashed } from "lucide-react";

export default function ThemeToggler() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      size={"icon"}
      variant={"secondary"}
      aria-label="Toggle Theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <CircleDashed size={"3"} /> : <CircleDotDashed size={"3"} />}
    </Button>
  );
}
