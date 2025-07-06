"use client";

import * as React from "react";
import { Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "../context/themeProvider";
import { cn } from "@/lib/utils";
import { ThemeColors } from "../utils/types";

const availableThemeColors = [
	{
		name: "Zinc",
		light: "bg-zinc-900 hover:bg-zinc-800",
		dark: "bg-zinc-200 hover:bg-zinc-100",
	},
	{
		name: "Rose",
		light: "bg-rose-600 hover:bg-rose-500",
		dark: "bg-rose-500 hover:bg-rose-600",
	},
	{
		name: "Blue",
		light: "bg-blue-600 hover:bg-blue-500",
		dark: "bg-blue-500 hover:bg-blue-600",
	},
	{
		name: "Green",
		light: "bg-green-500 hover:bg-green-500",
		dark: "bg-green-400 hover:bg-green-500",
	},
	{
		name: "Orange",
		light: "bg-orange-500 hover:bg-orange-400",
		dark: "bg-orange-500 hover:bg-orange-600",
	},
	{
		name: "Purple",
		light: "bg-purple-600 hover:bg-purple-500",
		dark: "bg-purple-500 hover:bg-purple-600",
	},
];

type ThemeProps = {
	variant?:
		| "default"
		| "secondary"
		| "destructive"
		| "outline"
		| "ghost"
		| "link";
};

export function Theme({ variant = "ghost" }: ThemeProps) {
	const { theme, setTheme } = useTheme();
	const { themeColor, setThemeColor } = useThemeContext();

	const selectedColor = availableThemeColors.find((c) => c.name === themeColor);
	const bgColor =
		theme === "light" ? selectedColor?.light : selectedColor?.dark;

	return (
		<div className="relative flex items-center space-x-1">
			<Button
				variant={variant}
				size="icon"
				aria-label="Toggle theme mode"
				title="Toggle theme mode"
				onClick={() => setTheme(theme === "light" ? "dark" : "light")}
				className="relative mr-1 overflow-hidden flex items-center justify-center"
			>
				<motion.div
					key={theme}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="absolute"
				>
					{theme === "dark" ? (
						<Moon className="text-primary h-[1.2rem] w-[1.2rem]" />
					) : (
						<Sun className="text-primary h-[1.2rem] w-[1.2rem]" />
					)}
				</motion.div>
			</Button>

			<Select
				onValueChange={(value) => setThemeColor(value as ThemeColors)}
				defaultValue={themeColor}
			>
				<SelectTrigger
					className={cn(
						"w-6 h-6 rounded-full flex items-center justify-center border-none focus:ring-0 shadow-sm",
						"hover:shadow-md hover:scale-110 hover:ring-2 hover:ring-offset-2",
						bgColor
					)}
				>
					<ChevronDown className="text-white w-2.5 h-2.5 transition-transform duration-200" />
				</SelectTrigger>
				<SelectContent>
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="shadow-none border-none p-2 bg-background rounded-lg"
					>
						<div className="flex space-x-2 px-2">
							{availableThemeColors.map(({ name, light, dark }) => (
								<SelectItem
									key={name}
									value={name}
									className="p-0 m-0 border-none"
								>
									<motion.div
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										className={cn(
											"rounded-full w-8 h-8 cursor-pointer transition-all hover:ring-2 hover:ring-offset-2",
											theme === "light" ? light : dark
										)}
									/>
								</SelectItem>
							))}
						</div>
					</motion.div>
				</SelectContent>
			</Select>
		</div>
	);
}
