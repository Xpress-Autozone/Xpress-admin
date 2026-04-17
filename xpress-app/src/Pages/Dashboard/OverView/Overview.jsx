import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, DollarSign, ShoppingCart, CheckCircle, TrendingUp, TrendingDown, AlertTriangle, Info, Bell, Activity } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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
  const [activeTab, setActiveTab] = useState('analytics');

  // Select real products from Redux
  const products = useSelector((state) => state.products.items || []);

  const lowStockProducts = products.filter(p => {
    const stock = p.stock || p.quantity || 0;
    const threshold = p.lowStockThreshold || 10;
    return stock <= threshold;
  });

  const performanceData = {
    bestSelling: [
      { name: 'Spark Plug XP-9', sales: 450, growth: '+12%', stock: 24 },
      { name: 'Oil Filter XL', sales: 380, growth: '+8%', stock: 110 },
      { name: 'Brake Pad Set', sales: 310, growth: '+15%', stock: 45 }
    ],
    lowPerforming: [
      { name: 'Engine Belt B4', sales: 12, growth: '-5%', stock: 8 },
      { name: 'Clutch Cable V2', sales: 5, growth: '-12%', stock: 2 },
      { name: 'Air Intake G3', sales: 3, growth: '-20%', stock: 15 }
    ]
  };

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
      <div className='h-1 w-16 bg-amber-300 mb-6'></div>

      {/* Tab Switcher */}
      <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 w-fit mb-8 shadow-sm">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'analytics' ? 'bg-yellow-400 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all relative ${
            activeTab === 'alerts' ? 'bg-yellow-400 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          Alerts
          {lowStockProducts.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center text-white">
                {lowStockProducts.length}
              </span>
            </span>
          )}
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <>
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

      {/* Product Performance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Best Selling */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Best Selling Products
              </h3>
              <button className="text-sm text-yellow-600 font-bold hover:underline">View All</button>
           </div>
           <div className="space-y-4">
              {performanceData.bestSelling.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white text-gray-400 rounded flex items-center justify-center font-bold text-xs ring-1 ring-gray-100">#{i+1}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 text-left">{item.name}</p>
                      <p className="text-[11px] text-gray-400 text-left">{item.sales} sold this month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">{item.growth}</p>
                    <p className="text-[11px] text-gray-400">Stock: {item.stock}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Low Performing */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                Low Performing Products
              </h3>
              <button className="text-sm text-yellow-600 font-bold hover:underline">View All</button>
           </div>
           <div className="space-y-4">
              {performanceData.lowPerforming.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white text-gray-400 rounded flex items-center justify-center font-bold text-xs ring-1 ring-gray-100">#{i+1}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 text-left">{item.name}</p>
                      <p className="text-[11px] text-gray-400 text-left">{item.sales} units moved</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{item.growth}</p>
                    <p className="text-[11px] text-gray-400">Stock: {item.stock}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </>
    ) : (
      /* ALERTS TAB */
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4 text-left">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Critical Stock Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lowStockProducts.length === 0 ? (
              <div className="col-span-full p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No low stock items detected.</p>
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <Link to={`/edit-product/${p.id || p._id || p.uid}`} key={p.uid || p.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-red-400 transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">CRITICAL</span>
                   </div>
                   <h4 className="text-sm font-bold text-gray-900 mb-1 text-left">{p.itemName}</h4>
                   <div className="flex items-center justify-between mt-4">
                      <div className="text-left text-xs font-medium text-gray-500">Current: <span className="text-red-600 font-bold">{p.stock || p.quantity || 0}</span></div>
                      <div className="text-right text-xs font-medium text-gray-500">Limit: {p.lowStockThreshold || 10}</div>
                   </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4 text-left">
            <Info className="w-5 h-5 text-blue-500" />
            System Notifications
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {[
              { title: 'Admin "gokro" authenticated successfully (IP: 197.251.1x)', meta: '12 minutes ago', type: 'success' },
              { title: 'Failed access login for "admin@xpress.com" (IP: 41.215.1x)', meta: '1 hour ago', type: 'warning' },
              { title: 'Automatic Server Backup initiated & completed (Size: 340MB)', meta: '4 hours ago', type: 'info' },
              { title: 'System Administrator password reset requested', meta: 'Yesterday', type: 'warning' },
              { title: 'Cron: Midnight catalog cache rebuild executed successfully', meta: 'Yesterday', type: 'success' }
            ].map((note, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    note.type === 'success' ? 'bg-green-400' : 
                    note.type === 'warning' ? 'bg-orange-500' : 
                    'bg-blue-400'
                  }`}></div>
                  <p className="text-sm font-medium text-gray-700 text-left">{note.title}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{note.meta}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Overview;