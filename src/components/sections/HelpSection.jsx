// src/components/sections/HelpSection.jsx
import React, { useState } from 'react';
import { Search, BookOpen, Video, MessageCircle, Mail, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const faqs = [
  { q: 'How does the AI agent work?', a: 'The AI agent analyzes real-time match data, updates qualification probabilities, and automatically rebalances your portfolio to maximize returns.' },
  { q: 'What strategies are available?', a: 'We offer Balanced, Aggressive, and Conservative strategies to match your risk tolerance.' },
  { q: 'How is yield generated?', a: 'Idle capital is deployed to lending protocols on Solana, earning APY while waiting for trading opportunities.' },
  { q: 'Are funds safe?', a: 'All positions are managed through audited smart contracts. You retain full control of your assets.' }
];

export const HelpSection = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState('');
  
  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Help & Support</h2>
        <p className="text-white/40 text-sm mt-1">Documentation and support resources</p>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="text"
          placeholder="Search help articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
        />
      </div>
      
      {/* Quick Links Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Documentation', desc: 'Read the docs', color: 'from-cyan-500 to-blue-500' },
          { icon: Video, label: 'Video Tutorials', desc: 'Watch guides', color: 'from-purple-500 to-pink-500' },
          { icon: MessageCircle, label: 'Live Chat', desc: '24/7 support', color: 'from-emerald-500 to-teal-500' },
          { icon: Mail, label: 'Email Support', desc: 'Get in touch', color: 'from-orange-500 to-red-500' }
        ].map((item) => (
          <button key={item.label} className="bg-white/5 rounded-2xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all group">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-white font-medium">{item.label}</div>
            <div className="text-xs text-white/30 mt-1">{item.desc}</div>
          </button>
        ))}
      </div>
      
      {/* FAQ Section */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
        <h3 className="text-white font-medium mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="border-b border-white/10 last:border-0">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="text-white font-medium">{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-white/40" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-white/40" />
                )}
              </button>
              {openFaq === idx && (
                <div className="pb-4 text-white/40 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Contact Support */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/20 p-6 text-center">
        <p className="text-white/60 mb-3">Still need help?</p>
        <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium inline-flex items-center gap-2">
          Contact Support
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};