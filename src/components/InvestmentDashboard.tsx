import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface InvestmentDashboardProps {
  data: {
    investmentAmount: number;
    riskTolerance: number[];
    investmentGoal: string;
    timeHorizon: string;
  };
}

export default function InvestmentDashboard({ data }: InvestmentDashboardProps) {
  // Calculate portfolio allocation based on risk tolerance
  const calculatePortfolio = () => {
    const riskScore = data.riskTolerance[0];
    let stocks, bonds, alternatives;

    if (riskScore <= 3) {
      stocks = 30;
      bonds = 60;
      alternatives = 10;
    } else if (riskScore <= 7) {
      stocks = 60;
      bonds = 30;
      alternatives = 10;
    } else {
      stocks = 80;
      bonds = 10;
      alternatives = 10;
    }

    return [
      { name: 'Stocks', value: stocks },
      { name: 'Bonds', value: bonds },
      { name: 'Alternatives', value: alternatives },
    ];
  };

  const portfolioData = calculatePortfolio();
  const COLORS = ['#E9967A', '#8A6D5F', '#FDE1D3'];

  // Calculate projected returns
  const calculateProjectedReturns = () => {
    const riskScore = data.riskTolerance[0];
    let annualReturn;

    if (riskScore <= 3) {
      annualReturn = 4;
    } else if (riskScore <= 7) {
      annualReturn = 6;
    } else {
      annualReturn = 8;
    }

    const years = data.timeHorizon === 'short' ? 3 : data.timeHorizon === 'medium' ? 5 : 10;
    const totalReturn = data.investmentAmount * Math.pow(1 + annualReturn/100, years);
    const profit = totalReturn - data.investmentAmount;

    return {
      annualReturn,
      totalReturn,
      profit,
      years
    };
  };

  const returns = calculateProjectedReturns();

  // Get investment recommendations
  const getRecommendations = () => {
    const recommendations = [];
    
    if (data.riskTolerance[0] <= 3) {
      recommendations.push({
        type: 'Stocks',
        suggestions: ['Vanguard Total Stock Market ETF (VTI)', 'Schwab U.S. Dividend Equity ETF (SCHD)'],
        allocation: '30%'
      });
      recommendations.push({
        type: 'Bonds',
        suggestions: ['iShares Core U.S. Aggregate Bond ETF (AGG)', 'Vanguard Total Bond Market ETF (BND)'],
        allocation: '60%'
      });
      recommendations.push({
        type: 'Alternatives',
        suggestions: ['Gold ETF (GLD)', 'Real Estate Investment Trusts (VNQ)'],
        allocation: '10%'
      });
    } else if (data.riskTolerance[0] <= 7) {
      recommendations.push({
        type: 'Stocks',
        suggestions: ['SPDR S&P 500 ETF (SPY)', 'Invesco QQQ Trust (QQQ)'],
        allocation: '60%'
      });
      recommendations.push({
        type: 'Bonds',
        suggestions: ['iShares 7-10 Year Treasury Bond ETF (IEF)', 'Vanguard Intermediate-Term Bond ETF (BIV)'],
        allocation: '30%'
      });
      recommendations.push({
        type: 'Alternatives',
        suggestions: ['Bitcoin ETF (BITO)', 'Commodity ETFs (DBC)'],
        allocation: '10%'
      });
    } else {
      recommendations.push({
        type: 'Stocks',
        suggestions: ['ARK Innovation ETF (ARKK)', 'Global X Robotics & AI ETF (BOTZ)'],
        allocation: '80%'
      });
      recommendations.push({
        type: 'Bonds',
        suggestions: ['iShares 20+ Year Treasury Bond ETF (TLT)', 'Vanguard Long-Term Bond ETF (BLV)'],
        allocation: '10%'
      });
      recommendations.push({
        type: 'Alternatives',
        suggestions: ['Crypto ETFs (BITO, GBTC)', 'Leveraged ETFs (UPRO, TQQQ)'],
        allocation: '10%'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-catty-gray">Investment Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-catty-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-catty-brown">${data.investmentAmount.toLocaleString()}</div>
            <p className="text-xs text-catty-gray mt-1">Initial Investment</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-catty-gray">Risk Tolerance</CardTitle>
            <TrendingUp className="h-4 w-4 text-catty-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-catty-brown">{data.riskTolerance[0]}/10</div>
            <p className="text-xs text-catty-gray mt-1">Risk Score</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-catty-gray">Time Horizon</CardTitle>
            <Clock className="h-4 w-4 text-catty-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-catty-brown capitalize">{data.timeHorizon}</div>
            <p className="text-xs text-catty-gray mt-1">Investment Period</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-catty-brown">Recommended Portfolio Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-catty-brown">Projected Returns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-catty-peach/20 rounded-lg">
                <h3 className="font-semibold text-catty-brown">Annual Return</h3>
                <p className="text-2xl font-bold text-catty-orange">{returns.annualReturn}%</p>
              </div>
              <div className="p-4 bg-catty-peach/20 rounded-lg">
                <h3 className="font-semibold text-catty-brown">Total Return</h3>
                <p className="text-2xl font-bold text-catty-orange">${returns.totalReturn.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-catty-peach/20 rounded-lg">
                <h3 className="font-semibold text-catty-brown">Profit</h3>
                <p className="text-2xl font-bold text-catty-orange">${returns.profit.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-sm text-catty-gray">
              Projected returns over {returns.years} years based on historical performance and current market conditions.
              Past performance is not indicative of future results.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-catty-brown">Investment Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-catty-peach/20 rounded-lg">
                <h3 className="font-semibold text-catty-brown">{rec.type} ({rec.allocation})</h3>
                <ul className="list-disc list-inside text-sm text-catty-gray mt-2">
                  {rec.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 