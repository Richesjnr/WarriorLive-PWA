import React from 'react';
import { Video, Calendar as CalendarIcon, UserPlus, Clock, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function TelehealthView() {
  const doctors = [
    { name: 'Dr. Sarah Okafor', spec: 'Hematologist (SCD Specialist)', rating: 4.9, nextAvail: 'Tomorrow, 10:00 AM' },
    { name: 'Dr. Michael Chen', spec: 'Pain Management Specialist', rating: 4.8, nextAvail: 'Thursday, 2:30 PM' },
    { name: 'Dr. Amina Bello', spec: 'Pediatric Hematologist', rating: 5.0, nextAvail: 'Friday, 9:00 AM' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <header className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h2 className="text-2xl font-bold font-sans text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Video className="h-6 w-6 text-indigo-500" />
          Telehealth Gateway
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Connect directly with our network of SCD-specialist hematologists and general practitioners.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">Available Specialists</h3>
          <div className="space-y-4">
            {doctors.map((doc, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.01 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-indigo-300 dark:hover:border-indigo-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    {doc.name.charAt(4)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{doc.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{doc.spec}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-slate-500">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {doc.rating}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doc.nextAvail}</span>
                    </div>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm whitespace-nowrap cursor-pointer">
                  Book Consult
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-2">
              <Video className="w-5 h-5" /> Upcoming Consult
            </h4>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mt-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Routine HbF Review</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dr. Sarah Okafor</p>
              <div className="flex items-center gap-2 mt-3 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                <CalendarIcon className="w-4 h-4" /> Today, 4:00 PM
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Video className="w-4 h-4" /> Join Call
              </motion.button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 text-slate-400">
              <UserPlus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Need a second opinion?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4 leading-relaxed">
              Upload your Health Passport to match with international hematology experts.
            </p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer">
              Request Match
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
