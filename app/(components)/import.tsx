import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";

const ImportTodos = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

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
        setMessage(result.message);
        setError(false);
      } else {
        setMessage(result.error || "Failed to import todos");
        setError(true);
      }
      setShowAlert(true);
    } catch (error) {
      console.error("Error importing todos:", error);
      setMessage("An error occurred.");
      setError(true);
      setShowAlert(true);
    }
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="max-w-md mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        onClick={handleButtonClick}
        variant="default"
        className="w-full border light:border-gray-200 dark:border-gray-800 bg-background text-primary hover:bg-gray-100 dark:hover:bg-zinc-800">
        <Upload className="mr-2 h-4 w-4" /> Import CSV
      </Button>

      {showAlert && message && (
        <Alert
          variant={error ? "destructive" : "default"}
          className="mt-4">
          {error ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          <AlertTitle>{error ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ImportTodos;
