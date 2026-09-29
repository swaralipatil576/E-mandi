import React, { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [dashboard, setDashboard] = useState(null);
  const [movements, setMovements] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, moveRes] = await Promise.all([
        fetch('http://localhost:8080/api/inventory'),
        fetch('http://localhost:8080/api/inventory/movements')
      ]);
      const dashData = await dashRes.json();
      const moveData = await moveRes.json();
      setDashboard(dashData);
      setMovements(moveData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Inventory...</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-8">
      <h1 className="text-3xl font-display font-bold text-[#012d1d] mb-6">Smart Inventory</h1>

      <div className="flex gap-4 mb-6 border-b border-[#c1c8c2]">
        <button
          className={`pb-2 px-2 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-[#1b4332] text-[#1b4332]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Stock Dashboard & Alerts
        </button>
        <button
          className={`pb-2 px-2 font-medium ${activeTab === 'movements' ? 'border-b-2 border-[#1b4332] text-[#1b4332]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('movements')}
        >
          Stock Movement History
        </button>
      </div>

      {activeTab === 'dashboard' && dashboard && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c1c8c2]">
              <p className="text-sm text-gray-500">Total Stock (Quintals)</p>
              <p className="text-2xl font-bold">{dashboard.totalInventoryQuantity?.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c1c8c2]">
              <p className="text-sm text-gray-500">Active Lots</p>
              <p className="text-2xl font-bold">{dashboard.activeLotsCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 bg-red-50">
              <p className="text-sm text-red-600">Low-Stock Lots</p>
              <p className="text-2xl font-bold text-red-700">{dashboard.lowStockCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 bg-orange-50">
              <p className="text-sm text-orange-600">Slow-Moving Lots</p>
              <p className="text-2xl font-bold text-orange-700">{dashboard.slowMovingCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#c1c8c2] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#c1c8c2] bg-gray-50">
              <h2 className="font-semibold text-[#012d1d]">Active Inventory Lots</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">Crop</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">Quantity (Q)</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">Threshold (Q)</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">Stock Alert</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">Days in Stock</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">Aging Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboard.lots?.map((lot) => (
                    <tr key={lot.lotId}>
                      <td className="px-6 py-4">{lot.cropName}</td>
                      <td className="px-6 py-4">{lot.quantity?.toFixed(2)}</td>
                      <td className="px-6 py-4">{lot.threshold?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          lot.alertLevel === 'Healthy' ? 'bg-green-100 text-green-700' :
                          lot.alertLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {lot.alertLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">{lot.daysInInventory}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          lot.ageStatus === 'Healthy' ? 'bg-green-100 text-green-700' :
                          lot.ageStatus === 'Slow Moving' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {lot.ageStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="bg-white rounded-xl shadow-sm border border-[#c1c8c2] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Date/Time</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Crop</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Movement</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Quantity (Q)</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Lot ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="px-6 py-4">{new Date(m.movementDate).toLocaleString()}</td>
                    <td className="px-6 py-4">{m.cropName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        m.movementType === 'IN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {m.movementType === 'IN' ? '+ STOCK IN' : '- STOCK OUT'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{m.quantity?.toFixed(2)}</td>
                    <td className="px-6 py-4">#{m.produceLot?.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {movements.length === 0 && (
              <div className="p-8 text-center text-gray-500">No stock movements found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
