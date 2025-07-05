import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { FileDown } from "lucide-react";

const ExportTodos = () => {
	const handleExport = async () => {
		try {
			const response = await fetch("/api/export");
			if (response.ok) {
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = "notesforge_export.csv";
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

	return (
		<DropdownMenuItem onSelect={handleExport} className="gap-2 font-medium">
			<FileDown className="w-4 h-4 text-muted-foreground" />
			Export All to CSV
		</DropdownMenuItem>
	);
};

export default ExportTodos;
