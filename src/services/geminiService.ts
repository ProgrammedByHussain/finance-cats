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
