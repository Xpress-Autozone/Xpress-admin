import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, ShoppingCart, CheckCircle } from 'lucide-react';

const Overview = () => {
  // Stats data - can be fetched from API
  const [stats, setStats] = useState({
    totalProducts: 12450,
    totalSales: 234567,
    newOrders: 215,
    completedOrders: 12
  });

  // Sales data for the chart - this should come from your backend
  const [salesData, setSalesData] = useState([
    { month: 'Jan', amount: 18500 },
    { month: 'Feb', amount: 22300 },
    { month: 'Mar', amount: 19800 },
    { month: 'Apr', amount: 26400 },
    { month: 'May', amount: 23900 },
    { month: 'Jun', amount: 28700 },
    { month: 'Jul', amount: 31200 },
    { month: 'Aug', amount: 29800 },
    { month: 'Sep', amount: 33400 },
    { month: 'Oct', amount: 36100 },
    { month: 'Nov', amount: 34800 },
    { month: 'Dec', amount: 38900 }
  ]);

  // Loading states
  const [statsLoading, setStatsLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);

  // Simulate API calls - replace with actual API calls
  useEffect(() => {
    fetchStats();
    fetchSalesData();
  }, []);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/dashboard/stats');
      // const data = await response.json();
      // setStats(data);
      
      // Simulating API delay
      setTimeout(() => {
        setStatsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStatsLoading(false);
    }
  };

  const fetchSalesData = async () => {
    setChartLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/dashboard/sales-analytics');
      // const data = await response.json();
      // setSalesData(data);
      
      // Simulating API delay and dynamic data update
      setTimeout(() => {
        // Simulate some variation in data
        const updatedData = salesData.map(item => ({
          ...item,
          amount: item.amount + Math.floor(Math.random() * 2000) - 1000
        }));
        setSalesData(updatedData);
        setChartLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setChartLoading(false);
    }
  };

  // Function to refresh data
  const refreshData = () => {
    fetchStats();
    fetchSalesData();
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{`Month: ${label}`}</p>
          <p className="text-blue-600 font-semibold">
            {`Sales: $${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ icon: Icon, title, value, loading, format = 'number' }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">
              {format === 'currency' 
                ? `$${value.toLocaleString()}` 
                : value.toLocaleString()
              }
            </p>
          )}
        </div>
        <div className="p-3 rounded-full bg-yellow-100">
          <Icon className="w-6 h-6 text-yellow-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-full mt-20 thin-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        
        <button
          onClick={refreshData}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
        >
          Refresh Data
        </button>
      </div>
    <div className='h-1 w-16 bg-amber-300 mb-8'></div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Package}
          title="Total Products"
          value={stats.totalProducts}
          loading={statsLoading}
        />
        <StatCard
          icon={DollarSign}
          title="Total Sales"
          value={stats.totalSales}
          loading={statsLoading}
          format="currency"
        />
        <StatCard
          icon={ShoppingCart}
          title="New Orders"
          value={stats.newOrders}
          loading={statsLoading}
        />
        <StatCard
          icon={CheckCircle}
          title="Completed Orders"
          value={stats.completedOrders}
          loading={statsLoading}
        />
      </div>

      {/* Sales Analytics Chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sales Analytics</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Monthly Sales</span>
          </div>
        </div>

        {chartLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading sales data...</p>
            </div>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1D4ED8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Highest Month</p>
            <p className="text-lg font-bold text-green-800">
              ${Math.max(...salesData.map(d => d.amount)).toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Average Monthly</p>
            <p className="text-lg font-bold text-green-800">
              ${Math.round(salesData.reduce((acc, curr) => acc + curr.amount, 0) / salesData.length).toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Annual</p>
            <p className="text-lg font-bold text-green-800">
              ${salesData.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;