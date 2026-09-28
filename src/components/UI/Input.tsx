import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-condensed font-600 uppercase tracking-wider text-accent"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full bg-surface border border-border',
          'text-text placeholder:text-text-muted',
          'px-4 py-3 font-body text-sm',
          'focus:outline-none focus:border-accent transition-colors duration-200',
          error ? 'border-red-400' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}