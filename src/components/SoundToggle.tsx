interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? '사운드 끄기' : '사운드 켜기'}
    >
      {enabled ? '♪' : '♪̸'}
    </button>
  );
}
