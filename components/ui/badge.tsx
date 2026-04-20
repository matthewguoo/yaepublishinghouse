import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1.5 text-[0.95rem] transition-colors font-note',
  {
    variants: {
      variant: {
        default: 'border-petal-200/80 bg-petal-50 text-jam',
        secondary: 'border-white/80 bg-white/90 text-foreground',
        outline: 'border-petal-300/70 bg-transparent text-jam',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
