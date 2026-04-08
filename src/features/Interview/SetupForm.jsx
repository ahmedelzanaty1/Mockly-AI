import React, { useState } from 'react';

export default function SetupForm({ onStart }) {
  const [formData, setFormData] = useState({ name: '', jobTitle: '', type: 'Technical', jd: '' });
  const [error, setError] = useState('');

  const validateAndStart = () => {
    if (!formData.name || !formData.jobTitle || !formData.jd) {
      setError('Please fill in all fields so the AI can prepare.');
      return;
    }
    setError('');
    onStart(formData);
  };

  return (
    <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Interview Settings</h2>
      {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
      <div className="space-y-4">
        <input 
          type="text" placeholder="Your Name" 
          className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          type="text" placeholder="Target Job Title" 
          className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 outline-none focus:border-blue-500"
          onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
        />
        <select 
          className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 outline-none"
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="Technical">Technical Interview</option>
          <option value="HR">HR Interview</option>
          <option value="Behavioral">Behavioral Interview</option>
        </select>
        <textarea 
          placeholder="Paste the Job Description here..." 
          className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 h-32 outline-none focus:border-blue-500"
          onChange={(e) => setFormData({...formData, jd: e.target.value})}
        ></textarea>
        <button 
          onClick={validateAndStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-900/20"
        >
          Start AI Interview
        </button>
      </div>
    </div>
  );
}