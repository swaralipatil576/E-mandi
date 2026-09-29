import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboard, getMarketPrices, getMyProduce } from '../services/api';
import SummaryCard from '../components/SummaryCard';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);
  const [myLots, setMyLots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [insights, setInsights] = useState([]);
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    async function loadData() {
      const [dashRes, marketRes, lotsRes] = await Promise.all([
        getDashboard(),
        getMarketPrices(),
        getMyProduce(),
      ]);

      if (dashRes.success) setSummary(dashRes.data);
      if (marketRes.success) setMarketPrices(marketRes.data.slice(0, 4)); // Show top 4
      if (lotsRes.success) setMyLots(lotsRes.data.slice(0, 3)); // Show top 3
      
      try {
        const fetchInsights = await import('../services/analyticsApi').then(m => m.getInsights);
        const insightsRes = await fetchInsights();
        if(insightsRes) setInsights(insightsRes);

        const invRes = await fetch('http://localhost:8080/api/inventory');
        if (invRes.ok) {
            setInventory(await invRes.json());
        }
      } catch (e) {}

      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center font-body-sm text-[#414844]">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Header & Quick Actions */}
      <div className="lg:col-span-12 mb-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-[32px] font-bold text-[#012d1d]">
                Good morning, {user?.name?.split(' ')[0] || 'Farmer'}
              </h1>
              <span className="bg-[#d8f3dc] text-[#1b4332] px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#1b4332] animate-pulse"></span> Live
              </span>
            </div>
            <p className="text-[#414844] font-body-sm mt-1">Last updated: Today, 10:42 AM</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/payments" className="bg-transparent border border-[#012d1d] text-[#012d1d] px-4 py-2 rounded font-label-md hover:bg-[#e8eff1] transition-colors">
              Payment History
            </Link>
            <Link to="/lots" className="bg-transparent border border-[#012d1d] text-[#012d1d] px-4 py-2 rounded font-label-md hover:bg-[#e8eff1] transition-colors">
              My Lots
            </Link>
            <Link to="/market-prices" className="bg-transparent border border-[#012d1d] text-[#012d1d] px-4 py-2 rounded font-label-md hover:bg-[#e8eff1] transition-colors">
              Market Prices
            </Link>
            <Link to="/register-produce" className="bg-[#1b4332] text-white px-6 py-2 rounded font-label-md hover:bg-[#012d1d] transition-colors flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span> Register Produce
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <SummaryCard
          label="Today's Best Price"
          value={`₹${summary?.todaysBestPrice?.price}/q`}
          sub={`${summary?.todaysBestPrice?.crop} · ${summary?.todaysBestPrice?.mandi}`}
          badge={summary?.todaysBestPrice?.change}
        />
        <SummaryCard
          label="Active Lots"
          value={summary?.activeLots < 10 ? `0${summary?.activeLots}` : summary?.activeLots}
          sub={`${summary?.awaitingAuction} awaiting auction`}
        />
        <SummaryCard
          label="Pending Payments"
          value={`₹${summary?.pendingPayments?.amount.toLocaleString('en-IN')}`}
          sub={`${summary?.pendingPayments?.count} transactions`}
        />
        <SummaryCard
          label="This Month's Sales"
          value={`₹${summary?.thisMonthSales?.amount.toLocaleString('en-IN')}`}
          badge={summary?.thisMonthSales?.change}
        />
      </div>

      {/* Left Column (Wide) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Market Prices Table */}
        <div className="bg-white border border-[#c1c8c2] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#c1c8c2] flex justify-between items-center bg-[#eef5f7]">
            <h2 className="font-title-md text-[#012d1d]">Today's Market Prices</h2>
            <select className="border border-[#c1c8c2] rounded px-2 py-1 text-sm bg-white text-[#161d1f] focus:outline-none focus:border-[#012d1d]">
              <option>All Crops</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f4fafd] border-b border-[#c1c8c2]">
                <tr>
                  <th className="p-3 font-semibold text-[#012d1d] font-body-sm">Crop</th>
                  <th className="p-3 font-semibold text-[#012d1d] font-body-sm">Mandi</th>
                  <th className="p-3 font-semibold text-[#012d1d] font-body-sm">Grade</th>
                  <th className="p-3 font-semibold text-[#012d1d] font-body-sm text-right">Price (₹/q)</th>
                  <th className="p-3 font-semibold text-[#012d1d] font-body-sm text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-[#161d1f]">
                {marketPrices.map((mp) => (
                  <tr key={mp.id} className="border-b border-[#c1c8c2] hover:bg-[#f4fafd] transition-colors">
                    <td className="p-3">{mp.crop}</td>
                    <td className="p-3">{mp.mandi}</td>
                    <td className="p-3">{mp.grade}</td>
                    <td className="p-3 text-right font-data-mono">{mp.price.toLocaleString('en-IN')}</td>
                    <td className={`p-3 text-right font-medium ${mp.trend === 'up' ? 'text-[#1b4332]' : 'text-[#ba1a1a]'}`}>
                      {mp.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-[#c1c8c2] text-center bg-[#eef5f7]">
            <Link to="/market-prices" className="text-[#012d1d] font-label-md hover:underline">
              View Full Market Prices →
            </Link>
          </div>
        </div>

        {/* My Produce */}
        <div className="bg-white border border-[#c1c8c2] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#c1c8c2] flex justify-between items-center bg-[#eef5f7]">
            <h2 className="font-title-md text-[#012d1d]">My Produce</h2>
            <Link to="/register-produce" className="bg-[#1b4332] text-white px-4 py-1.5 rounded font-label-md hover:bg-[#012d1d] transition-colors flex items-center gap-1 text-sm">
              <span className="material-symbols-outlined text-[16px]">add</span> Register New
            </Link>
          </div>
          <div className="divide-y divide-[#c1c8c2]">
            {myLots.map((lot) => (
              <div key={lot.id} className="p-4 flex justify-between items-center hover:bg-[#eef5f7] transition-colors">
                <div>
                  <p className="font-semibold text-[#012d1d]">{lot.crop}, {lot.quantity} {lot.unit}</p>
                  <p className="text-xs text-[#414844]">{lot.grade} · {lot.mandi}</p>
                </div>
                <StatusBadge status={lot.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Narrow) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Smart Insights */}
        <div className="bg-white border border-[#c1c8c2] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#c1c8c2] bg-[#eef5f7] flex items-center justify-between">
            <h2 className="font-title-md text-[#012d1d]">Smart Insights</h2>
            <span className="material-symbols-outlined text-[#1b4332]">lightbulb</span>
          </div>
          <div className="p-4 space-y-3">
            {insights.length > 0 ? insights.map((insight, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-[#386a20] text-[18px]">check_circle</span>
                <p className="text-sm text-[#414844] leading-tight">{insight}</p>
              </div>
            )) : (
              <p className="text-sm text-[#414844]">No insights generated yet.</p>
            )}
          </div>
        </div>

        {/* Smart Inventory Widget */}
        {inventory && (
        <div className="bg-white border border-[#c1c8c2] rounded-xl overflow-hidden mt-6">
          <div className="p-4 border-b border-[#c1c8c2] bg-[#eef5f7] flex items-center justify-between">
            <h2 className="font-title-md text-[#012d1d]">Smart Inventory</h2>
            <Link to="/inventory" className="text-sm text-[#1b4332] hover:underline">View All</Link>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm text-[#414844] mb-4">
              <div>Total Stock: <span className="font-bold text-[#012d1d]">{inventory.totalInventoryQuantity?.toFixed(2)} Q</span></div>
              <div>Active Lots: <span className="font-bold text-[#012d1d]">{inventory.activeLotsCount}</span></div>
              <div>Low Stock: <span className="font-bold text-red-600">{inventory.lowStockCount}</span></div>
              <div>Slow Moving: <span className="font-bold text-orange-600">{inventory.slowMovingCount}</span></div>
            </div>
            <div className="border-t border-[#c1c8c2] pt-3">
              <h3 className="font-semibold text-xs text-gray-500 mb-2 uppercase tracking-wide">Crop-wise Stock</h3>
              {Object.entries(inventory.cropWiseStock || {}).slice(0, 4).map(([crop, qty]) => (
                <div key={crop} className="flex justify-between items-center text-sm py-1 border-b border-gray-100 last:border-0">
                  <span className="text-[#012d1d]">{crop}</span>
                  <span className="font-data-mono font-medium">{qty?.toFixed(2)} Q</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Live Auction Activity */}
        <div className="bg-white border border-[#c1c8c2] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#c1c8c2] bg-[#eef5f7] flex items-center justify-between">
            <h2 className="font-title-md text-[#012d1d]">Live Auction Activity</h2>
            <span className="material-symbols-outlined text-[#1b4332]">gavel</span>
          </div>
          <div className="p-4 space-y-4">
            <div className="border border-[#c1c8c2] rounded p-3 bg-[#f4fafd]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-label-md text-[#012d1d]">Lot #EM-1048</span>
                <StatusBadge status="Bidding Open" />
              </div>
              <p className="text-[#414844] font-body-sm">Onion, 12 Qtl</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-[#414844]">Highest Bid:</span>
                <span className="font-data-mono font-bold text-[#012d1d]">₹2,480/q</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white border border-[#c1c8c2] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#c1c8c2] bg-[#eef5f7]">
            <h2 className="font-title-md text-[#012d1d]">Payment Summary</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-[#c1c8c2]">
              <span className="text-[#414844] font-body-sm">Received</span>
              <span className="font-data-mono font-medium text-[#012d1d]">
                ₹{summary?.totalReceived?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-[#c1c8c2]">
              <span className="text-[#414844] font-body-sm">Pending</span>
              <span className="font-data-mono font-medium text-[#93000a]">
                ₹{summary?.totalPending?.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="font-semibold text-[#012d1d]">Total Sales</span>
              <span className="font-data-mono font-bold text-[#012d1d] text-lg">
                ₹{summary?.totalSales?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="p-3 bg-[#eef5f7] text-center">
            <Link to="/payments" className="text-[#012d1d] font-label-md hover:underline">
              View Payment History →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
