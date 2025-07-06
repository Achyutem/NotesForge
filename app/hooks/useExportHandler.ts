"use client";

export function useExportHandler() {
	const triggerExport = async () => {
		try {
			const response = await fetch("/api/export");
			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `notesforge_export_${
					new Date().toISOString().split("T")[0]
				}.csv`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
			} else {
				alert("Failed to export notes.");
			}
		} catch (error) {
			console.error("Error exporting notes:", error);
			alert("An error occurred during export.");
		}
	};

	return { triggerExport };
}
