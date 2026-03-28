import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const footerLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Careers', href: '#' }
  ];

  const socialLinks = [
    { name: 'Website', icon: 'public' },
    { name: 'Instagram', icon: 'camera' }
  ];

  return (
    <footer className="w-full py-20 border-t border-stone-800/50 bg-stone-900">
      <div className="flex flex-col items-center gap-8 w-full px-8 max-w-screen-2xl mx-auto">
        <motion.div 
          className="text-lg font-serif italic text-orange-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Aura Cafe
        </motion.div>
        
        <motion.nav 
          className="flex flex-wrap justify-center gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {footerLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="text-stone-500 hover:text-stone-200 transition-colors duration-300 font-sans text-xs tracking-[0.2em] uppercase"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              {link.name}
            </motion.a>
          ))}
        </motion.nav>
        
        <motion.div 
          className="flex gap-6 mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href="#"
              className="w-10 h-10 rounded-full border border-stone-800 flex items-center justify-center text-stone-500 hover:text-orange-200 hover:border-orange-200/30 transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <span className="material-symbols-outlined text-lg">{social.icon}</span>
            </motion.a>
          ))}
        </motion.div>
        
        <motion.p 
          className="font-sans text-xs tracking-[0.2em] uppercase text-stone-600 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          © 2024 Aura Cafe. Crafted for the senses.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;