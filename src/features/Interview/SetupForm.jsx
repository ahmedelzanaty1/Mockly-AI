import React, { useState } from 'react';

export default function SetupForm({ onStart }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    jobTitle: '', 
    type: 'Technical', 
    jd: '' 
  });
  const [error, setError] = useState('');

  const validateAndStart = () => {
    if (!formData.name.trim() || !formData.jobTitle.trim() || !formData.jd.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    // إرسال البيانات للأب (App.js)
    onStart(formData);
  };

  return (
    <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl border border-gray-800">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Interview Settings</h2>
      {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
      
      <div className="space-y-4">
        <input 
          type="text" placeholder="Your Name" 
          className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none focus:border-blue-500 border border-transparent"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <input 
          type="text" placeholder="Job Title" 
          className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none focus:border-blue-500 border border-transparent"
          value={formData.jobTitle}
          onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
        />
        <select 
          className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none"
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
        >
          <option value="Technical">Technical</option>
          <option value="HR">HR</option>
          <option value="Behavioral">Behavioral</option>
        </select>
        <textarea 
          placeholder="Paste Job Description..." 
          className="w-full bg-gray-800 text-white p-3 rounded-lg h-32 outline-none focus:border-blue-500 border border-transparent"
          value={formData.jd}
          onChange={(e) => setFormData({...formData, jd: e.target.value})}
        ></textarea>
        
        <button 
          onClick={validateAndStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}