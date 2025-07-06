"use client";
import setGlobalColorTheme from "../utils/themeColors";
import { useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeColors } from "../utils/types";

interface ThemeColorStateParams {
	themeColor: ThemeColors;
	setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}

const ThemeContext = createContext<ThemeColorStateParams>(
	{} as ThemeColorStateParams
);

export default function ThemeDataProvider({ children }: ThemeProviderProps) {
	const getSavedThemeColor = () => {
		try {
			return (localStorage.getItem("themeColor") as ThemeColors) || "Zinc";
		} catch {
			return "Zinc"; // Return "Zinc" if there is an error
		}
	};

	const [themeColor, setThemeColor] = useState<ThemeColors>(
		getSavedThemeColor() as ThemeColors
	);
	const [isMounted, setIsMounted] = useState(false);
	const { theme } = useTheme();

	useEffect(() => {
		localStorage.setItem("themeColor", themeColor);
		setGlobalColorTheme(theme as "light" | "dark", themeColor);

		if (!isMounted) {
			setIsMounted(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [themeColor, theme]);

	if (!isMounted) {
		return null;
	}

	return (
		<ThemeContext.Provider value={{ themeColor, setThemeColor }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useThemeContext() {
	return useContext(ThemeContext);
}
