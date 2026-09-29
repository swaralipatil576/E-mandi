import { useState } from 'react';
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
