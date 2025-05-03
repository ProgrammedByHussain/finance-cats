import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface DashboardProps {
  data: {
    income: number;
    expenses: {
      [key: string]: number;
    };
    categories: Array<{
      name: string;
      value: number;
    }>;
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
  } | null;
}

const COLORS = [
  "#E9967A",
  "#8A6D5F",
  "#FDE1D3",
  "#FEF7CD",
  "#8E9196",
  "#FFB6C1",
  "#D8BFD8",
  "#ADD8E6",
  "#90EE90",
];

export default function Dashboard({ data }: DashboardProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-catty-gray">
          Upload a CSV file to see your financial dashboard
        </p>
      </div>
    );
  }

  // Calculate total expenses
  const totalExpenses = Object.values(data.expenses).reduce(
    (sum, value) => sum + value,
    0
  );

  // Calculate savings (income - expenses)
  const savings = data.income - totalExpenses;

  // Sort transactions to show most recent first
  const sortedTransactions = [...data.transactions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-catty-gray">
              Total Income
            </CardTitle>
            <DollarSign className="h-4 w-4 text-catty-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-catty-brown">
              ${data.income.toLocaleString()}
            </div>
            <p className="text-xs text-catty-gray mt-1">Monthly</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-catty-gray">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-catty-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-catty-brown">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-catty-gray mt-1">Monthly</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-catty-gray">
              Savings
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-catty-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-catty-brown">
              ${savings.toLocaleString()}
            </div>
            <p className="text-xs text-catty-gray mt-1">Monthly</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-catty-brown">
              Spending Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {data.categories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.categories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-catty-gray">No category data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-catty-brown">
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {sortedTransactions.length > 0 ? (
                sortedTransactions.slice(0, 7).map((transaction, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 hover:bg-catty-light-gray rounded-md"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-catty-gray">
                          {transaction.date}
                        </p>
                        <span className="text-xs px-2 py-0.5 bg-catty-peach/30 rounded-full">
                          {transaction.category}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`font-semibold ${
                        transaction.amount > 0
                          ? "text-green-600"
                          : "text-catty-brown"
                      }`}
                    >
                      {transaction.amount > 0
                        ? `+${transaction.amount.toFixed(2)}`
                        : `-${Math.abs(transaction.amount).toFixed(2)}`}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-catty-gray">
                    No transaction data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-catty-brown">
            Sir Pounce's Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-catty-peach/20 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-catty-orange flex items-center justify-center">
                <span className="text-white text-xs">🐾</span>
              </div>
              <div>
                <p className="font-medium text-catty-brown">
                  Highest spending category:{" "}
                  {data.spendingInsights.highestCategory}
                </p>
                <p className="text-sm text-catty-gray mt-1">
                  This takes up approximately{" "}
                  {Math.round(
                    (data.expenses[
                      data.spendingInsights.highestCategory.toLowerCase()
                    ] /
                      totalExpenses) *
                      100
                  )}
                  % of your monthly expenses.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-catty-cream/20 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-catty-orange flex items-center justify-center">
                <span className="text-white text-xs">💡</span>
              </div>
              <div>
                <p className="font-medium text-catty-brown">Savings tips:</p>
                <ul className="list-disc list-inside text-sm text-catty-gray mt-1">
                  {data.spendingInsights.savingsTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-catty-light-gray rounded-lg">
              <div className="w-8 h-8 rounded-full bg-catty-orange flex items-center justify-center">
                <span className="text-white text-xs">📊</span>
              </div>
              <div>
                <p className="font-medium text-catty-brown">
                  Savings Rate: {data.savingsRate}%
                </p>
                <p className="text-sm text-catty-gray mt-1">
                  {data.savingsRate >= 20
                    ? "Great job! You're saving a healthy portion of your income."
                    : "Aim to save at least 20% of your income for financial security."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
