import React, { useRef } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Upload } from "lucide-react";

const ImportTodos = () => {
	const fileInputRef = useRef<HTMLInputElement>(null);

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
				alert(result.message || "Import successful! The page will now reload.");
				window.location.reload();
			} else {
				alert(result.error || "Failed to import todos");
			}
		} catch (error) {
			console.error("Error importing todos:", error);
			alert("An error occurred during import.");
		}
	};

	return (
		<>
			{/* --- THIS IS THE FIX --- */}
			<DropdownMenuItem
				onSelect={(e) => {
					e.preventDefault(); // Prevents the dropdown from closing
					fileInputRef.current?.click(); // Programmatically clicks the hidden file input
				}}
				className="rounded-md p-2 gap-2 font-medium cursor-pointer"
			>
				<Upload className="w-4 h-4 text-muted-foreground" />
				Import from CSV...
			</DropdownMenuItem>

			<input
				ref={fileInputRef}
				type="file"
				accept=".csv"
				onChange={handleFileChange}
				className="hidden"
			/>
		</>
	);
};

export default ImportTodos;
