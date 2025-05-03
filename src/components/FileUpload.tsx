import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { playMeowSound } from '@/utils/sound';

interface FileUploadProps {
  onFileUploaded: (results: any) => void;
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast: uiToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    playMeowSound();

    // Check if the file is a PDF or CSV
    const fileType = file.type;
    const validTypes = ['application/pdf', 'text/csv'];
    
    if (!validTypes.includes(fileType)) {
      toast.error("Please upload a PDF or CSV file only");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 25;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            simulateProcessing();
          }, 500);
        }
        return Math.min(newProgress, 100);
      });
    }, 500);
  };

  const simulateProcessing = () => {
    toast.success("File uploaded successfully!");
    
    // Simulate processing and returning mock data
    const mockData = generateMockFinancialData();
    
    setTimeout(() => {
      onFileUploaded(mockData);
      uiToast({
        title: "Bank Statement Analyzed!",
        description: "Whiskers has reviewed your financial data."
      });
    }, 1500);
  };

  return (
    <Card className="p-6 bg-white shadow-md border-catty-cream border-2">
      <h2 className="text-xl font-semibold text-catty-brown mb-4">Upload Your Bank Statement</h2>
      <p className="text-catty-gray mb-6">
        Upload a PDF or CSV file of your bank statement for Whiskers to analyze your finances.
      </p>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-catty-cream rounded-lg p-6 text-center bg-catty-light-gray">
          {file ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-catty-gray">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm">Drag and drop your file here, or click to browse</p>
              <p className="text-xs text-catty-gray">Supports PDF, CSV</p>
            </div>
          )}
          <Input 
            type="file" 
            onChange={handleFileChange} 
            className="hidden"
            id="file-upload"
            accept=".pdf,.csv"
          />
          <label htmlFor="file-upload">
            <Button 
              type="button" 
              variant="outline" 
              className="mt-4 bg-catty-peach hover:bg-catty-orange text-catty-brown border-none"
            >
              Browse Files
            </Button>
          </label>
        </div>

        {isUploading ? (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-catty-gray">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <Button 
            onClick={handleUpload} 
            className="w-full bg-catty-orange hover:bg-catty-brown text-white"
            disabled={!file}
          >
            Upload Statement
          </Button>
        )}
      </div>
    </Card>
  );
}

// Helper function to generate mock financial data
function generateMockFinancialData() {
  return {
    income: Math.round(Math.random() * 4000 + 2000),
    expenses: {
      food: Math.round(Math.random() * 500 + 200),
      rent: Math.round(Math.random() * 1000 + 800),
      shopping: Math.round(Math.random() * 300 + 100),
      utilities: Math.round(Math.random() * 200 + 100),
      entertainment: Math.round(Math.random() * 200 + 50),
    },
    categories: [
      { name: "Food", value: Math.round(Math.random() * 500 + 200) },
      { name: "Rent", value: Math.round(Math.random() * 1000 + 800) },
      { name: "Shopping", value: Math.round(Math.random() * 300 + 100) },
      { name: "Utilities", value: Math.round(Math.random() * 200 + 100) },
      { name: "Entertainment", value: Math.round(Math.random() * 200 + 50) },
    ],
    transactions: [
      { date: "2023-05-01", description: "Grocery Store", amount: -85.45, category: "Food" },
      { date: "2023-05-02", description: "Monthly Rent", amount: -950, category: "Rent" },
      { date: "2023-05-03", description: "Coffee Shop", amount: -4.50, category: "Food" },
      { date: "2023-05-04", description: "Paycheck", amount: 1250, category: "Income" },
      { date: "2023-05-05", description: "Online Shopping", amount: -65.99, category: "Shopping" },
      { date: "2023-05-07", description: "Gas Station", amount: -45.23, category: "Transportation" },
      { date: "2023-05-10", description: "Electricity Bill", amount: -120.50, category: "Utilities" },
      { date: "2023-05-12", description: "Restaurant Dinner", amount: -78.25, category: "Food" },
      { date: "2023-05-15", description: "Mobile Phone Bill", amount: -85, category: "Utilities" },
      { date: "2023-05-18", description: "Paycheck", amount: 1250, category: "Income" },
    ],
    savingsRate: Math.round(Math.random() * 20 + 5),
    spendingInsights: {
      highestCategory: "Rent",
      unusualSpending: Math.random() > 0.5,
      savingsTips: [
        "Consider making your coffee at home meow-re often",
        "Purr-haps review your subscription services",
        "Whisk away 10% of your paycheck into savings"
      ]
    }
  };
}
