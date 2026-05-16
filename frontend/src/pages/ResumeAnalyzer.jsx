import { useState, useRef } from 'react';
import api from '../services/api';
import { Btn } from '../components/FormFields';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(f.type)) { setError('Only PDF or Word files allowed'); return; }
    if (f.size > 5 * 1024 * 1024) { setError('File must be under 5MB'); return; }
    setFile(f);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (!file || !jobDesc.trim()) { setError('Please upload a resume and enter a job description'); return; }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDesc);
      const { data } = await api.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 55) return 'text-yellow-500';
    return 'text-red-500';
  };

  const scoreBg = (score) => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 55) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resume Analyzer</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload your resume and paste a job description to get AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upload */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">1. Upload Resume</h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragging ? 'border-indigo-400 bg-indigo-50' : file ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])} />
            {file ? (
              <>
                <span className="text-3xl">✅</span>
                <p className="font-medium text-emerald-700 mt-2">{file.name}</p>
                <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs text-red-400 hover:text-red-600 mt-2">Remove</button>
              </>
            ) : (
              <>
                <span className="text-3xl">📄</span>
                <p className="font-medium text-gray-600 mt-2">Drop your resume here</p>
                <p className="text-xs text-gray-400 mt-1">PDF or Word · Max 5MB</p>
              </>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">2. Paste Job Description</h2>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{jobDesc.length} characters</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      <Btn onClick={handleAnalyze} disabled={loading || !file || !jobDesc.trim()} className="w-full py-3 text-base">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Analyzing...
          </span>
        ) : '🤖 Analyze Resume'}
      </Btn>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-5">
          {/* Score */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Match Score</p>
            <p className={`text-6xl font-bold ${scoreColor(result.matchScore)}`}>{result.matchScore}%</p>
            <div className="w-full bg-gray-100 rounded-full h-3 mt-4">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${scoreBg(result.matchScore)}`}
                style={{ width: `${result.matchScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {result.matchScore >= 75 ? 'Great match! Apply with confidence.' : result.matchScore >= 55 ? 'Decent match. Some improvements recommended.' : 'Low match. Consider tailoring your resume.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Strengths */}
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
              <h3 className="font-semibold text-emerald-700 mb-3">✅ Strengths</h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-800 flex gap-2"><span>•</span>{s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-5">
              <h3 className="font-semibold text-red-700 mb-3">⚠️ Weaknesses</h3>
              <ul className="space-y-2">
                {result.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-red-800 flex gap-2"><span>•</span>{w}</li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-5">
              <h3 className="font-semibold text-indigo-700 mb-3">💡 Suggestions</h3>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-indigo-800 flex gap-2"><span>•</span>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button onClick={() => { setResult(null); setFile(null); setJobDesc(''); }} className="text-sm text-gray-400 hover:text-gray-600">
              Analyze another resume →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
