import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full border text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-petal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-petal-300/40 bg-gradient-to-b from-petal-300 via-petal-400 to-petal-500 text-white shadow-paper hover:-translate-y-0.5 hover:rotate-[-0.4deg] hover:shadow-float font-note text-[1.02rem]',
        secondary:
          'border-[rgba(112,82,94,0.16)] bg-white/92 text-foreground shadow-paper hover:-translate-y-0.5 hover:rotate-[0.3deg] hover:bg-white font-note text-[1.02rem]',
        ghost:
          'border-2 border-dashed border-petal-300/80 bg-petal-50/90 text-jam hover:-translate-y-0.5 hover:rotate-[-0.4deg] hover:bg-petal-100/80 font-note text-[1.02rem]',
        outline: 'border border-petal-200 bg-transparent text-foreground hover:bg-petal-50 font-note text-[1.02rem]',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-6 text-[1.08rem]',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
