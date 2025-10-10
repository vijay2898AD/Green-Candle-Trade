// src/components/PortfolioChart.tsx

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../store/portfolioStore'; // Assuming you export this type

interface PortfolioChartProps {
  transactions: Transaction[];
  initialCash: number;
}

export const PortfolioChart = ({ transactions, initialCash }: PortfolioChartProps) => {

  // useMemo will prevent this heavy calculation from running on every re-render
  const chartData = useMemo(() => {
    if (transactions.length === 0) {
      return [{ name: 'Start', cash: initialCash }];
    }

    // Sort transactions chronologically
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let runningCash = initialCash;
    const dataPoints = [{ name: 'Start', cash: initialCash }];

    sortedTransactions.forEach((t, index) => {
      if (t.type === 'BUY') {
        runningCash -= t.quantity * t.price;
      } else {
        runningCash += t.quantity * t.price;
      }
      dataPoints.push({
        name: `Trade #${index + 1}`,
        cash: runningCash,
      });
    });

    return dataPoints;
  }, [transactions, initialCash]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg mt-6">
      <h3 className="text-xl font-bold mb-4">Cash Balance History</h3>
      {/* Set a fixed height for the chart container */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            <YAxis 
              stroke="#A0AEC0" 
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} 
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#2D3748', border: 'none' }}
              labelStyle={{ color: '#E2E8F0' }}
              formatter={(value: number) => [value.toLocaleString('en-IN', {style: 'currency', currency: 'INR'}), 'Cash']}
            />
            <Legend wrapperStyle={{ color: '#E2E8F0' }}/>
            <Line type="monotone" dataKey="cash" stroke="#48BB78" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};