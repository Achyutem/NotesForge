"use client";

import React, { useRef } from "react";

export function useImportHandler() {
	// The ref should be typed as HTMLInputElement
	const fileInputRef = useRef<HTMLInputElement>(null);

	// The event 'e' should also be typed with HTMLInputElement
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);
		try {
			const response = await fetch("/api/import", {
				method: "POST",
				body: formData,
			});
			const result = await response.json();
			if (response.ok) {
				alert(result.message || "Import successful!");
				window.location.reload();
			} else {
				alert(result.error || "Failed to import todos");
			}
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			alert("An error occurred during import.");
		}
	};

	const triggerImport = () => {
		fileInputRef.current?.click();
	};

	const renderFileInput = () => (
		<input
			ref={fileInputRef}
			type="file"
			accept=".csv"
			onChange={handleFileChange}
			className="hidden"
		/>
	);

	return { triggerImport, renderFileInput };
}
