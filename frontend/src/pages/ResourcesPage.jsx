import React, { useState, useEffect } from 'react';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [requests, setRequests] = useState([]);
  const [utilization, setUtilization] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Form states for creating a new request
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqResourceType, setReqResourceType] = useState('Transport');
  const [reqCapacity, setReqCapacity] = useState('');
  const [reqDate, setReqDate] = useState('');
  const [reqLotId, setReqLotId] = useState('1'); // Mock lot ID for demo

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRes, reqRes, utilRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/resources`),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/resources/requests`),
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/resources/utilization`)
      ]);
      setResources(await resRes.json());
      setRequests(await reqRes.json());
      setUtilization(await utilRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      // Mock farmer ID 1
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/resources/requests?farmerId=1&lotId=${reqLotId}&resourceType=${reqResourceType}&requiredCapacity=${reqCapacity}&preferredDate=${reqDate}T00:00:00`, {
        method: 'POST'
      });
      setShowRequestForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAllocate = async (reqId, resourceId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/resources/requests/${reqId}/allocate?resourceId=${resourceId}`, {
        method: 'PUT'
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to allocate');
      } else {
        fetchData();
      }
    } catch(err) {
      alert('Network error');
    }
  };

  const handleReject = async (reqId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/resources/requests/${reqId}/reject`, { method: 'PUT' });
      fetchData();
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Resources...</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-bold text-[#012d1d]">Smart Resource Allocation</h1>
        <button onClick={() => setShowRequestForm(!showRequestForm)} className="bg-[#1b4332] text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-900 transition-colors">
          + Create Request
        </button>
      </div>

      {showRequestForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c1c8c2] mb-6">
          <h2 className="text-xl font-bold mb-4">Request a Resource</h2>
          <form onSubmit={handleCreateRequest} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Resource Type</label>
              <select className="w-full border rounded-lg p-2" value={reqResourceType} onChange={e => setReqResourceType(e.target.value)}>
                <option value="Transport">Transport Vehicle</option>
                <option value="Storage">Storage Unit</option>
                <option value="Mandi Slot">Mandi Slot</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Required Capacity (kg/quintals)</label>
              <input type="number" required className="w-full border rounded-lg p-2" value={reqCapacity} onChange={e => setReqCapacity(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Preferred Date</label>
              <input type="date" required className="w-full border rounded-lg p-2" value={reqDate} onChange={e => setReqDate(e.target.value)} />
            </div>
            <button type="submit" className="bg-[#1b4332] text-white px-4 py-2 rounded-lg w-full">Submit Request</button>
          </form>
        </div>
      )}

      <div className="flex gap-4 mb-6 border-b border-[#c1c8c2]">
        <button className={`pb-2 px-2 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-[#1b4332] text-[#1b4332]' : 'text-gray-500'}`} onClick={() => setActiveTab('dashboard')}>
          Utilization Dashboard
        </button>
        <button className={`pb-2 px-2 font-medium ${activeTab === 'requests' ? 'border-b-2 border-[#1b4332] text-[#1b4332]' : 'text-gray-500'}`} onClick={() => setActiveTab('requests')}>
          Requests & Allocation
        </button>
        <button className={`pb-2 px-2 font-medium ${activeTab === 'master' ? 'border-b-2 border-[#1b4332] text-[#1b4332]' : 'text-gray-500'}`} onClick={() => setActiveTab('master')}>
          Resource Master
        </button>
      </div>

      {activeTab === 'dashboard' && utilization && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#c1c8c2]">
              <p className="text-sm text-gray-500">Total Resources</p>
              <p className="text-2xl font-bold">{utilization.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
              <p className="text-sm text-green-600">Available</p>
              <p className="text-2xl font-bold text-green-700">{utilization.available}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200">
              <p className="text-sm text-blue-600">Allocated</p>
              <p className="text-2xl font-bold text-blue-700">{utilization.allocated}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-200">
              <p className="text-sm text-red-600">Unavailable</p>
              <p className="text-2xl font-bold text-red-700">{utilization.unavailable}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c1c8c2]">
            <h2 className="text-lg font-bold mb-4">Resource Utilization</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(utilization.utilization || {}).map(([key, val]) => (
                <div key={key} className="flex flex-col items-center justify-center p-6 border rounded-full aspect-square max-w-[200px] mx-auto bg-gray-50">
                  <span className="text-sm text-gray-500 mb-2 text-center">{key}</span>
                  <span className="text-3xl font-bold text-[#1b4332]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'master' && (
        <div className="bg-white rounded-xl shadow-sm border border-[#c1c8c2] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Resource Name</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Type</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Location</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Capacity</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resources.map(r => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 font-medium">{r.resourceName}</td>
                    <td className="px-6 py-4">{r.resourceType}</td>
                    <td className="px-6 py-4">{r.location}</td>
                    <td className="px-6 py-4">{r.capacity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        r.status === 'Available' ? 'bg-green-100 text-green-700' :
                        r.status === 'Allocated' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl shadow-sm border border-[#c1c8c2] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Resource Type</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Capacity</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">Actions (Admin/Allocation)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map(req => (
                  <tr key={req.id}>
                    <td className="px-6 py-4">#{req.id}</td>
                    <td className="px-6 py-4">{req.resourceType}</td>
                    <td className="px-6 py-4">{req.preferredDate ? req.preferredDate.split('T')[0] : ''}</td>
                    <td className="px-6 py-4">{req.requiredCapacity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                        req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        req.status === 'ALLOCATED' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                      {req.allocatedResource && <div className="text-xs text-gray-500 mt-1">Resource: {req.allocatedResource.resourceName}</div>}
                    </td>
                    <td className="px-6 py-4">
                      {req.status === 'PENDING' && (
                        <div className="flex gap-2 items-center">
                          <select className="border rounded px-1 py-1 text-sm" id={`allocate-${req.id}`}>
                            <option value="">Select Resource...</option>
                            {resources.filter(r => r.resourceType === req.resourceType && r.status === 'Available').map(r => (
                              <option key={r.id} value={r.id}>{r.resourceName} (Cap: {r.capacity})</option>
                            ))}
                          </select>
                          <button 
                            className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                            onClick={() => {
                              const select = document.getElementById(`allocate-${req.id}`);
                              if(select.value) handleAllocate(req.id, select.value);
                            }}
                          >
                            Allocate
                          </button>
                          <button onClick={() => handleReject(req.id)} className="text-red-600 hover:underline text-sm ml-2">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && (
              <div className="p-8 text-center text-gray-500">No resource requests found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
