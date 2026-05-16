import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { Input, Select, Textarea, Btn } from '../components/FormFields';

const STATUS_OPTIONS = ['Scheduled', 'Completed', 'Cancelled'];
const EMPTY = { company: '', position: '', date: '', location: '', contact: '', recruiterName: '', notes: '', status: 'Scheduled' };
const toInput = (d) => d ? new Date(d).toISOString().slice(0, 16) : '';

const fmt = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const isUpcoming = (d) => d && new Date(d) >= new Date();

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/interviews');
      setInterviews(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (i) => { setEditing(i._id); setForm({ ...i, date: toInput(i.date) }); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editing ? await api.put(`/interviews/${editing}`, form) : await api.post('/interviews', form);
      setShowModal(false);
      fetchInterviews();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this interview?')) return;
    await api.delete(`/interviews/${id}`);
    fetchInterviews();
  };

  const upcoming = interviews.filter((i) => isUpcoming(i.date) && i.status === 'Scheduled');
  const past = interviews.filter((i) => !isUpcoming(i.date) || i.status !== 'Scheduled');

  const InterviewCard = ({ interview }) => (
    <div className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${isUpcoming(interview.date) && interview.status === 'Scheduled' ? 'border-indigo-200' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{interview.company}</h3>
          {interview.position && <p className="text-sm text-gray-500">{interview.position}</p>}
        </div>
        <Badge label={interview.status} />
      </div>
      <div className="space-y-1.5 text-sm text-gray-600">
        <p>📅 {fmt(interview.date)}</p>
        {interview.location && <p>📍 {interview.location}</p>}
        {interview.recruiterName && <p>👤 {interview.recruiterName}</p>}
        {interview.contact && <p>📞 {interview.contact}</p>}
        {interview.notes && <p className="text-gray-400 italic text-xs mt-2 line-clamp-2">{interview.notes}</p>}
      </div>
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button onClick={() => openEdit(interview)} className="flex-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
        <button onClick={() => handleDelete(interview._id)} className="flex-1 text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Interviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">{upcoming.length} upcoming</p>
        </div>
        <Btn onClick={openAdd}>+ Schedule Interview</Btn>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
      ) : interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
          <span className="text-5xl mb-3">📅</span>
          <p className="font-medium">No interviews scheduled</p>
          <p className="text-sm mt-1">Schedule your first interview</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Upcoming</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((i) => <InterviewCard key={i._id} interview={i} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Past / Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {past.map((i) => <InterviewCard key={i._id} interview={i} />)}
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Interview' : 'Schedule Interview'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Company *" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <Input label="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Date & Time *" type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Online / Office" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Recruiter Name" value={form.recruiterName} onChange={(e) => setForm({ ...form, recruiterName: e.target.value })} />
              <Input label="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            </div>
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))} />
            <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="flex gap-3 pt-2">
              <Btn type="submit" disabled={saving} className="flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Schedule'}</Btn>
              <Btn type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
