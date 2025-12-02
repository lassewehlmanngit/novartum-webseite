import React from 'react';
import * as Icons from 'lucide-react';

export const IconMapper = ({ name, className, size = 24, strokeWidth = 1.5 }: { name: string; className?: string, size?: number, strokeWidth?: number }) => {
  // @ts-ignore
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} />;
};
