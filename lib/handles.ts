export const RESERVED_HANDLES = [
  'admin',
  'api',
  'auth',
  'login',
  'signup',
  'dashboard',
  'settings',
  'about',
] as const;

export const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/;

export type HandleValidationResult =
  | {
      ok: true;
      handle: string;
    }
  | {
      ok: false;
      handle: string;
      message: string;
    };

export function normalizeHandle(value = ''): string {
  return value.trim().toLowerCase().replace(/^@+/, '');
}

export function isReservedHandle(handle: string): boolean {
  return RESERVED_HANDLES.includes(handle as (typeof RESERVED_HANDLES)[number]);
}

export function validateHandle(rawHandle = ''): HandleValidationResult {
  const handle = normalizeHandle(rawHandle);

  if (!HANDLE_REGEX.test(handle)) {
    return {
      ok: false,
      handle,
      message: 'Handles need 3-20 lowercase letters, numbers, or underscores.',
    };
  }

  if (isReservedHandle(handle)) {
    return {
      ok: false,
      handle,
      message: 'That handle is reserved.',
    };
  }

  return { ok: true, handle };
}

export function labelFromHandle(handle = ''): string {
  return normalizeHandle(handle)
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
