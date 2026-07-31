interface OrbiroomLogoProps {
  variant?: 'full' | 'symbol';
  className?: string;
}

export function OrbiroomLogo({ variant = 'full', className = '' }: OrbiroomLogoProps) {
  if (variant === 'symbol') {
    return (
      <img
        src="/images/logo.svg"
        alt=""
        className={className}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className={`brand-lockup ${className}`}>
      <img src="/images/logo.svg" alt="" className="brand-lockup__mark" aria-hidden="true" />
      <span className="brand-lockup__name">Orbiroom</span>
    </div>
  );
}
