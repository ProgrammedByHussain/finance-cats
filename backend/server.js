const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5003;

// Enable CORS
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
console.log('Uploads directory path:', uploadsDir);

// Ensure the uploads directory exists
try {
  if (!fs.existsSync(uploadsDir)) {
    console.log('Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory:', uploadsDir);
  } else {
    console.log('Uploads directory already exists:', uploadsDir);
  }
  
  // List existing files
  const existingFiles = fs.readdirSync(uploadsDir);
  console.log('Existing files in uploads directory:', existingFiles);
} catch (error) {
  console.error('Error setting up uploads directory:', error);
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Setting destination to:', uploadsDir);
    // Double-check directory exists before saving
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    console.log('Saving file:', file.originalname);
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('Checking file type:', file.mimetype);
    if (file.mimetype !== 'text/csv') {
      console.error('Invalid file type:', file.mimetype);
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 16 * 1024 * 1024 // 16MB limit
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is running!' });
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  console.log('Upload endpoint hit');
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  
  if (!req.file) {
    console.log('No file received');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(uploadsDir, req.file.filename);
  console.log('File saved to:', filePath);
  
  // Verify the file exists
  if (!fs.existsSync(filePath)) {
    console.error('File not found after upload:', filePath);
    return res.status(500).json({ error: 'File was not saved correctly' });
  }

  // Read and log the file content
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('Uploaded file content:', fileContent);
    console.log('File size:', fileContent.length, 'bytes');
  } catch (error) {
    console.error('Error reading uploaded file:', error);
    return res.status(500).json({ error: 'Error reading uploaded file' });
  }

  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// Analysis endpoint
app.get('/api/analyze', (req, res) => {
  console.log('Analysis endpoint hit');
  
  // Get the most recent file in the uploads directory
  const files = fs.readdirSync(uploadsDir);
  console.log('Files in directory:', files);
  
  if (files.length === 0) {
    console.log('No files found for analysis');
    return res.status(404).json({ error: 'No file found for analysis' });
  }
  
  const latestFile = files[files.length - 1];
  const filePath = path.join(uploadsDir, latestFile);
  console.log('Analyzing file:', latestFile);

  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return res.status(404).json({ error: 'No file found for analysis' });
  }

  try {
    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('File content:', fileContent);
    console.log('File size:', fileContent.length, 'bytes');

    // Parse CSV content
    const lines = fileContent.split('\n');
    console.log('Number of lines:', lines.length);
    
    if (lines.length < 2) {
      console.error('File is empty or has no data rows');
      return res.status(400).json({ error: 'File is empty or has no data rows' });
    }

    // Process data rows
    const results = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      const values = line.split(',').map(v => v.trim());
      console.log('Processing line:', values);

      // Extract data from the specific format
      const date = values[0];
      const description = values[1];
      const expenseAmount = parseFloat(values[2] || '0'); // 3rd column is expense
      const incomeAmount = parseFloat(values[3] || '0'); // 4th column is income

      if (!isNaN(expenseAmount) || !isNaN(incomeAmount)) {
        // Categorize the transaction
        let category = 'Uncategorized';
        if (description.includes('TIM HORTONS') || description.includes('DAILY GRIND')) {
          category = 'Coffee';
        } else if (description.includes('LA FITNESS')) {
          category = 'Fitness';
        } else if (description.includes('SHOPPERS DRUG MART')) {
          category = 'Pharmacy';
        } else if (description.includes('PETRO-CANADA')) {
          category = 'Gas';
        } else if (description.includes('MOSQU') || description.includes('ISNA') || description.includes('MUSLIM')) {
          category = 'Charity';
        } else if (description.includes('UNIQLO') || description.includes('HABIBZ')) {
          category = 'Shopping';
        } else if (description.includes('A&W')) {
          category = 'Food';
        }

        results.push({
          Date: date,
          Description: description,
          Expense: expenseAmount,
          Income: incomeAmount,
          Category: category
        });
      }
    }

    console.log('Number of valid records:', results.length);
    
    if (results.length === 0) {
      console.error('No valid records found in the file');
      return res.status(400).json({ error: 'No valid records found in the file' });
    }

    // Initialize financial data structure
    const financialData = {
      income: 0,
      expenses: {},
      categories: [],
      transactions: [],
      savingsRate: 0,
      spendingInsights: {
        highestCategory: '',
        unusualSpending: false,
        savingsTips: []
      }
    };

    // Process each transaction
    results.forEach(transaction => {
      const expense = transaction.Expense;
      const income = transaction.Income;
      const category = transaction.Category;
      const date = transaction.Date;
      const description = transaction.Description;

      console.log('Processing transaction:', { expense, income, category, date, description });

      // Add to transactions list
      financialData.transactions.push({
        date,
        description,
        amount: expense > 0 ? -expense : income,
        category
      });

      // Add to income if there's an income amount
      if (income > 0) {
        console.log('Adding to income:', income);
        financialData.income += income;
      }

      // Add to expenses if there's an expense amount
      if (expense > 0) {
        if (!financialData.expenses[category]) {
          financialData.expenses[category] = 0;
        }
        console.log('Adding to expenses:', { category, expense });
        financialData.expenses[category] += expense;
      }
    });

    // Calculate categories for pie chart
    financialData.categories = Object.entries(financialData.expenses).map(([name, value]) => ({
      name,
      value
    }));

    // Calculate total expenses
    const totalExpenses = Object.values(financialData.expenses).reduce((sum, value) => sum + value, 0);
    
    // Calculate savings (income - expenses)
    const savings = financialData.income - totalExpenses;
    
    // Calculate savings rate
    financialData.savingsRate = financialData.income > 0 ? (savings / financialData.income) * 100 : 0;

    // Generate spending insights
    const highestSpending = Object.entries(financialData.expenses)
      .sort(([, a], [, b]) => b - a)[0];
    
    financialData.spendingInsights.highestCategory = highestSpending ? highestSpending[0] : 'No expenses';
    
    // Check for unusual spending (more than 50% of income in a single category)
    const unusualSpendingThreshold = financialData.income * 0.5;
    financialData.spendingInsights.unusualSpending = highestSpending ? highestSpending[1] > unusualSpendingThreshold : false;

    // Generate savings tips based on analysis
    financialData.spendingInsights.savingsTips = [
      `Consider reducing spending in ${financialData.spendingInsights.highestCategory}`,
      `Your savings rate is ${financialData.savingsRate.toFixed(1)}%`,
      `Total savings: $${savings.toFixed(2)}`,
      financialData.spendingInsights.unusualSpending 
        ? `Warning: High spending in ${financialData.spendingInsights.highestCategory}`
        : 'Your spending patterns look healthy'
    ];

    console.log('Final financial data:', {
      income: financialData.income,
      totalExpenses,
      savings,
      savingsRate: financialData.savingsRate,
      categories: financialData.categories,
      transactions: financialData.transactions
    });

    res.json(financialData);
  } catch (error) {
    console.error('Error during analysis:', error);
    res.status(500).json({ error: 'Error analyzing file' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Test endpoint available at: http://localhost:5000/api/test');
  console.log('Uploads directory:', uploadsDir);
}).on('error', (err) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
  }
}); 