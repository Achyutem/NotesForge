import { useEffect, useState } from "react";

export function useLastUpdated(updatedAt?: string, createdAt?: string) {
	const [lastUpdated, setLastUpdated] = useState("Just now");

	useEffect(() => {
		const updateLastUpdated = () => {
			const dateRef = updatedAt || createdAt;
			if (!dateRef) return;

			// --- THIS IS THE FIX ---
			// Force the browser to parse the date string as UTC
			const updatedTime = new Date(
				dateRef.endsWith("Z") ? dateRef : dateRef + "Z"
			);

			const now = new Date();
			const diffInMs = now.getTime() - updatedTime.getTime();
			const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
			const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
			const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

			let newLastUpdated = "Just now";

			if (diffInDays >= 7) {
				newLastUpdated = updatedTime.toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
				});
			} else if (diffInDays >= 1) {
				newLastUpdated = `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
			} else if (diffInHours >= 1) {
				newLastUpdated = `${diffInHours} hour${
					diffInHours !== 1 ? "s" : ""
				} ago`;
			} else if (diffInMinutes >= 1) {
				newLastUpdated = `${diffInMinutes} minute${
					diffInMinutes !== 1 ? "s" : ""
				} ago`;
			}

			setLastUpdated((prev) =>
				prev !== newLastUpdated ? newLastUpdated : prev
			);
		};

		updateLastUpdated();
		const interval = setInterval(updateLastUpdated, 60000);
		return () => clearInterval(interval);
	}, [updatedAt, createdAt]);

	return lastUpdated;
}
