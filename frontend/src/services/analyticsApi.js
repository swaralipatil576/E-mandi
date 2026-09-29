export const getOverview = async () => {
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
