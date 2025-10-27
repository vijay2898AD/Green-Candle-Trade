import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import type { Transaction } from '../store/portfolioStore'; 

interface PortfolioChartProps {
  transactions: Transaction[];
  initialCash: number;
}

const formatIndianCurrency = (value: number) => {
  if (value >= 10000000) { 
    const formatted = (value / 10000000).toFixed(1).replace('.0', '');
    return `₹${formatted}Cr`;
  }
  if (value >= 100000) { 
    const formatted = (value / 100000).toFixed(0);
    return `₹${formatted}L`;
  }
  if (value >= 1000) { 
    const formatted = (value / 1000).toFixed(0);
    return `₹${formatted}k`;
  }
  return `₹${value}`;
};


export const PortfolioChart = ({ transactions, initialCash }: PortfolioChartProps) => {

  const chartData = useMemo(() => {
    if (transactions.length === 0) {
       return [{ name: 'Start', cash: initialCash }];
     }
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
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#48BB78" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#48BB78" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" strokeOpacity={0.5} />
            <XAxis dataKey="name" stroke="#A0AEC0" />
            
            <YAxis 
              stroke="#A0AEC0" 
              tickFormatter={formatIndianCurrency} 
              domain={[0, 'auto']}
              allowDataOverflow={true}
            />
            
            <Tooltip
              contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
              itemStyle={{ color: '#48BB78' }}
              formatter={(value: number) => [value.toLocaleString('en-IN', {style: 'currency', currency: 'INR', maximumFractionDigits: 2}), 'Cash Balance']}
              cursor={{ stroke: '#48BB78', strokeWidth: 2 }}
            />
            
            <Legend wrapperStyle={{ color: '#E2E8F0' }}/>
            
            <Area type="monotone" dataKey="cash" stroke="false" fill="url(#colorCash)" />

            <Line 
              type="monotone" 
              dataKey="cash" 
              stroke="#48BB78"
              strokeWidth={3} 
              dot={{ 
                fill: '#FFFFFF',
                stroke: '#48BB78',
                strokeWidth: 2, 
                r: 4 
              }} 
              activeDot={{ 
                fill: '#48BB78',
                stroke: '#FFFFFF', 
                strokeWidth: 2, 
                r: 6 
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};