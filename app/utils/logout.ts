"use client";

export const logout = async () => {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");

            window.location.href = "/";
        } else {
            console.error("Failed to logout");
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};
