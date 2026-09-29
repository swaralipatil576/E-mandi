import { useState, useEffect } from 'react';
import { getInventory } from '../services/analyticsApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function InventoryInsightsPage() {
    const [inventory, setInventory] = useState([]);
    
    useEffect(() => {
        getInventory().then(setInventory);
    }, []);

    return (
        <div className="max-w-[1440px] mx-auto w-full px-4 md:px-10 py-8 space-y-6">
            <h1 className="font-display text-[32px] font-bold text-[#012d1d]">Inventory Insights</h1>
            
            <div className="bg-white p-4 rounded-xl border border-[#c1c8c2] h-[400px]">
                <h2 className="font-title-md mb-4 text-[#012d1d]">Stock Level by Crop</h2>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={inventory}>
                        <XAxis dataKey="crop" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantity" fill="#386a20" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
