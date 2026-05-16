import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { Input, Select, Textarea, Btn } from '../components/FormFields';

const STATUS_OPTIONS = ['Applied', 'Round1', 'Round2', 'Round3', 'Selected', 'Rejected', 'Dropped'];
const TYPE_OPTIONS = ['Applied', 'Dropped', 'Interview', 'Offer'];

const EMPTY_FORM = {
  position: '', company: '', type: 'Applied', location: '', salaryRange: '',
  status: 'Applied', deadline: '', dateApplied: '', followUpDate: '',
  recruiterName: '', recruiterContact: '', notes: '',
};

const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const toInput = (d) => d ? new Date(d).toISOString().split('T')[0] : '';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);
      if (filters.type) params.set('type', filters.type);
      const { data } = await api.get(`/jobs?${params}`);
      setJobs(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (job) => {
    setEditing(job._id);
    setForm({
      ...job,
      deadline: toInput(job.deadline),
      dateApplied: toInput(job.dateApplied),
      followUpDate: toInput(job.followUpDate),
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/jobs/${editing}`, form);
      } else {
        await api.post('/jobs', form);
      }
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    await api.delete(`/jobs/${id}`);
    fetchJobs();
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} jobs?`)) return;
    await Promise.all([...selected].map((id) => api.delete(`/jobs/${id}`)));
    setSelected(new Set());
    fetchJobs();
  };

  const toggleSelect = (id) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const toggleAll = (e) => setSelected(e.target.checked ? new Set(jobs.map((j) => j._id)) : new Set());

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} total applications</p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <Btn variant="danger" onClick={handleBulkDelete}>Delete ({selected.size})</Btn>
          )}
          <Btn onClick={openAdd}>+ Add Job</Btn>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search position, company, location..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="flex-1 min-w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Types</option>
          {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
        </select>
        {(filters.search || filters.status || filters.type) && (
          <Btn variant="ghost" onClick={() => setFilters({ search: '', status: '', type: '' })}>Clear</Btn>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-3">💼</span>
            <p className="font-medium">No jobs found</p>
            <p className="text-sm mt-1">Add your first job application</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" onChange={toggleAll} checked={selected.size === jobs.length && jobs.length > 0} className="rounded" />
                  </th>
                  {['Position', 'Company', 'Type', 'Status', 'Location', 'Salary', 'Applied', 'Follow Up', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(job._id)} onChange={() => toggleSelect(job._id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{job.position}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{job.company}</td>
                    <td className="px-4 py-3"><Badge label={job.type} /></td>
                    <td className="px-4 py-3"><Badge label={job.status} /></td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{job.location || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{job.salaryRange || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmt(job.dateApplied)}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmt(job.followUpDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(job)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Edit</button>
                        <button onClick={() => handleDelete(job._id)} className="text-red-500 hover:text-red-700 font-medium text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title={editing ? 'Edit Job' : 'Add Job'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Position *" required value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              <Input label="Company *" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                options={TYPE_OPTIONS.map((v) => ({ value: v, label: v }))} />
              <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                options={STATUS_OPTIONS.map((v) => ({ value: v, label: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <Input label="Salary Range" value={form.salaryRange} onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} placeholder="e.g. 8-12 LPA" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Date Applied" type="date" value={form.dateApplied} onChange={(e) => setForm({ ...form, dateApplied: e.target.value })} />
              <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
              <Input label="Follow Up" type="date" value={form.followUpDate} onChange={(e) => setForm({ ...form, followUpDate: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Recruiter Name" value={form.recruiterName} onChange={(e) => setForm({ ...form, recruiterName: e.target.value })} />
              <Input label="Recruiter Contact" value={form.recruiterContact} onChange={(e) => setForm({ ...form, recruiterContact: e.target.value })} />
            </div>
            <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="flex gap-3 pt-2">
              <Btn type="submit" disabled={saving} className="flex-1">{saving ? 'Saving...' : editing ? 'Update Job' : 'Add Job'}</Btn>
              <Btn type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
