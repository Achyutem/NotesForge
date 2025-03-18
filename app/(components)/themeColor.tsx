"use client";

import * as React from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "../context/themeProvider";
import { cn } from "@/lib/utils";

const availableThemeColors = [
  {
    name: "Zinc",
    light: "bg-zinc-900 hover:bg-zinc-800",
    dark: "bg-zinc-700 hover:bg-zinc-600",
  },
  {
    name: "Rose",
    light: "bg-rose-600 hover:bg-rose-500",
    dark: "bg-rose-700 hover:bg-rose-600",
  },
  {
    name: "Blue",
    light: "bg-blue-600 hover:bg-blue-500",
    dark: "bg-blue-700 hover:bg-blue-600",
  },
  {
    name: "Green",
    light: "bg-green-600 hover:bg-green-500",
    dark: "bg-green-500 hover:bg-green-400",
  },
  {
    name: "Orange",
    light: "bg-orange-500 hover:bg-orange-400",
    dark: "bg-orange-700 hover:bg-orange-600",
  },
  {
    name: "Purple",
    light: "bg-purple-600 hover:bg-purple-500",
    dark: "bg-purple-700 hover:bg-purple-600",
  },
];

export function Theme() {
  const { theme, setTheme } = useTheme();
  const { themeColor, setThemeColor } = useThemeContext();

  const selectedColor = availableThemeColors.find((c) => c.name === themeColor);
  const bgColor =
    theme === "light" ? selectedColor?.light : selectedColor?.dark;

  return (
    <div className="relative flex items-center space-x-2">
      {/* Theme Mode Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle theme mode"
        title="Toggle theme mode"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        <Sun className="text-primary h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="text-primary absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      {/* Color Selection Dropdown */}
      <Select
        onValueChange={(value) => setThemeColor(value as ThemeColors)}
        defaultValue={themeColor}>
        <SelectTrigger
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center border-none focus:ring-0 shadow-sm",
            "hover:shadow-md hover:scale-110 hover:ring-2 hover:ring-offset-2",
            bgColor
          )}>
          <ChevronDown className="text-white w-2.5 h-2.5 transition-transform duration-200" />
        </SelectTrigger>
        <SelectContent className="border-muted p-2">
          <div className="flex space-x-2 px-2">
            {availableThemeColors.map(({ name, light, dark }) => (
              <SelectItem
                key={name}
                value={name}
                className="p-0 m-0 border-none">
                <div
                  className={cn(
                    "rounded-full w-8 h-8 cursor-pointer transition-all hover:ring-2 hover:ring-offset-2",
                    theme === "light" ? light : dark
                  )}></div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
