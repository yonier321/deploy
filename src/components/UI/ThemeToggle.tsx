interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className="relative w-12 h-6 rounded-full border border-accent/40 bg-surface-alt transition-all duration-300 cursor-pointer flex items-center"
    >
      <span
        className={[
          'absolute w-4 h-4 rounded-full bg-accent transition-all duration-300',
          isDark ? 'left-1' : 'left-7',
        ].join(' ')}
      />
      <span className="absolute left-1 text-[9px]">{isDark ? '🌙' : ''}</span>
      <span className="absolute right-1 text-[9px]">{!isDark ? '☀️' : ''}</span>
    </button>
  );
}