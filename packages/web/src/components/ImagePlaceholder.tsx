interface Props {
  width?: number;
  height?: number;
  className?: string;
  label?: string;
  icon?: React.ReactNode;
}

export default function ImagePlaceholder({ width = 600, height = 400, className = '', label, icon }: Props) {
  return (
    <div
      className={`img-placeholder ${className}`}
      style={{ width, height, maxWidth: '100%' }}
    >
      <div className="flex flex-col items-center gap-3 text-center p-6 relative z-10">
        {icon ? (
          <div className="text-brand-400/40">{icon}</div>
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-400/30">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        )}
        {label && (
          <span className="text-sm text-brand-400/50 font-medium">{label}</span>
        )}
      </div>
    </div>
  );
}
