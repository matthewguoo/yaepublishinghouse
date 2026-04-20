export const PROFILE_THEME_KEYS = [
  'blush',
  'lavender',
  'mint',
  'butter',
  'peach',
  'sky',
  'matcha',
  'rose',
] as const;

export type ProfileThemeKey = (typeof PROFILE_THEME_KEYS)[number];

export type ProfileTheme = {
  key: ProfileThemeKey;
  label: string;
  accent: string;
  accentDeep: string;
  tint: string;
  tintStrong: string;
  paper: string;
  paperAlt: string;
  tape: string;
  ink: string;
  sticker: string;
};

export const PROFILE_THEMES: Record<ProfileThemeKey, ProfileTheme> = {
  blush: {
    key: 'blush',
    label: 'Blush pink',
    accent: '#f29bc0',
    accentDeep: '#ca628b',
    tint: '#fff4f8',
    tintStrong: 'rgba(242, 155, 192, 0.22)',
    paper: '#fffafc',
    paperAlt: '#fff1f6',
    tape: 'rgba(252, 207, 225, 0.85)',
    ink: '#5c3346',
    sticker: '#ffcee0',
  },
  lavender: {
    key: 'lavender',
    label: 'Lavender',
    accent: '#baa5f7',
    accentDeep: '#7c65c0',
    tint: '#faf7ff',
    tintStrong: 'rgba(186, 165, 247, 0.2)',
    paper: '#fdfbff',
    paperAlt: '#f3efff',
    tape: 'rgba(224, 213, 255, 0.84)',
    ink: '#453b64',
    sticker: '#e3dbff',
  },
  mint: {
    key: 'mint',
    label: 'Mint',
    accent: '#87d4b4',
    accentDeep: '#4d9d81',
    tint: '#f4fffb',
    tintStrong: 'rgba(135, 212, 180, 0.22)',
    paper: '#fbfffd',
    paperAlt: '#eefbf5',
    tape: 'rgba(196, 241, 224, 0.84)',
    ink: '#294d43',
    sticker: '#c9f0df',
  },
  butter: {
    key: 'butter',
    label: 'Butter yellow',
    accent: '#e8c96b',
    accentDeep: '#b38a2b',
    tint: '#fffdf1',
    tintStrong: 'rgba(232, 201, 107, 0.24)',
    paper: '#fffef8',
    paperAlt: '#fff7d9',
    tape: 'rgba(255, 236, 166, 0.82)',
    ink: '#5e4821',
    sticker: '#fff0af',
  },
  peach: {
    key: 'peach',
    label: 'Peach',
    accent: '#f1b08e',
    accentDeep: '#c56f42',
    tint: '#fff8f4',
    tintStrong: 'rgba(241, 176, 142, 0.24)',
    paper: '#fffdfb',
    paperAlt: '#fff0e7',
    tape: 'rgba(255, 213, 189, 0.84)',
    ink: '#654133',
    sticker: '#ffd8c5',
  },
  sky: {
    key: 'sky',
    label: 'Sky blue',
    accent: '#8fc7f8',
    accentDeep: '#4f86b8',
    tint: '#f4fbff',
    tintStrong: 'rgba(143, 199, 248, 0.22)',
    paper: '#fbfeff',
    paperAlt: '#ebf6ff',
    tape: 'rgba(203, 229, 252, 0.84)',
    ink: '#304c62',
    sticker: '#cde7ff',
  },
  matcha: {
    key: 'matcha',
    label: 'Matcha',
    accent: '#a9c37f',
    accentDeep: '#648146',
    tint: '#f8fff2',
    tintStrong: 'rgba(169, 195, 127, 0.22)',
    paper: '#fdfff9',
    paperAlt: '#eff7e3',
    tape: 'rgba(216, 231, 194, 0.86)',
    ink: '#3f5232',
    sticker: '#dceabb',
  },
  rose: {
    key: 'rose',
    label: 'Rose red',
    accent: '#ea8b9b',
    accentDeep: '#bb5168',
    tint: '#fff5f7',
    tintStrong: 'rgba(234, 139, 155, 0.24)',
    paper: '#fffafb',
    paperAlt: '#fff0f3',
    tape: 'rgba(250, 206, 214, 0.86)',
    ink: '#5a2f3c',
    sticker: '#ffcbd3',
  },
};

export const DEFAULT_PROFILE_THEME: ProfileThemeKey = 'blush';

export function isProfileThemeKey(value: string): value is ProfileThemeKey {
  return PROFILE_THEME_KEYS.includes(value as ProfileThemeKey);
}

export function getProfileTheme(themeKey?: string | null): ProfileTheme {
  if (themeKey && isProfileThemeKey(themeKey)) {
    return PROFILE_THEMES[themeKey];
  }

  return PROFILE_THEMES[DEFAULT_PROFILE_THEME];
}
