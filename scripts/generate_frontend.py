import os

src_dir = "C:/Users/asus/Downloads/E-mandi/frontend/src"

analytics_api = """export const getOverview = async () => {
    try {
        const res = await fetch('http://localhost:8080/api/analytics/overview');
        return await res.json();
    } catch (e) { return null; }
};
export const getCropPerformance = async () => {
    try {
        const res = await fetch('http://localhost:8080/api/analytics/crop-performance');
        return await res.json();
    } catch (e) { return []; }
};
export const getInventory = async () => {
    try {
        const res = await fetch('http://localhost:8080/api/analytics/inventory');
        return await res.json();
    } catch (e) { return []; }
};
export const getInsights = async () => {
    try {
        const res = await fetch('http://localhost:8080/api/analytics/insights');
        return await res.json();
    } catch (e) { return []; }
};
export const getForecast = async () => {
    try {
        const res = await fetch('http://localhost:8080/api/analytics/forecast');
        return await res.json();
    } catch (e) { return null; }
};
export const chatWithAi = async (message) => {
    try {
        const res = await fetch('http://localhost:8080/api/ai/chat', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        return await res.json();
    } catch (e) { return { reply: "Error connecting to AI." }; }
};
"""

advanced_analytics = """import { useState, useEffect } from 'react';
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
"""

inventory_insights = """import { useState, useEffect } from 'react';
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
"""

chatbot_component = """import { useState } from 'react';
import { chatWithAi } from '../services/analyticsApi';

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([{text: "Hi! I am the e-Mandi AI Assistant. How can I help you?", isBot: true}]);
    const [input, setInput] = useState('');

    const sendMessage = async (msgText) => {
        if (!msgText.trim()) return;
        setMessages(prev => [...prev, { text: msgText, isBot: false }]);
        setInput('');
        
        const res = await chatWithAi(msgText);
        if (res && res.reply) {
            setMessages(prev => [...prev, { text: res.reply, isBot: true }]);
        } else {
            setMessages(prev => [...prev, { text: "Sorry, I couldn't reach the server.", isBot: true }]);
        }
    };

    const handleSend = () => {
        sendMessage(input);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {open ? (
                <div className="bg-white w-80 h-96 rounded-xl shadow-lg border border-[#c1c8c2] flex flex-col overflow-hidden">
                    <div className="bg-[#1b4332] text-white p-3 flex justify-between items-center">
                        <span className="font-semibold">e-Mandi AI</span>
                        <button onClick={() => setOpen(false)} className="material-symbols-outlined text-sm">close</button>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#f4fafd]">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                                <div className={`p-2 rounded-lg max-w-[80%] text-sm ${m.isBot ? 'bg-[#eef5f7] border border-[#c1c8c2] text-[#012d1d]' : 'bg-[#1b4332] text-white'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-[#c1c8c2] flex bg-white gap-2">
                        <input 
                            type="text" 
                            className="flex-1 border rounded px-2 py-1 text-sm outline-none" 
                            placeholder="Ask me anything..." 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="bg-[#1b4332] text-white px-3 rounded text-sm">Send</button>
                    </div>
                    <div className="bg-[#f4fafd] p-2 text-xs flex gap-2 overflow-x-auto whitespace-nowrap border-t border-[#c1c8c2]">
                        <button onClick={() => sendMessage("Show my sales summary")} className="bg-[#e8eff1] px-2 py-1 rounded border border-[#c1c8c2] hover:bg-white">Sales summary</button>
                        <button onClick={() => sendMessage("What is my best-selling crop?")} className="bg-[#e8eff1] px-2 py-1 rounded border border-[#c1c8c2] hover:bg-white">Best crop</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setOpen(true)} className="bg-[#1b4332] text-white p-4 rounded-full shadow-lg hover:bg-[#012d1d] flex items-center justify-center">
                    <span className="material-symbols-outlined">smart_toy</span>
                </button>
            )}
        </div>
    );
}
"""

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

write_file(os.path.join(src_dir, 'services/analyticsApi.js'), analytics_api)
write_file(os.path.join(src_dir, 'pages/AdvancedAnalyticsPage.jsx'), advanced_analytics)
write_file(os.path.join(src_dir, 'pages/InventoryInsightsPage.jsx'), inventory_insights)
write_file(os.path.join(src_dir, 'components/Chatbot.jsx'), chatbot_component)
print("Frontend components generated.")
