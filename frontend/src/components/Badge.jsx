const statusColors = {
  Applied:     'bg-blue-100 text-blue-700',
  Round1:      'bg-yellow-100 text-yellow-700',
  Round2:      'bg-orange-100 text-orange-700',
  Round3:      'bg-purple-100 text-purple-700',
  Selected:    'bg-green-100 text-green-700',
  Rejected:    'bg-red-100 text-red-700',
  Dropped:     'bg-gray-100 text-gray-600',
  Interview:   'bg-indigo-100 text-indigo-700',
  Offer:       'bg-emerald-100 text-emerald-700',
  Scheduled:   'bg-blue-100 text-blue-700',
  Completed:   'bg-green-100 text-green-700',
  Cancelled:   'bg-red-100 text-red-700',
};

export default function Badge({ label }) {
  const color = statusColors[label] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {label}
    </span>
  );
}
