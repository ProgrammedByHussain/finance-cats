import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { playMeowSound } from "@/utils/sound";
import { analyzeCSVData } from "@/services/geminiService";
import Papa from "papaparse";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  onFileUploaded: (results: any) => void;
  accept?: string;
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progressStage, setProgressStage] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast: uiToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
      setProgressStage("File selected");
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setProgressStage("Reading file...");
      setAnalysisProgress(10);

      // Read the file content
      const fileContent = await readFileAsText(file);
      setProgressStage("Parsing CSV...");
      setAnalysisProgress(30);

      // Parse the CSV data
      const parsedData = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });

      // Check if the CSV has valid data
      if (!parsedData.data || parsedData.data.length === 0) {
        throw new Error("The CSV file appears to be empty or invalid");
      }

      setProgressStage("Analyzing transaction data with AI...");
      setAnalysisProgress(50);

      // Send to Gemini for analysis
      const analysisResults = await analyzeCSVData(fileContent);

      setProgressStage("Analysis complete!");
      setAnalysisProgress(100);

      // Pass the analysis data to the parent component
      console.log("Analysis results:", analysisResults);
      onFileUploaded(analysisResults);

      // Play a sound to indicate completion
      playMeowSound();

      setIsUploading(false);
      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Error:", error);
      setProgressStage(`Error: ${error.message}`);
      setAnalysisProgress(0);
      setIsUploading(false);
      toast.error(
        error.message || "Error processing the file. Please try again."
      );
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read the file"));
        }
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsText(file);
    });
  };

  return (
    <Card className="p-6 bg-white shadow-md border-catty-cream border-2">
      <h2 className="text-xl font-semibold text-catty-brown mb-4">
        Upload Your Bank Statement
      </h2>
      <p className="text-catty-gray mb-6">
        Upload a CSV file of your bank statement for Sir Pounce to analyze your
        finances.
        <br />
        <span className="text-sm text-catty-orange">
          Any bank statement CSV file will work - our AI will analyze it
          automatically!
        </span>
      </p>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-catty-cream rounded-lg p-6 text-center bg-catty-light-gray">
          {file ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-catty-gray">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-catty-gray">Supports CSV</p>
            </div>
          )}
          <label htmlFor="file-upload" className="cursor-pointer">
            <Input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              accept=".csv,text/csv"
              className="sr-only"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-4 bg-catty-peach hover:bg-catty-orange text-catty-brown border-none"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Browse Files
            </Button>
          </label>
        </div>

        {isUploading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-catty-gray mb-1">
              <span>{progressStage}</span>
              <span>{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 text-catty-orange animate-spin" />
            </div>
          </div>
        ) : (
          <Button
            onClick={() => file && handleUpload(file)}
            className="w-full bg-catty-orange hover:bg-catty-brown text-white"
            disabled={!file || isUploading}
          >
            Upload Statement
          </Button>
        )}
      </div>
    </Card>
  );
}
