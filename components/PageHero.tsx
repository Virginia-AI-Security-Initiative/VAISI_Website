import type { ReactNode } from 'react';

interface PageHeroProps {
  title: ReactNode;
  titleClassName?: string;
  className?: string;
}

export default function PageHero({
  title,
  titleClassName = 'text-5xl sm:text-6xl',
  className = '',
}: PageHeroProps) {
  return (
    <header className={`border-b border-black/10 bg-white px-4 pb-9 pt-12 sm:px-6 sm:pb-11 sm:pt-14 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <h1 className={`${titleClassName} font-bold leading-none tracking-[-0.03em] text-primary`}>
          {title}
        </h1>
      </div>
    </header>
  );
}
