/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Appointment } from '../types';
import { Calendar, Plus, Clock, MapPin, Trash2, CalendarDays, ClipboardCheck } from 'lucide-react';

interface CalendarViewProps {
  appointments: Appointment[];
  onAddAppointment: (appt: Appointment) => void;
  onDeleteAppointment: (id: string) => void;
}

export default function CalendarView({ appointments, onAddAppointment, onDeleteAppointment }: CalendarViewProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [facility, setFacility] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !facility) return;

    const newAppt: Appointment = {
      id: Date.now().toString(),
      title,
      date,
      time,
      facility,
      purpose: purpose || 'General Medical Consultation',
    };

    onAddAppointment(newAppt);
    setTitle('');
    setDate('');
    setTime('');
    setFacility('');
    setPurpose('');
    setShowAddForm(false);
  };

  // Pre-fill suggestions for clinical relevance
  const fillScdPreset = (presetType: string) => {
    switch (presetType) {
      case 'tcd':
        setTitle('Transcranial Doppler (TCD) Ultrasound');
        setFacility('Sickle Cell Comprehensive Clinic');
        setPurpose('Annual screening required to monitor intracranial velocities and prevent childhood stroke risk.');
        break;
      case 'retina':
        setTitle('Proliferative Sickle Retinopathy Screening');
        setFacility('Specialized Retinal Laser Clinic');
        setPurpose('Critical retinopathy checkup highly recommended for HbSC variants to prevent retinal detachment.');
        break;
      case 'hbf':
        setTitle('Fetal Hemoglobin (HbF) Response Review');
        setFacility('Hematology Research Day Unit');
        setPurpose('Adherence audit and dosage monitoring of Hydroxyurea treatment efficacy.');
        break;
    }
  };

  return (
    <div className="space-y-6" id="calendar_view_section">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="font-sans font-bold text-2xl text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Medical Calendar
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Log and coordinate appointments with comprehensive care centers, day units, and specialist providers.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-indigo-100 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Cancel' : 'Schedule Appointment'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4 shadow-sm animate-fade-in">
          <h3 className="font-sans font-semibold text-sm text-slate-800 dark:text-slate-200">Add New SCD Specialized Appointment</h3>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 dark:text-slate-500">Presets:</span>
            <button
              type="button"
              onClick={() => fillScdPreset('tcd')}
              className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 border border-indigo-100 dark:border-indigo-800/50 px-2.5 py-1 rounded text-indigo-700 dark:text-indigo-400 cursor-pointer font-medium"
            >
              STOP Stroke Screening (TCD)
            </button>
            <button
              type="button"
              onClick={() => fillScdPreset('retina')}
              className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 border border-indigo-100 dark:border-indigo-800/50 px-2.5 py-1 rounded text-indigo-700 dark:text-indigo-400 cursor-pointer font-medium"
            >
              Retinopathy Screening (HbSC Variant)
            </button>
            <button
              type="button"
              onClick={() => fillScdPreset('hbf')}
              className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 border border-indigo-100 dark:border-indigo-800/50 px-2.5 py-1 rounded text-indigo-700 dark:text-indigo-400 cursor-pointer font-medium"
            >
              Fetal Hb (HbF) Evaluation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Appointment Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Annual Hematology Check"
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 dark:text-slate-100 font-medium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">SCD Facility / Hospital</label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                placeholder="e.g., Sickle Cell Comprehensive Care Center"
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 dark:text-slate-100 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 dark:text-slate-100 font-medium font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g., 10:30 AM"
                className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 dark:text-slate-100 font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Clinical Purpose / Notes</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Describe clinical rationale, medication logs (such as Hydroxyurea dosing) or baseline questions."
              className="w-full px-3 py-2 bg-slate-50/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs h-20 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-indigo-100 hover:shadow-md"
          >
            Confirm and Add to Timeline
          </button>
        </form>
      )}

      {/* Appointment Listings */}
      {appointments.length === 0 ? (
        <div className="bg-slate-50/50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
          <CalendarDays className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="font-sans font-semibold text-slate-800 dark:text-slate-300 text-sm">No Appointments Logged</h3>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 max-w-sm mx-auto">
            You currently have no scheduled appointments. Keeping regular visits with a hematologist is essential for SCD maintenance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-wrap items-start justify-between gap-4 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-2 flex-1 min-w-[250px]">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md text-indigo-600 dark:text-indigo-400">
                    <ClipboardCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="font-sans font-bold text-slate-800 dark:text-slate-200 text-base leading-tight">
                      {appt.title}
                    </h4>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-0.5">
                      SCD Specialized Consultation
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{appt.date} at {appt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                    <span className="truncate">{appt.facility}</span>
                  </div>
                </div>

                {appt.purpose && (
                  <div className="mt-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                    <strong className="text-slate-700 dark:text-slate-200 font-semibold">Purpose: </strong>
                    {appt.purpose}
                  </div>
                )}
              </div>

              <button
                onClick={() => onDeleteAppointment(appt.id)}
                className="p-1.5 border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/50 hover:border-red-200 dark:hover:border-red-800/50 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-colors cursor-pointer self-start"
                title="Remove Appointment"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
