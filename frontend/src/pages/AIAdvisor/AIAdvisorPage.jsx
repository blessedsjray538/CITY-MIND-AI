import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  ArrowRight,
  Terminal,
  Layers,
  HelpCircle
} from 'lucide-react';
import { askAIChat } from '../../services/api';

export default function AIAdvisorPage() {
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      role: 'assistant',
      text: "Welcome to the **CITYMIND AI Central Advisor Terminal**.\n\nI operate as a tool-augmented multi-department intelligence engine for Bhubaneswar. I synthesize real-time data across the Jaydev Vihar corridor with official meteorological archives and municipal databases.\n\nSelect a recommended inquiry below or input a custom scenario.",
      classification: 'LIVE_SIMULATION',
      source: 'CITYMIND Central Neural Hub'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "How could heavy rainfall affect traffic and waste management in Bhubaneswar?",
    "Tell me about the 1999 Odisha Super Cyclone and its wind speed",
    "What will happen if the Jaydev Vihar flyover is closed during peak hours?",
    "Where are the currently reported waste accumulation areas in the corridor?",
    "What precautions should be taken if a Bay of Bengal storm intensifies?"
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || query;
    if (!text.trim() || loading) return;

    const newChat = [...chatLog, { role: 'user', text }];
    setChatLog(newChat);
    setQuery('');
    setLoading(true);

    try {
      const resp = await askAIChat(text, "Central AI Terminal");
      setChatLog([...newChat, {
        role: 'assistant',
        text: resp.answer,
        classification: resp.data_classification,
        source: resp.source,
        subsystem: resp.subsystem_used,
        suggested_actions: resp.suggested_actions
      }]);
    } catch (err) {
      setChatLog([...newChat, {
        role: 'assistant',
        text: "Error contacting neural subsystem. Please retry.",
        classification: 'AI_ESTIMATE',
        source: 'Error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 mb-1">
            <Cpu className="w-4 h-4" />
            <span>NEURAL ORCHESTRATION // CENTRAL CITY ANALYST</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            CITYMIND AI CENTRAL ADVISOR
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Tool-augmented reasoning engine connecting traffic simulations, Open-Meteo feeds, and OSDMA disaster archives.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-800 text-purple-300">
            Tool Calling: ACTIVE
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            Zero Hallucination Rule
          </span>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* Terminal Chat Window (3 cols) */}
        <div className="lg:col-span-3 glass-panel rounded-2xl flex flex-col h-[460px] sm:h-[520px] md:h-[600px] border border-purple-500/30 overflow-hidden font-mono text-xs">
          
          {/* Terminal Title Bar */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-400">
              <Terminal className="w-4 h-4" />
              <span className="font-bold">CITYMIND_ANALYST_CONSOLE // BHUBANESWAR</span>
            </div>
            <span className="text-[10px] text-slate-500">v1.0 (Hackathon Edition)</span>
          </div>

          {/* Messages History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatLog.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`max-w-[85%] p-4 rounded-xl leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none' 
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-slate-800 text-[10px]">
                      <span className="text-purple-400 font-bold uppercase">
                        {msg.classification || "AI ESTIMATE"}
                      </span>
                      {msg.source && <span className="text-slate-500">• {msg.source}</span>}
                    </div>
                  )}
                  <div className="whitespace-pre-line text-[11px] leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="p-3 rounded-lg bg-slate-900 text-purple-400 flex items-center space-x-2 max-w-xs">
                <Cpu className="w-4 h-4 animate-spin text-purple-400" />
                <span>Orchestrating departmental tools...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a multi-department question (e.g. rain impact on traffic, 1999 cyclone, waste)..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
              <button
                type="submit"
                disabled={!query.trim() || loading}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Subsystem Tools & Sample Prompts */}
        <div className="space-y-4 font-mono text-xs">
          
          {/* Subsystems Connected Card */}
          <div className="glass-panel p-4">
            <div className="flex items-center space-x-2 text-purple-400 font-bold mb-3 pb-2 border-b border-slate-800">
              <Database className="w-4 h-4" />
              <span>SUBSYSTEM TOOL ARRAY</span>
            </div>
            <div className="space-y-2">
              {[
                { name: "Traffic Flow Engine", status: "A* Routing Synced", color: "text-amber-400" },
                { name: "Weather Service", status: "Open-Meteo Synced", color: "text-blue-400" },
                { name: "Disaster Knowledge", status: "1999 / IMD / OSDMA", color: "text-rose-400" },
                { name: "Waste Management", status: "Red/Green Workflow", color: "text-emerald-400" },
                { name: "Environmental Grid", status: "CPCB Station Feeds", color: "text-cyan-400" }
              ].map((sub, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{sub.name}</span>
                  <span className={`text-[9px] ${sub.color}`}>{sub.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Scenario Triggers */}
          <div className="glass-panel p-4">
            <div className="flex items-center space-x-2 text-purple-400 font-bold mb-3 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4" />
              <span>TEST BENCHMARK PROMPTS</span>
            </div>
            <div className="space-y-2">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-2 rounded-lg bg-slate-900/70 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-colors text-[11px] leading-snug cursor-pointer flex items-center justify-between"
                >
                  <span className="truncate mr-2">{q}</span>
                  <ArrowRight className="w-3 h-3 text-purple-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
