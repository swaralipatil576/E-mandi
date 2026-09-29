import { useState, useEffect } from 'react';
import { getOverview, getCropPerformance, getForecast } from '../services/analyticsApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdvancedAnalyticsPage() {
    const [overview, setOverview] = useState(null);
    const [crops, setCrops] = useState([]);
    const [forecast, setForecast] = useState(null);
    
    useEffect(() => {
        getOverview().then(setOverview);
        getCropPerformance().then(setCrops);
        getForecast().then(setForecast);
    }, []);

    if(!overview) return <div className="p-10 text-center font-body-sm text-[#414844]">Loading analytics...</div>;

    return (
        <div className="max-w-[1440px] mx-auto w-full px-4 md:px-10 py-8 space-y-6">
            <h1 className="font-display text-[32px] font-bold text-[#012d1d]">Advanced Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#c1c8c2]">
                    <p className="text-[#414844] text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#012d1d]">₹{overview.totalRevenue?.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#c1c8c2]">
                    <p className="text-[#414844] text-sm">Total Sales</p>
                    <p className="text-2xl font-bold text-[#012d1d]">{overview.totalSales}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#c1c8c2]">
                    <p className="text-[#414844] text-sm">Avg Selling Price</p>
                    <p className="text-2xl font-bold text-[#012d1d]">₹{overview.averageSellingPrice?.toFixed(2)}/q</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#c1c8c2]">
                    <p className="text-[#414844] text-sm">Pending Payments</p>
                    <p className="text-2xl font-bold text-[#93000a]">₹{overview.totalPendingPayments?.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] h-[300px]">
                    <h2 className="font-title-md mb-4 text-[#012d1d]">Revenue by Crop</h2>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={crops}>
                            <XAxis dataKey="crop" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#1b4332" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] h-[300px]">
                    <h2 className="font-title-md mb-4 text-[#012d1d]">Sales Forecast</h2>
                    {forecast && (
                        <div className="space-y-4">
                            <p className="text-[#414844]">{forecast.message}</p>
                            <div className="flex justify-between items-center bg-[#eef5f7] p-4 rounded">
                                <div>
                                    <p className="text-sm">Historical Revenue</p>
                                    <p className="text-xl font-bold">₹{forecast.historicalRevenue?.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm">Forecasted</p>
                                    <p className="text-xl font-bold text-[#1b4332]">₹{forecast.forecastedNextMonthRevenue?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
