import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full py-20 border-t border-stone-900 bg-stone-950 relative z-20">
      <div className="flex flex-col gap-12 w-full px-8 max-w-screen-2xl mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif italic text-orange-200">Veloura Café</h3>
            <p className="text-stone-500 text-sm font-light leading-relaxed max-w-xs">
              A sensory sanctuary where high culinary craftsmanship meets contemporary architectural minimalism.
            </p>
          </div>

          {/* Col 2: Gallery Address & Contact */}
          <div className="space-y-3">
            <h4 className="text-stone-300 text-xs font-bold uppercase tracking-widest">The Gallery</h4>
            <div className="text-stone-500 text-sm font-light space-y-1.5">
              <p>124 Serenity Lane, Central District</p>
              <p>Phone: +1 (555) 019-2834</p>
              <p>Email: concierge@velouracafe.com</p>
            </div>
          </div>

          {/* Col 3: Salon Hours */}
          <div className="space-y-3">
            <h4 className="text-stone-300 text-xs font-bold uppercase tracking-widest">Opening Hours</h4>
            <div className="text-stone-500 text-sm font-light space-y-1.5">
              <p>Mon – Fri: 8:00 AM – 11:00 PM</p>
              <p>Sat – Sun: 8:00 AM – 11:00 PM</p>
              <p className="text-orange-200/60">Holiday hours may vary</p>
            </div>
          </div>

          {/* Col 4: Links & Social */}
          <div className="space-y-3">
            <h4 className="text-stone-300 text-xs font-bold uppercase tracking-widest">Connect</h4>
            <div className="flex gap-4">
              {[
                { name: 'Instagram', icon: 'camera_indoor', link: 'https://instagram.com/velouracafe' },
                { name: 'Facebook', icon: 'co_present', link: 'https://facebook.com/velouracafe' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-stone-900 flex items-center justify-center text-stone-500 hover:text-orange-200 hover:border-orange-200/30 transition-all"
                  aria-label={social.name}
                >
                  <span className="material-symbols-outlined text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-900/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-600">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase">
            © 2026 Veloura Café. Crafted for the senses.
          </p>
          <div className="flex gap-8 text-[10px] tracking-[0.2em] uppercase font-bold">
            <a href="#" className="hover:text-stone-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-stone-400 transition-colors">Sustainability</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;