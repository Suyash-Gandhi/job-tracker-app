export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        {...props}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
      />
    </div>
  );
}

export function Select({ label, options, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        {...props}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white transition"
      >
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

export function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        {...props}
        rows={3}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition"
      />
    </div>
  );
}

export function Btn({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  };
  return <button {...props} className={`${base} ${variants[variant]} ${className}`}>{children}</button>;
}
