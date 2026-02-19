import type { FormField } from '../../classes/FormField';

interface FormInputProps {
  field: FormField;
  onChange: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
}

export function FormInput({ field, onChange, onBlur }: FormInputProps) {
  const baseClass =
    'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors';
  const errorClass = field.error
    ? 'border-red-400 focus:ring-red-300'
    : 'border-gray-300 focus:ring-blue-300';

  if (field.type === 'select' && field.options) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor={field.name}>
          {field.label}
          {field.rules.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          id={field.name}
          name={field.name}
          value={field.value}
          onChange={(e) => onChange(field.name, e.target.value)}
          onBlur={() => onBlur?.(field.name)}
          className={`${baseClass} ${errorClass} bg-white`}
        >
          <option value="">{field.placeholder || `Choisir ${field.label}`}</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {field.error && <p className="text-xs text-red-500">{field.error}</p>}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700" htmlFor={field.name}>
          {field.label}
          {field.rules.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          id={field.name}
          name={field.name}
          value={field.value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.name, e.target.value)}
          onBlur={() => onBlur?.(field.name)}
          rows={4}
          className={`${baseClass} ${errorClass} resize-none`}
        />
        {field.error && <p className="text-xs text-red-500">{field.error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700" htmlFor={field.name}>
        {field.label}
        {field.rules.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        value={field.value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.name, e.target.value)}
        onBlur={() => onBlur?.(field.name)}
        className={`${baseClass} ${errorClass}`}
      />
      {field.error && <p className="text-xs text-red-500">{field.error}</p>}
    </div>
  );
}
