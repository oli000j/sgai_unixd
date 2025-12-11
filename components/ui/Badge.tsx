import React from 'react';
import { DifficultyLevel, TopicStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'error' | 'brand';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    outline: 'border border-slate-200 text-slate-600',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-100',
    error: 'bg-red-50 text-red-700 border border-red-100',
    brand: 'bg-brand-50 text-brand-700 border border-brand-100'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const DifficultyBadge: React.FC<{ level: DifficultyLevel }> = ({ level }) => {
  const getLabel = (l: number) => {
    switch(l) {
      case 1: return 'Fácil';
      case 2: return 'Medio';
      case 3: return 'Difícil';
      case 4: return 'Muy Difícil';
      case 5: return 'Extremo';
      default: return 'N/A';
    }
  };

  const getVariant = (l: number): BadgeProps['variant'] => {
    if (l <= 2) return 'success';
    if (l === 3) return 'warning';
    return 'error';
  };

  return (
    <Badge variant={getVariant(level)}>
      Lvl {level}: {getLabel(level)}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: TopicStatus }> = ({ status }) => {
  if (status === TopicStatus.MASTERED) return <Badge variant="success">Dominado</Badge>;
  if (status === TopicStatus.IN_PROGRESS) return <Badge variant="warning">En Progreso</Badge>;
  return <Badge variant="outline">Pendiente</Badge>;
};