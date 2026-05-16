import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { Input, Select, Textarea, Btn } from '../components/FormFields';

const RELATIONS = ['HR', 'Recruiter', 'Referral', 'LinkedIn', 'Friend', 'Mentor'];
const EMPTY = { name: '', role: '', contact: '', company: '', relation: 'Recruiter', lastContact: '', followUp: '', notes: '' };
const toInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function People() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPeople = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/people');
      setPeople(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPeople(); }, [fetchPeople]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, lastContact: toInput(p.lastContact), followUp: toInput(p.followUp) });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      editing ? await api.put(`/people/${editing}`, form) : await api.post('/people', form);
      setShowModal(false);
      fetchPeople();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    await api.delete(`/people/${id}`);
    fetchPeople();
  };

  const filtered = people.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">People</h1>
          <p className="text-sm text-gray-500 mt-0.5">{people.length} contacts</p>
        </div>
        <Btn onClick={openAdd}>+ Add Contact</Btn>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl border border-gray-200">
          <span className="text-5xl mb-3">👥</span>
          <p className="font-medium">No contacts yet</p>
          <p className="text-sm mt-1">Add your first professional contact</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{p.name}</h3>
                    {p.role && <p className="text-xs text-gray-500">{p.role}</p>}
                  </div>
                </div>
                <Badge label={p.relation} />
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                {p.company && <p>🏢 {p.company}</p>}
                {p.contact && <p>📞 {p.contact}</p>}
                {p.followUp && <p>📅 Follow up: {fmt(p.followUp)}</p>}
                {p.notes && <p className="text-gray-400 italic text-xs mt-2 line-clamp-2">{p.notes}</p>}
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(p)} className="flex-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="flex-1 text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Contact' : 'Add Contact'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. HR Manager" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <Input label="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Email or phone" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Select label="Relation" value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })}
                options={RELATIONS.map((r) => ({ value: r, label: r }))} />
              <Input label="Last Contact" type="date" value={form.lastContact} onChange={(e) => setForm({ ...form, lastContact: e.target.value })} />
              <Input label="Follow Up" type="date" value={form.followUp} onChange={(e) => setForm({ ...form, followUp: e.target.value })} />
            </div>
            <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="flex gap-3 pt-2">
              <Btn type="submit" disabled={saving} className="flex-1">{saving ? 'Saving...' : editing ? 'Update' : 'Add Contact'}</Btn>
              <Btn type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
