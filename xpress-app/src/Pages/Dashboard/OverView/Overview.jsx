import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Package, DollarSign, ShoppingCart, CheckCircle, TrendingUp, TrendingDown, AlertTriangle, Info, Bell, Activity, UserPlus, X, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../config/api';
import LoadingSpinner from '../../../Components/LoadingSpinner';
import { fetchDashboardStats, fetchAdminLogs } from '../../../dashboardSlice';
import { StatsSkeleton, ChartSkeleton, TableSkeleton } from '../../../Components/Skeleton';

const Overview = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const products = useSelector((state) => state.products.items || []);
  const { stats, logs, status, lastFetched, error: reduxError } = useSelector((state) => state.dashboard);

  const [activeMetric, setActiveMetric] = useState('revenue'); // revenue, orders, customers
  const [activeTab, setActiveTab] = useState('analytics');
  const [localError, setLocalError] = useState(null);

  const lowStockProducts = products.filter(p => {
    const stock = p.stock || p.quantity || 0;
    const threshold = p.lowStockThreshold || 10;
    return stock <= threshold;
  });

  // Simple performance data
  const performanceData = {
    bestSelling: products.slice(0, 3).map((p, i) => ({
        name: p.itemName,
        sales: Math.floor(Math.random() * 500) + 100,
        growth: `+${(Math.random() * 15).toFixed(1)}%`,
        stock: p.stock || p.quantity || 0
    })),
    lowPerforming: products.slice(-3).map((p, i) => ({
        name: p.itemName,
        sales: Math.floor(Math.random() * 20),
        growth: `-${(Math.random() * 5).toFixed(1)}%`,
        stock: p.stock || p.quantity || 0
    }))
  };

  useEffect(() => {
    // Only fetch if we don't have data or it's older than 5 minutes
    const shouldFetch = !lastFetched || (Date.now() - lastFetched > 5 * 60 * 1000);
    if (token && shouldFetch) {
      dispatch(fetchDashboardStats());
      dispatch(fetchAdminLogs());
    }
  }, [token, dispatch, lastFetched]);

  const refreshData = () => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAdminLogs());
  };

  const analyticsData = stats.analytics || [];
  const displayError = localError || reduxError;

  const getMetricConfig = () => {
    switch(activeMetric) {
        case 'revenue':
            return {
                label: 'Monthly Revenue',
                dataKey: 'revenue',
                color: '#F59E0B',
                format: (val) => `GHC ${val.toLocaleString()}`
            };
        case 'orders':
            return {
                label: 'Monthly Orders',
                dataKey: 'orders',
                color: '#3B82F6',
                format: (val) => `${val} Orders`
            };
        case 'customers':
            return {
                label: 'New Customers',
                dataKey: 'customers',
                color: '#10B981',
                format: (val) => `${val} Users`
            };
        default:
            return { label: 'Revenue', dataKey: 'revenue', color: '#F59E0B', format: (v) => v };
    }
  };

  const metric = getMetricConfig();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-left">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
          <p className="font-bold text-gray-900" style={{ color: metric.color }}>
            {metric.format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ icon: Icon, title, value, loading, format = 'number' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="text-left">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
        <p className="text-2xl font-black text-gray-900">
            {format === 'currency' 
            ? `GHC ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
            : value.toLocaleString()
            }
        </p>
      </div>
      <div className="p-3 rounded-2xl bg-gray-50 text-yellow-500">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );

  // If loading and NO data yet, show skeleton layout
  if (status === "loading" && analyticsData.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-full mt-20 thin-scrollbar">
        <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Synchronizing your dealership insights...</p>
        </div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
          <div className="lg:col-span-1">
            <TableSkeleton rows={8} cols={1} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full mt-20 thin-scrollbar">
      {/* Error Alert */}
      {displayError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider">Connection Issue</p>
              <p className="text-sm font-medium">{displayError}</p>
            </div>
          </div>
          <button 
            onClick={() => setLocalError(null)}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-left">
            <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back. Here's what's happening today.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {status === "loading" && (
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Syncing...
            </div>
          )}
          <button
            onClick={refreshData}
            disabled={status === "loading"}
            className="bg-white border border-gray-200 text-gray-900 px-4 py-2 rounded-xl transition-all hover:bg-gray-50 font-bold text-sm shadow-sm disabled:opacity-50"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex space-x-1 bg-white p-1 rounded-2xl border border-gray-100 w-fit mb-8 shadow-sm">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'analytics' ? 'bg-yellow-400 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all relative ${
            activeTab === 'alerts' ? 'bg-yellow-400 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
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
        {user?.role !== 'accountant' && (
          <StatCard
            icon={Package}
            title="Total Products"
            value={stats.totalProducts}
          />
        )}
        <StatCard
          icon={DollarSign}
          title="Total Sales"
          value={stats.totalSales}
          format="currency"
        />
        <StatCard
          icon={ShoppingCart}
          title="Active Orders"
          value={stats.newOrders}
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={stats.completedOrders}
        />
      </div>

      {/* Sales Analytics Chart */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="text-left">
            <h2 className="text-xl font-black text-gray-900">{metric.label}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Growth & Performance Trends</p>
          </div>
          
          <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
            {[
                { id: 'revenue', label: 'Revenue', icon: DollarSign },
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'customers', label: 'Signups', icon: UserPlus }
            ].map((t) => (
                <button
                    key={t.id}
                    onClick={() => setActiveMetric(t.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        activeMetric === t.id 
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-100' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <t.icon className="w-3.5 h-3.5" />
                    {t.label}
                </button>
            ))}
          </div>
        </div>

        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metric.color} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={metric.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F9FAFB" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                  tickFormatter={(val) => activeMetric === 'revenue' ? `GHC ${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}` : val}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey={metric.dataKey} 
                  stroke={metric.color} 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
        </div>

        {/* Chart Summary */}
        <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Peak Performance</p>
            <p className="text-xl font-black text-gray-900">
               {metric.format(Math.max(...analyticsData.map(d => d[metric.dataKey] || 0)))}
            </p>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Average</p>
            <p className="text-xl font-black text-gray-900">
               {metric.format(Math.round(analyticsData.reduce((acc, curr) => acc + (curr[metric.dataKey] || 0), 0) / (analyticsData.length || 1)))}
            </p>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">YTD Total</p>
            <p className="text-xl font-black text-gray-900">
               {metric.format(analyticsData.reduce((acc, curr) => acc + (curr[metric.dataKey] || 0), 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Product Performance Section */}
      {user?.role !== 'accountant' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Best Selling */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-8">
                <div className="text-left">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      Top Movers
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">High conversion inventory</p>
                </div>
                <Link to="/products" className="text-xs text-yellow-500 font-black hover:underline uppercase tracking-widest">Manage</Link>
            </div>
            <div className="space-y-4">
                {performanceData.bestSelling.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white text-gray-400 rounded-xl flex items-center justify-center font-black text-xs shadow-sm shadow-gray-200/50 border border-gray-100">#{i+1}</div>
                      <div className="text-left">
                        <p className="text-sm font-black text-gray-900 truncate max-w-[150px]">{item.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-green-500">{item.growth}</p>
                      <p className="text-[10px] font-bold text-gray-400">Stock: {item.stock}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Low Performing */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-8">
                <div className="text-left">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      Stagnant Stock
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Requires focus or pricing adjustment</p>
                </div>
                <Link to="/products" className="text-xs text-yellow-500 font-black hover:underline uppercase tracking-widest">Manage</Link>
            </div>
            <div className="space-y-4">
                {performanceData.lowPerforming.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white text-gray-400 rounded-xl flex items-center justify-center font-black text-xs shadow-sm shadow-gray-200/50 border border-gray-100">#{i+1}</div>
                      <div className="text-left">
                        <p className="text-sm font-black text-gray-900 truncate max-w-[150px]">{item.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.sales} units moved</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-red-500">{item.growth}</p>
                      <p className="text-[10px] font-bold text-gray-400">Stock: {item.stock}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
    ) : (
      /* ALERTS TAB */
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <div className="text-left mb-6">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 shadow-sm" />
                Critical Stock Alerts
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Immediate action required</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lowStockProducts.length === 0 ? (
              <div className="col-span-full p-12 bg-white rounded-3xl border border-dashed border-gray-100 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-100">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-gray-900 font-black">All stock levels optimized.</p>
                <p className="text-xs text-gray-400 mt-1">System is healthy and inventory is balanced.</p>
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <Link to={`/edit-product/${p.id || p._id || p.uid}`} key={p.uid || p.id} className="bg-white p-6 rounded-3xl border border-gray-50 hover:border-red-100 hover:shadow-xl hover:shadow-red-500/5 transition-all group scale-100 hover:scale-[1.02]">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-red-50 text-red-500 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 uppercase tracking-widest">Critical</span>
                   </div>
                   <h4 className="text-sm font-black text-gray-900 mb-2 text-left line-clamp-2">{p.itemName}</h4>
                   <div className="flex items-center justify-between mt-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Current Stock</p>
                        <p className="text-lg font-black text-red-600">{p.stock || p.quantity || 0}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Alert Limit</p>
                         <p className="text-sm font-black text-gray-900">{p.lowStockThreshold || 10}</p>
                      </div>
                   </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
           <div className="text-left mb-6">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    Security & Logs
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time system event monitoring</p>
           </div>
          
          <div className="bg-white rounded-3xl border border-gray-50 overflow-hidden shadow-sm">
            {logs.length > 0 ? logs.slice(0, 10).map((log, i) => (
              <div key={i} className="flex items-center justify-center min-h-[60px] p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${
                    log.action.includes('Delete') || log.action.includes('Fail') ? 'bg-red-500 border-2 border-red-100' : 
                    log.action.includes('Update') || log.action.includes('Edit') ? 'bg-blue-400 border-2 border-blue-100' : 
                    'bg-green-400 border-2 border-green-100'
                  }`}></div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-700">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter whitespace-nowrap block">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </span>
                  <span className="text-[10px] text-gray-400">by {log.adminEmail}</span>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-500 text-sm font-medium">No recent logs found.</div>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Overview;