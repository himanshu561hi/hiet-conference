import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, User, FileText, CheckCircle, ChevronRight, 
  ChevronLeft, Plus, Trash2, UploadCloud, Loader2, 
  Eye, EyeOff, X, AlertCircle
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { tracks } from '../data/tracks';

const STEPS = [
  { id: 1, label: 'Team Info', icon: Users },
  { id: 2, label: 'Leader', icon: User },
  { id: 3, label: 'Members', icon: Users },
  { id: 4, label: 'Paper', icon: FileText },
  { id: 5, label: 'Review', icon: CheckCircle },
];

const InputField = ({ label, type = 'text', value, onChange, placeholder, required, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition ${error ? 'border-red-400' : 'border-gray-200'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, options, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
    >
      <option value="">Select...</option>
      {options.map(o => (
        <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
      ))}
    </select>
  </div>
);

const emptyMember = () => ({ name: '', email: '', mobile: '', branch: '', year: '' });

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null); // holds response on success

  // Form State
  const [teamInfo, setTeamInfo] = useState({ teamName: '', institute: 'HIET, Ghaziabad', conferenceTrack: '' });
  const [leader, setLeader] = useState({ name: '', email: '', mobile: '', branch: '', year: '' });
  const [members, setMembers] = useState([]);
  const [paper, setPaper] = useState({
    title: '', abstract: '', paperCategory: '', presentationPreference: '',
    keywords: '', file: null
  });
  const [errors, setErrors] = useState({});

  // ── Validation ──────────────────────────────────────────────────────────

  const validate = (s) => {
    const errs = {};
    if (s === 1) {
      if (!teamInfo.teamName.trim()) errs.teamName = 'Team name is required';
      if (!teamInfo.institute.trim()) errs.institute = 'Institute is required';
      if (!teamInfo.conferenceTrack) errs.conferenceTrack = 'Please select a track';
    }
    if (s === 2) {
      if (!leader.name.trim()) errs.leaderName = 'Name is required';
      if (!leader.email.trim() || !/\S+@\S+\.\S+/.test(leader.email)) errs.leaderEmail = 'Valid email required';
      if (!leader.mobile.trim() || leader.mobile.replace(/\D/g,'').length < 10) errs.leaderMobile = 'Valid 10-digit mobile required';
      if (!leader.branch.trim()) errs.leaderBranch = 'Branch is required';
      if (!leader.year) errs.leaderYear = 'Year is required';
    }
    if (s === 3) {
      members.forEach((m, i) => {
        if (!m.name.trim()) errs[`member_${i}_name`] = 'Name required';
        if (!m.email.trim() || !/\S+@\S+\.\S+/.test(m.email)) errs[`member_${i}_email`] = 'Valid email required';
        if (!m.mobile.trim() || m.mobile.replace(/\D/g,'').length < 10) errs[`member_${i}_mobile`] = 'Valid mobile required';
        if (!m.branch.trim()) errs[`member_${i}_branch`] = 'Branch required';
      });
    }
    if (s === 4) {
      if (!paper.title.trim()) errs.paperTitle = 'Paper title is required';
      if (!paper.abstract.trim()) errs.paperAbstract = 'Abstract is required';
      if (!paper.file) errs.paperFile = 'PDF upload is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate(step)) setStep(s => s + 1);
  };
  const handleBack = () => setStep(s => s - 1);

  // ── Submission ──────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('teamName', teamInfo.teamName);
      formData.append('institute', teamInfo.institute);
      formData.append('conferenceTrack', teamInfo.conferenceTrack);
      formData.append('leaderName', leader.name);
      formData.append('leaderEmail', leader.email);
      formData.append('leaderMobile', leader.mobile);
      formData.append('leaderBranch', leader.branch);
      formData.append('leaderYear', leader.year);
      formData.append('members', JSON.stringify(members));
      formData.append('paperTitle', paper.title);
      formData.append('paperAbstract', paper.abstract);
      formData.append('paperCategory', paper.paperCategory);
      formData.append('presentationPreference', paper.presentationPreference);
      formData.append('keywords', JSON.stringify(paper.keywords.split(',').map(k => k.trim()).filter(Boolean)));
      if (paper.file) formData.append('paper', paper.file);

      const res = await api.post('/v1/public/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.data?.user) {
        login(res.data.data.user);
      }
      setSuccess(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success Screen ──────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-600 w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful! 🎉</h1>
          <p className="text-gray-500 mb-6">Your team <strong>{success.team?.teamName}</strong> has been registered for NEXUS 2026.</p>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-left mb-6">
            <p className="font-semibold text-emerald-800 mb-3">🔐 Your Login Credentials</p>
            <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Email:</span> {success.loginEmail}</p>
            <p className="text-sm text-gray-700"><span className="font-medium">Password:</span> <code className="bg-white border px-2 py-1 rounded text-emerald-700">{success.loginPassword}</code></p>
          </div>

          <p className="text-sm text-gray-500 mb-6">Confirmation emails have been sent to the leader and all team members. You are now logged in!</p>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // ── Step Renderers ──────────────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-5">
      <InputField label="Team Name" value={teamInfo.teamName} onChange={e => setTeamInfo({...teamInfo, teamName: e.target.value})}
        placeholder="e.g. Code Warriors" required error={errors.teamName} />
      <InputField label="Institute / College" value={teamInfo.institute} onChange={e => setTeamInfo({...teamInfo, institute: e.target.value})}
        placeholder="e.g. HIET, Ghaziabad" required error={errors.institute} />
      <SelectField label="Conference Track" value={teamInfo.conferenceTrack}
        onChange={e => setTeamInfo({...teamInfo, conferenceTrack: e.target.value})}
        options={tracks.map(t => ({ value: t.name, label: t.name }))} required />
      {errors.conferenceTrack && <p className="text-red-500 text-xs -mt-3">{errors.conferenceTrack}</p>}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-800">
        👑 You are the Team Leader. Your details will be used as the Corresponding Author.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Full Name" value={leader.name} onChange={e => setLeader({...leader, name: e.target.value})} placeholder="Himanshu Gupta" required error={errors.leaderName} />
        <InputField label="Email" type="email" value={leader.email} onChange={e => setLeader({...leader, email: e.target.value})} placeholder="you@email.com" required error={errors.leaderEmail} />
        <InputField label="Mobile Number" value={leader.mobile} onChange={e => setLeader({...leader, mobile: e.target.value})} placeholder="10-digit mobile" required error={errors.leaderMobile} />
        <InputField label="Branch" value={leader.branch} onChange={e => setLeader({...leader, branch: e.target.value})} placeholder="e.g. CSE, IT, ECE" required error={errors.leaderBranch} />
        <SelectField label="Year" value={leader.year} onChange={e => setLeader({...leader, year: e.target.value})}
          options={['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG/Other']} required />
        {errors.leaderYear && <p className="text-red-500 text-xs -mt-3">{errors.leaderYear}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        ℹ️ Add up to 2 more team members. Leave empty for solo participation.
      </div>
      {members.map((m, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-5 relative">
          <button onClick={() => setMembers(ms => ms.filter((_, idx) => idx !== i))}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition">
            <X size={16} />
          </button>
          <p className="font-semibold text-gray-700 mb-4">Member {i + 1}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Full Name" value={m.name} onChange={e => setMembers(ms => ms.map((x, idx) => idx===i ? {...x, name: e.target.value} : x))} placeholder="Member Name" required error={errors[`member_${i}_name`]} />
            <InputField label="Email" type="email" value={m.email} onChange={e => setMembers(ms => ms.map((x, idx) => idx===i ? {...x, email: e.target.value} : x))} placeholder="member@email.com" required error={errors[`member_${i}_email`]} />
            <InputField label="Mobile" value={m.mobile} onChange={e => setMembers(ms => ms.map((x, idx) => idx===i ? {...x, mobile: e.target.value} : x))} placeholder="10-digit mobile" required error={errors[`member_${i}_mobile`]} />
            <InputField label="Branch" value={m.branch} onChange={e => setMembers(ms => ms.map((x, idx) => idx===i ? {...x, branch: e.target.value} : x))} placeholder="e.g. CSE" error={errors[`member_${i}_branch`]} />
            <SelectField label="Year" value={m.year} onChange={e => setMembers(ms => ms.map((x, idx) => idx===i ? {...x, year: e.target.value} : x))}
              options={['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG/Other']} />
          </div>
        </div>
      ))}

      {members.length < 2 && (
        <button onClick={() => setMembers(ms => [...ms, emptyMember()])}
          className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 py-4 rounded-xl hover:bg-emerald-50 transition flex items-center justify-center gap-2 font-medium">
          <Plus size={18} /> Add Team Member
        </button>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <InputField label="Paper Title" value={paper.title} onChange={e => setPaper({...paper, title: e.target.value})} placeholder="Enter your research paper title" required error={errors.paperTitle} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Abstract <span className="text-red-500">*</span></label>
        <textarea value={paper.abstract} onChange={e => setPaper({...paper, abstract: e.target.value})}
          rows={5} placeholder="Provide a brief abstract of your research (150-300 words)"
          className={`w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none ${errors.paperAbstract ? 'border-red-400' : 'border-gray-200'}`} />
        {errors.paperAbstract && <p className="text-red-500 text-xs mt-1">{errors.paperAbstract}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="Paper Category" value={paper.paperCategory}
          onChange={e => setPaper({...paper, paperCategory: e.target.value})}
          options={['Research Paper', 'Review Paper', 'Case Study']} />
        <SelectField label="Presentation Preference" value={paper.presentationPreference}
          onChange={e => setPaper({...paper, presentationPreference: e.target.value})}
          options={[{ value: 'Oral', label: 'Oral Presentation' }, { value: 'Poster', label: 'Poster Presentation' }, { value: 'Virtual', label: 'Virtual Presentation' }]} />
      </div>
      <InputField label="Keywords (comma-separated)" value={paper.keywords} onChange={e => setPaper({...paper, keywords: e.target.value})} placeholder="AI, Machine Learning, IoT" />
      
      {/* PDF Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Paper (PDF) <span className="text-red-500">*</span></label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${paper.file ? 'border-emerald-400 bg-emerald-50' : errors.paperFile ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'}`}
        >
          {paper.file ? (
            <div>
              <CheckCircle className="text-emerald-500 w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold text-emerald-700">{paper.file.name}</p>
              <p className="text-sm text-emerald-600">{(paper.file.size / 1024 / 1024).toFixed(2)} MB</p>
              <button onClick={e => { e.stopPropagation(); setPaper({...paper, file: null}); }} className="text-xs text-red-500 mt-2 hover:underline">Remove</button>
            </div>
          ) : (
            <div>
              <UploadCloud className="text-gray-400 w-10 h-10 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Click or drag PDF here</p>
              <p className="text-xs text-gray-400 mt-1">PDF only, max 10MB</p>
            </div>
          )}
        </div>
        {errors.paperFile && <p className="text-red-500 text-xs mt-1">{errors.paperFile}</p>}
        <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
          onChange={e => { const f = e.target.files[0]; if (f) setPaper({...paper, file: f}); }} />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-5">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-3">📋 Team Information</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium text-gray-800">Team Name:</span> {teamInfo.teamName}</p>
          <p><span className="font-medium text-gray-800">Institute:</span> {teamInfo.institute}</p>
          <p><span className="font-medium text-gray-800">Track:</span> {teamInfo.conferenceTrack}</p>
        </div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-3">👑 Leader</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium text-gray-800">Name:</span> {leader.name}</p>
          <p><span className="font-medium text-gray-800">Email:</span> {leader.email}</p>
          <p><span className="font-medium text-gray-800">Mobile:</span> {leader.mobile}</p>
          <p><span className="font-medium text-gray-800">Branch:</span> {leader.branch} — {leader.year}</p>
        </div>
      </div>
      {members.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-900 mb-3">👥 Members ({members.length})</h3>
          {members.map((m, i) => (
            <div key={i} className="text-sm text-gray-600 mb-2">
              <p><span className="font-medium text-gray-800">Member {i+1}:</span> {m.name} ({m.email})</p>
            </div>
          ))}
        </div>
      )}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-900 mb-3">📄 Paper</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p><span className="font-medium text-gray-800">Title:</span> {paper.title}</p>
          <p><span className="font-medium text-gray-800">Category:</span> {paper.paperCategory || 'Not selected'}</p>
          <p><span className="font-medium text-gray-800">File:</span> {paper.file?.name || 'Not uploaded'}</p>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        ⚠️ By submitting, you confirm all details are correct. Confirmation emails will be sent to all team members.
      </div>
    </div>
  );

  const stepContent = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-gray-900">NEXUS <span className="text-emerald-500">2026</span></span>
          </div>
          <a href="/auth/login" className="text-sm text-emerald-600 hover:underline">Already registered? Login →</a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conference Registration</h1>
          <p className="text-gray-500">Fill in your team and paper details to register for NEXUS 2026</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          {STEPS.map(s => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-emerald-500 border-emerald-500 text-white' : active ? 'bg-white border-emerald-500 text-emerald-600' : 'bg-white border-gray-300 text-gray-400'}`}>
                  {done ? <CheckCircle size={18} /> : <Icon size={18} />}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${active ? 'text-emerald-600' : done ? 'text-emerald-500' : 'text-gray-400'}`}>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Step {step}: {STEPS[step - 1].label}
          </h2>

          {stepContent[step - 1]()}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium"
            >
              <ChevronLeft size={18} /> Back
            </button>

            {step < STEPS.length ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-semibold"
              >
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition font-semibold"
              >
                {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <>Submit Registration <CheckCircle size={18} /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
