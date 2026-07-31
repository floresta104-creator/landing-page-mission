interface HotspotProps {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function Hotspot({ label, x, y, w, h, active = true, disabled, onClick }: HotspotProps) {
  return (
    <button
      type="button"
      className={`hotspot ${active ? 'is-active' : ''} ${disabled ? 'is-disabled' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {active && !disabled && (
        <>
          <span className="hotspot__ring" aria-hidden="true" />
          <span className="hotspot__tip">{label}</span>
        </>
      )}
    </button>
  );
}
