import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CreditCard, DollarSign, TrendingUp, Percent } from 'lucide-react';

interface CreditCardDashboardProps {
  data: {
    spendingCategories: {
      [key: string]: boolean;
    };
    cardGoal: string;
  };
}

export default function CreditCardDashboard({ data }: CreditCardDashboardProps) {
  // Calculate rewards based on spending categories
  const calculateRewards = () => {
    const selectedCategories = Object.entries(data.spendingCategories)
      .filter(([_, selected]) => selected)
      .map(([category]) => category);

    // Mock rewards data based on spending categories
    const rewards = selectedCategories.map(category => {
      let rewardRate = 0;
      switch (category) {
        case 'dining':
          rewardRate = 3;
          break;
        case 'travel':
          rewardRate = 2;
          break;
        case 'groceries':
          rewardRate = 2;
          break;
        case 'gas':
          rewardRate = 2;
          break;
        case 'online':
          rewardRate = 1;
          break;
        case 'entertainment':
          rewardRate = 1;
          break;
        default:
          rewardRate = 1;
      }
      return {
        category,
        rewardRate,
        estimatedRewards: rewardRate * 100 // Mock monthly spending of $100 per category
      };
    });

    return rewards;
  };

  const rewardsData = calculateRewards();
  const totalEstimatedRewards = rewardsData.reduce((sum, item) => sum + item.estimatedRewards, 0);

  // Get card recommendations based on goals
  const getCardRecommendations = () => {
    const recommendations = [];
    
    if (data.cardGoal === 'cashback') {
      recommendations.push({
        name: 'Chase Freedom Unlimited',
        benefits: ['1.5% cash back on all purchases', '3% on dining and drugstores', '5% on travel through Chase'],
        annualFee: 0,
        signupBonus: '$200 after spending $500 in 3 months'
      });
    } else if (data.cardGoal === 'points') {
      recommendations.push({
        name: 'Chase Sapphire Preferred',
        benefits: ['2x points on travel and dining', '1x points on all other purchases', '25% more value when redeeming for travel'],
        annualFee: 95,
        signupBonus: '60,000 points after spending $4,000 in 3 months'
      });
    } else if (data.cardGoal === 'lowinterest') {
      recommendations.push({
        name: 'Citi Simplicity',
        benefits: ['0% intro APR for 21 months', 'No late fees', 'No penalty APR'],
        annualFee: 0,
        signupBonus: 'N/A'
      });
    } else {
      recommendations.push({
        name: 'American Express Gold',
        benefits: ['4x points at restaurants', '4x points at U.S. supermarkets', '3x points on flights'],
        annualFee: 250,
        signupBonus: '60,000 points after spending $4,000 in 6 months'
      });
    }

    return recommendations;
  };

  const cardRecommendations = getCardRecommendations();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-catty-gray">Selected Categories</CardTitle>
            <CreditCard className="h-4 w-4 text-catty-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-catty-brown">
              {Object.values(data.spendingCategories).filter(Boolean).length}
            </div>
            <p className="text-xs text-catty-gray mt-1">Spending Categories</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-catty-gray">Estimated Monthly Rewards</CardTitle>
            <DollarSign className="h-4 w-4 text-catty-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-catty-brown">${totalEstimatedRewards}</div>
            <p className="text-xs text-catty-gray mt-1">Based on your spending</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-catty-gray">Primary Goal</CardTitle>
            <TrendingUp className="h-4 w-4 text-catty-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-catty-brown capitalize">{data.cardGoal}</div>
            <p className="text-xs text-catty-gray mt-1">Card Selection Focus</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-catty-brown">Rewards by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rewardsData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rewardRate" fill="#E9967A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-catty-brown">Recommended Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cardRecommendations.map((card, index) => (
              <div key={index} className="p-4 bg-catty-peach/20 rounded-lg">
                <h3 className="font-semibold text-catty-brown">{card.name}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-catty-orange" />
                    <span className="text-sm text-catty-gray">Annual Fee: ${card.annualFee}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-catty-orange" />
                    <span className="text-sm text-catty-gray">Signup Bonus: {card.signupBonus}</span>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-catty-brown">Key Benefits:</h4>
                    <ul className="list-disc list-inside text-sm text-catty-gray mt-1">
                      {card.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 