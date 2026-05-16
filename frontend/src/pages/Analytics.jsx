import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';

const STATUS_COLORS = {
  Applied: '#6366f1', Round1: '#f59e0b', Round2: '#f97316',
  Round3: '#8b5cf6', Selected: '#10b981', Rejected: '#ef4444', Dropped: '#6b7280',
};
const TYPE_COLORS = { Applied: '#6366f1', Dropped: '#6b7280', Interview: '#f59e0b', Offer: '#10b981' };
const PALETTE = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#f97316','#6b7280'];

const StatCard = ({ label, value, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics')
      .then(({ data: res }) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full text-gray-400 text-lg">Loading analytics...</div>;

  if (!data || data.total === 0) return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <span className="text-6xl mb-4">📊</span>
      <p className="text-lg font-medium">No data yet</p>
      <p className="text-sm mt-1">Add job applications to see analytics</p>
    </div>
  );

  const statusData = data.statusStats.map((s) => ({ name: s._id || 'Unknown', value: s.count }));
  const typeData = data.typeStats.map((t) => ({ name: t._id || 'Unknown', value: t.count }));
  const selected = data.statusStats.find((s) => s._id === 'Selected')?.count || 0;
  const rejected = data.statusStats.find((s) => s._id === 'Rejected')?.count || 0;
  const inProgress = data.statusStats.filter((s) => ['Round1','Round2','Round3'].includes(s._id)).reduce((a, b) => a + b.count, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your job search</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={data.total} color="text-indigo-600" />
        <StatCard label="In Progress" value={inProgress} color="text-yellow-500" />
        <StatCard label="Selected / Offers" value={selected} color="text-emerald-600" />
        <StatCard label="Rejected" value={rejected} color="text-red-500" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Application Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || PALETTE[0]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Type Pie */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Application Type</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {typeData.map((entry) => (
                  <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || PALETTE[1]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly bar + line */}
      {data.monthly.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Applications per Month</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.monthly} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-700 mb-4">Application Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.monthly} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Applications" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Status breakdown bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Status Breakdown</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Count">
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || PALETTE[0]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
