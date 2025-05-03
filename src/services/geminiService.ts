import { GoogleGenerativeAI } from "@google/generative-ai";

// Define types
interface CreditCardRecommendation {
  name: string;
  description: string;
  benefits: string[];
  annualFee: string;
  interestRate: string;
  imageUrl?: string;
}

interface InvestmentRecommendation {
  type: string;
  suggestions: string[];
  allocation: string;
}

interface FinancialAnalysis {
  income: number;
  expenses: Record<string, number>;
  categories: Array<{ name: string; value: number }>;
  transactions: Array<{
    date: string;
    description: string;
    amount: number;
    category: string;
  }>;
  savingsRate: number;
  spendingInsights: {
    highestCategory: string;
    unusualSpending: boolean;
    savingsTips: string[];
  };
}

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function getCreditCardRecommendations(
  spendingCategories: Record<string, boolean>,
  cardGoal: string
): Promise<CreditCardRecommendation[]> {
  // Get the active spending categories
  const activeCategories = Object.keys(spendingCategories)
    .filter((key) => spendingCategories[key])
    .join(", ");

  // Construct the prompt for Gemini
  const prompt = `You are Dr. Bartholameow, a cat financial advisor specializing in Canadian credit cards. 
  Based on the following user preferences, recommend 3 real credit cards that are currently available to Canadians with specific details:
  
  Spending Categories: ${activeCategories || "No specific category selected"}
  Card Goal: ${cardGoal}
  
  IMPORTANT: Only recommend credit cards that are legitimately available for Canadians from actual Canadian banks or credit card issuers (e.g., RBC, TD, CIBC, Scotiabank, BMO, American Express Canada, Canadian Tire, PC Financial, Tangerine, etc.).
  
  For each card, provide:
  1. The actual card name from a Canadian bank or issuer (with a cat pun in your description if possible, but keep the real card name)
  2. A brief description (1 sentence)
  3. 3 specific benefits that are accurate for this card and tailored to the user's preferences
  4. The actual annual fee
  5. The accurate interest rate range
  
  Format your response as valid JSON with this structure:
  [
    {
      "name": "Real Card Name (from Canadian issuer)",
      "description": "Card description",
      "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
      "annualFee": "$X",
      "interestRate": "X% - Y% Variable APR"
    }
  ]`;

  try {
    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    // Find the JSON part of the response (in case there's surrounding text)
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response");
    }

    const cards = JSON.parse(jsonMatch[0]) as CreditCardRecommendation[];
    return cards;
  } catch (error) {
    console.error("Error fetching credit card recommendations:", error);
    throw error;
  }
}

export async function getInvestmentRecommendations(
  investmentAmount: number,
  riskTolerance: number[],
  investmentGoal: string,
  timeHorizon: string
): Promise<{
  portfolioAllocation: { name: string; value: number }[];
  annualReturn: number;
  totalReturn: number;
  profit: number;
  years: number;
  recommendations: InvestmentRecommendation[];
}> {
  // Construct the prompt for Gemini
  const prompt = `You are Dr. Clawdia, a cat financial advisor specializing in investments. 
    Based on the following user preferences, provide a detailed investment plan:
    
    Investment Amount: $${investmentAmount}
    Risk Tolerance: ${riskTolerance[0]}/10
    Investment Goal: ${investmentGoal}
    Time Horizon: ${timeHorizon} (short = 1-3 years, medium = 3-7 years, long = 7+ years)
    
    IMPORTANT INSTRUCTIONS FOR CALCULATIONS:
    1. The "portfolioAllocation" should contain percentage values that add up to 100%.
    2. The "annualReturn" should be a realistic percentage return based on the risk profile (typically 3-10%).
    3. For calculating "totalReturn", use compound interest formula: Investment * (1 + annualReturn/100)^years
    4. The "profit" MUST be calculated as: totalReturn - investmentAmount
    5. The "years" should be set based on timeHorizon: short=3, medium=5, long=10
    6. All dollar values should be rounded to whole numbers
    7. Ensure mathematical consistency: profit = totalReturn - investmentAmount
    
    Format your response as valid JSON with this structure:
    {
      "portfolioAllocation": [
        {"name": "Stocks", "value": X},  // X is a percentage (e.g. 60 for 60%)
        {"name": "Bonds", "value": Y},   // Y is a percentage (e.g. 30 for 30%)
        {"name": "Alternatives", "value": Z}  // Z is a percentage (e.g. 10 for 10%)
      ],
      "annualReturn": 7,  // Percentage (e.g. 7 for 7%)
      "totalReturn": 1970,  // Total value after growth (investment + profit)
      "profit": 970,  // Amount gained (totalReturn - investmentAmount)
      "years": 10,  // Number of years based on timeHorizon
      "recommendations": [
        {
          "type": "Stocks",
          "suggestions": ["Specific investment 1", "Specific investment 2"],
          "allocation": "60%"  // Should match the percentage in portfolioAllocation
        },
        {
          "type": "Bonds",
          "suggestions": ["Specific investment 1", "Specific investment 2"],
          "allocation": "30%"
        },
        {
          "type": "Alternatives",
          "suggestions": ["Specific investment 1", "Specific investment 2"],
          "allocation": "10%"
        }
      ]
    }`;

  try {
    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    // Find the JSON part of the response (in case there's surrounding text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response");
    }

    const investmentPlan = JSON.parse(jsonMatch[0]);

    // Validate the response to ensure mathematical consistency
    if (
      investmentPlan.totalReturn - investmentAmount !==
      investmentPlan.profit
    ) {
      // Fix the calculation if it's inconsistent
      investmentPlan.profit = investmentPlan.totalReturn - investmentAmount;
    }

    return investmentPlan;
  } catch (error) {
    console.error("Error fetching investment recommendations:", error);
    throw error;
  }
}

export async function analyzeCSVData(
  csvData: string
): Promise<FinancialAnalysis> {
  // Construct the prompt for Gemini
  const prompt = `You are Sir Pounce, a cat financial advisor specializing in budgeting and expense analysis.
    Analyze the following bank statement CSV data and provide insights:
    
    CSV Data:
    ${csvData}
    
    IMPORTANT INSTRUCTIONS:
    1. Parse the transaction data
    2. Identify income vs expenses
    3. Categorize expenses into common categories (e.g., Food, Utilities, Transportation, etc.)
    4. Calculate total income and expenses
    5. Identify spending patterns and the highest spending category
    6. Provide savings tips based on the spending patterns
    
    Format your response as valid JSON with this structure:
    {
      "income": 5000,
      "expenses": {
        "food": 300,
        "housing": 1200,
        "transportation": 250,
        "utilities": 150,
        "entertainment": 100,
        "other": 200
      },
      "categories": [
        {"name": "Food", "value": 300},
        {"name": "Housing", "value": 1200},
        {"name": "Transportation", "value": 250},
        {"name": "Utilities", "value": 150},
        {"name": "Entertainment", "value": 100},
        {"name": "Other", "value": 200}
      ],
      "transactions": [
        {
          "date": "2024-01-01",
          "description": "Sample Transaction",
          "amount": 50.00,
          "category": "Food"
        }
      ],
      "savingsRate": 20,
      "spendingInsights": {
        "highestCategory": "Housing",
        "unusualSpending": false,
        "savingsTips": [
          "Try to reduce dining out expenses",
          "Consider carpooling to save on transportation",
          "Look for better deals on entertainment subscriptions"
        ]
      }
    }`;

  try {
    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse the JSON response
    // Find the JSON part of the response (in case there's surrounding text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in the response");
    }

    const financialAnalysis = JSON.parse(jsonMatch[0]) as FinancialAnalysis;
    return financialAnalysis;
  } catch (error) {
    console.error("Error analyzing CSV data:", error);
    throw error;
  }
}
