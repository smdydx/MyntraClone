import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex flex-col items-center text-gray-700 hover:text-pink-600 cursor-pointer transition-colors p-2 dark:text-gray-300 dark:hover:text-pink-400"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="text-xs mt-1 font-medium hidden md:block">
        {theme === "light" ? "Dark" : "Light"}
      </span>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}