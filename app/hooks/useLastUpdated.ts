import { useEffect, useState } from "react";

export function useLastUpdated(createdAt?: string, updatedAt?: string) {
  const [lastUpdated, setLastUpdated] = useState("Just Now");

  useEffect(() => {
    const updateLastUpdated = () => {
      const dateRef = updatedAt?.trim() || createdAt?.trim() || "";
      if (!dateRef) {
        setLastUpdated("Just Now");
        return;
      }

      const updatedTime = new Date(
        dateRef.endsWith("Z") ? dateRef : dateRef + "Z"
      );
      if (isNaN(updatedTime.getTime())) {
        setLastUpdated("Just Now");
        return;
      }

      const now = new Date();
      const diffInMs = now.getTime() - updatedTime.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays >= 7) {
        setLastUpdated(
          updatedTime.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } else if (diffInDays >= 1) {
        setLastUpdated(`${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`);
      } else if (diffInHours >= 1) {
        setLastUpdated(
          `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
        );
      } else if (diffInMinutes >= 1) {
        setLastUpdated(
          `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
        );
      } else {
        setLastUpdated("Just now");
      }
    };

    updateLastUpdated();
    const interval = setInterval(updateLastUpdated, 60000);
    return () => clearInterval(interval);
  }, [createdAt, updatedAt]);

  return lastUpdated;
}
