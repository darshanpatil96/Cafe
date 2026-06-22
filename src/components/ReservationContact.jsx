import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReservationContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    requests: '',
  });
  
  const [booked, setBooked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        guests: '2',
        requests: '',
      });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClasses = "w-full bg-stone-900/60 border border-stone-800 focus:border-orange-200/50 rounded-xl px-4 py-3 text-stone-200 text-sm placeholder:text-stone-600 focus:outline-none focus:bg-stone-900 transition-all font-light";

  return (
    <section className="py-32 bg-stone-950 text-stone-100 border-t border-stone-900/30 relative">
      <div className="container mx-auto px-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Reservation Form */}
          <motion.div 
            id="reserve"
            className="lg:col-span-7 bg-stone-900/20 border border-stone-900/60 rounded-3xl p-8 md:p-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-label text-[10px] tracking-[0.25em] uppercase text-orange-200 block mb-3 font-bold">
              Private Booking
            </span>
            <h2 className="font-headline text-3xl md:text-4xl text-stone-100 mb-8 italic font-light">
              Reserve a Table
            </h2>

            <AnimatePresence mode="wait">
              {!booked ? (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-stone-400 text-xs uppercase tracking-widest mb-2 font-bold">Full Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Aryan Kapoor" 
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-xs uppercase tracking-widest mb-2 font-bold">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="+91 98765 43210" 
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-stone-400 text-xs uppercase tracking-widest mb-2 font-bold">Date</label>
                      <input 
                        type="date" 
                        name="date" 
                        required 
                        value={formData.date} 
                        onChange={handleChange} 
                        className={inputClasses}
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-xs uppercase tracking-widest mb-2 font-bold">Time Slot</label>
                      <input 
                        type="time" 
                        name="time" 
                        required 
                        value={formData.time} 
                        onChange={handleChange} 
                        className={inputClasses}
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 text-xs uppercase tracking-widest mb-2 font-bold">Guests Count</label>
                      <select 
                        name="guests" 
                        value={formData.guests} 
                        onChange={handleChange} 
                        className={inputClasses}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                          <option key={n} value={n} className="bg-stone-900 text-stone-200">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 text-xs uppercase tracking-widest mb-2 font-bold">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      required 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="aryan@example.com" 
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 text-xs uppercase tracking-widest mb-2 font-bold">Special Requests</label>
                    <textarea 
                      name="requests" 
                      rows="3" 
                      value={formData.requests} 
                      onChange={handleChange} 
                      placeholder="e.g. Window table, gluten-free menu options, anniversary celebration" 
                      className={`${inputClasses} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-orange-200 text-stone-950 font-label text-xs font-extrabold tracking-widest uppercase hover:bg-orange-100 transition-all shadow-[0_0_30px_rgba(254,212,136,0.1)] active:scale-[0.99]"
                  >
                    Confirm Booking
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-16 h-16 rounded-full bg-green-950/40 border border-green-500/50 flex items-center justify-center text-green-400 mb-4 animate-bounce">
                    <span className="material-symbols-outlined text-3xl">done</span>
                  </div>
                  <h3 className="font-headline text-2xl text-stone-100">Reservation Requested</h3>
                  <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
                    Thank you, <strong className="text-orange-200">{formData.name}</strong>. A verification details code and SMS confirmation has been dispatched for <strong>{formData.date} at {formData.time}</strong>.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

          {/* Right Column: Contact Details & Store Info */}
          <motion.div 
            id="contact"
            className="lg:col-span-5 space-y-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div>
              <span className="font-label text-[10px] tracking-[0.25em] uppercase text-orange-200 block mb-3 font-bold">
                Get In Touch
              </span>
              <h2 className="font-headline text-3xl md:text-4xl text-stone-100 mb-6 italic font-light">
                Veloura Gallery
              </h2>
              <p className="text-stone-400 text-sm leading-relaxed font-light">
                For corporate events, private catering inquiries, or exclusive roast reserve purchases, please contact our concierge team.
              </p>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-stone-850 flex items-center justify-center text-orange-200/80 shrink-0">
                  <span className="material-symbols-outlined text-lg">location_on</span>
                </div>
                <div>
                  <h4 className="text-stone-300 text-xs font-bold uppercase tracking-wider mb-1">Our Gallery</h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">124 Serenity Lane, Central District</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-stone-850 flex items-center justify-center text-orange-200/80 shrink-0">
                  <span className="material-symbols-outlined text-lg">schedule</span>
                </div>
                <div>
                  <h4 className="text-stone-300 text-xs font-bold uppercase tracking-wider mb-1">Opening Hours</h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">Monday – Sunday: 8:00 AM – 11:00 PM</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-stone-850 flex items-center justify-center text-orange-200/80 shrink-0">
                  <span className="material-symbols-outlined text-lg">phone</span>
                </div>
                <div>
                  <h4 className="text-stone-300 text-xs font-bold uppercase tracking-wider mb-1">Reservation Desk</h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">+1 (555) 019-2834</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full border border-stone-850 flex items-center justify-center text-orange-200/80 shrink-0">
                  <span className="material-symbols-outlined text-lg">mail</span>
                </div>
                <div>
                  <h4 className="text-stone-300 text-xs font-bold uppercase tracking-wider mb-1">Concierge Email</h4>
                  <p className="text-stone-400 text-sm font-light leading-relaxed">concierge@velouracafe.com</p>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="pt-4 flex gap-4">
              {[
                { name: 'Instagram', icon: 'camera_indoor', link: 'https://instagram.com/velouracafe' },
                { name: 'Facebook', icon: 'co_present', link: 'https://facebook.com/velouracafe' }
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2.5 rounded-full border border-stone-850 hover:border-orange-200/40 text-stone-400 hover:text-orange-200 text-[10px] font-bold tracking-widest uppercase transition-all"
                >
                  {s.name}
                </a>
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ReservationContact;
