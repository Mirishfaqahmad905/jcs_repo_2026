import React from 'react';

interface CollegeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} shrink-0 rounded-full bg-slate-900 p-0.5 shadow-md ring-2 ring-amber-400/80 overflow-hidden flex items-center justify-center`}>
        <img 
          src="/logo.svg" 
          alt="جمال کالج آف سائنس، مایار" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback if SVG fails
            (e.target as HTMLElement).style.display = 'none';
          }} 
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight leading-tight">
            Jamal College of Sciences
          </span>
          <span className="text-xs text-amber-600 font-bold tracking-wider">
            Mayar, Dir Lower
          </span>
        </div>
      )}
    </div>
  );
};
