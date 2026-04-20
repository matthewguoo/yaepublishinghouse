import { cn } from '../lib/utils';

type DoodleProps = {
  className?: string;
};

export function DoodleStar({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn('scrapbook-doodle', className)} aria-hidden="true">
      <path
        d="M31.9 6.5 36.6 24l18.9 1.3-14.8 10.2 4.8 17.4L31.9 42.8 18.3 53 23 35.5 8.5 25.4 27 24.1 31.9 6.5Z"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleHeart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn('scrapbook-doodle', className)} aria-hidden="true">
      <path
        d="M32 52.4c-1.5-1.1-3.8-2.7-6.8-5.2C15.4 39.2 10 33.5 10 24.9c0-7.2 5.2-12.8 12.1-12.8 4.5 0 7.7 2 9.9 5.1 2.2-3.1 5.4-5.1 9.9-5.1 6.9 0 12.1 5.6 12.1 12.8 0 8.6-5.4 14.3-15.2 22.3-3 2.5-5.3 4.1-6.8 5.2Z"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleArrow({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 64" fill="none" className={cn('scrapbook-doodle', className)} aria-hidden="true">
      <path
        d="M7 49c13.3-16.8 29.4-25.3 48.1-25.3 13.8 0 28.3 4.9 45.9 17.8"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M87.5 29.5 101 41.5 85 49.8"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleBow({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 86 48" fill="none" className={cn('scrapbook-doodle', className)} aria-hidden="true">
      <path
        d="M15.3 12.4c10.1 0 17.4 7.2 22.2 13.8-4.2 4.2-10 8.3-17.5 8.3-6.7 0-12.2-4.2-12.2-10.5 0-6 4.7-11.6 7.5-11.6Z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70.7 12.4c-10.1 0-17.4 7.2-22.2 13.8 4.2 4.2 10 8.3 17.5 8.3 6.7 0 12.2-4.2 12.2-10.5 0-6-4.7-11.6-7.5-11.6Z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37.4 23.5c1.4-3.6 3.4-6 5.6-6s4.2 2.4 5.6 6c-1.4 4.2-3.5 7.1-5.6 7.1s-4.2-2.9-5.6-7.1Z"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M43 30.8v10.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function DoodleSakura({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn('scrapbook-doodle', className)} aria-hidden="true">
      <path
        d="M31.8 13.3c4.4-6.9 11.9-8.9 16.9-4.4 5.1 4.7 4.3 12.7-1.9 17.2 8.3-2.3 15.4 1.1 16.8 7.9 1.4 7-4.3 13-13.7 12.1 6.8 5.2 8.4 13.1 3.6 17.8-4.9 4.8-12.8 3.1-17.4-3.9-1.1 8.6-7 14.6-13.8 13.7-7-1-11.2-8.4-8.7-17-5.4 6.2-13.4 7.1-18.1 2.1-4.8-5.1-2.8-12.6 4.5-17.1-8.6.7-15.1-3.6-15.1-10.6 0-7.2 7.2-11.8 15.9-9.7-6.8-4.8-8.7-12.3-4.1-17.2C8.5 4 16.4 4.6 21 11.7c1.5-8.4 7.8-13.4 14.5-12.1 6.7 1.2 10.5 8.3 8.3 16.1Z"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="5.3" stroke="currentColor" strokeWidth="2.8" />
    </svg>
  );
}
