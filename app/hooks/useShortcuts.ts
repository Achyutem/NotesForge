/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { shortcuts } from "../utils/shortcuts";
import { Shortcut } from "../utils/types";

export const useShortcuts = (context: any) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();

			shortcuts.forEach((shortcut: Shortcut) => {
				const matchesKey = shortcut.key === key;
				const matchesCtrl = shortcut.ctrlKey ? e.ctrlKey || e.metaKey : true;
				const matchesShift = shortcut.shiftKey ? e.shiftKey : true;

				if (matchesKey && matchesCtrl && matchesShift) {
					e.preventDefault();
					shortcut.action(context);
				}
			});
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [context]);
};
