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
  accept?: string;
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast: uiToast } = useToast();
  const [uploadStatus, setUploadStatus] = useState('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast.error('Please upload a CSV file');
        return;
      }
      setFile(selectedFile);
      setUploadStatus('File selected');
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadStatus('Checking server connection...');
      
      // First, check if the server is running
      const testResponse = await fetch('http://localhost:5002/api/test');
      if (!testResponse.ok) {
        throw new Error('Server is not responding. Please make sure the backend server is running.');
      }
      
      setUploadStatus('Uploading file...');
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name);
      const response = await fetch('http://localhost:5002/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error:', errorData);
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await response.json();
      console.log('Upload response:', data);
      setUploadStatus('File uploaded successfully!');
      setUploadedFile(data.filename);

      // Simulate progress for analysis
      setAnalysisProgress(0);
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setAnalysisProgress(i);
      }

      // Fetch analysis results
      console.log('Requesting analysis...');
      const analysisResponse = await fetch('http://localhost:5002/api/analyze');
      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        console.error('Analysis error:', errorData);
        throw new Error(errorData.error || 'Failed to analyze file');
      }

      const analysisData = await analysisResponse.json();
      console.log('Analysis data received:', analysisData);
      
      if (!analysisData || !analysisData.transactions || analysisData.transactions.length === 0) {
        throw new Error('No valid data found in the file. Please try again with a different CSV file.');
      }

      setAnalysisResults(analysisData);
      setAnalysisProgress(100);
      setUploadStatus('Analysis complete!');

      // Pass the analysis data to the parent component
      console.log('Calling onFileUploaded with:', analysisData);
      onFileUploaded(analysisData);
      setIsUploading(false);

    } catch (error) {
      console.error('Error:', error);
      setUploadStatus(`Error: ${error.message}`);
      setAnalysisProgress(0);
      setIsUploading(false);
      toast.error(error.message || "Error processing the file. Please try again.");
    }
  };

  return (
    <Card className="p-6 bg-white shadow-md border-catty-cream border-2">
      <h2 className="text-xl font-semibold text-catty-brown mb-4">Upload Your Bank Statement</h2>
      <p className="text-catty-gray mb-6">
        Upload a CSV file of your bank statement for Whiskers to analyze your finances.
        <br />
        <span className="text-sm text-catty-orange">
          Any CSV file with financial data will work - we'll analyze it automatically!
        </span>
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
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Browse Files
            </Button>
          </label>
        </div>

        {isUploading ? (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-catty-gray">{uploadStatus}</p>
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
