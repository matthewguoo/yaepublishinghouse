import type { DefaultProfileTemplate, PublicProfile } from './types';

export const YUUKO_DEMO_PROFILE = {
  handle: 'yuuko',
  displayName: 'Yuuko',
  bio: 'bay area cosplay girlie, fox ears collector, and chronic eyeliner overdoer. cherry blossom festival weekend is still living in my head rent free.',
  avatarUrl: '/miko.jpg',
  twitterHandle: 'pci_yae',
  instagramHandle: 'yuuko.koro',
  tiktokHandle: '',
  youtubeUrl: '',
  websiteUrl: 'https://yaepublishing.house',
  themeKey: 'blush',
  characters: ['Yae Miko', 'Tingyun', 'Takina', 'March 7th'],
  polaroids: [
    { position: 0, imageUrl: '', caption: 'maid yae at jtown' },
    { position: 1, imageUrl: '', caption: 'double yae set soon' },
    { position: 2, imageUrl: '', caption: 'tingyun mirror break' },
    { position: 3, imageUrl: '', caption: 'sakura weekend crumbs' },
    { position: 4, imageUrl: '', caption: 'waiting on pro shots' },
  ],
} satisfies PublicProfile;

export function getDemoProfile(handle = ''): PublicProfile | null {
  if (handle === 'yuuko') {
    return YUUKO_DEMO_PROFILE;
  }

  return null;
}

export function getSeedProfileTemplate(handle = ''): DefaultProfileTemplate | null {
  if (handle !== 'yuuko') {
    return null;
  }

  return {
    displayName: YUUKO_DEMO_PROFILE.displayName,
    bio: YUUKO_DEMO_PROFILE.bio,
    avatarUrl: YUUKO_DEMO_PROFILE.avatarUrl,
    twitterHandle: YUUKO_DEMO_PROFILE.twitterHandle || null,
    instagramHandle: YUUKO_DEMO_PROFILE.instagramHandle || null,
    tiktokHandle: YUUKO_DEMO_PROFILE.tiktokHandle || null,
    youtubeUrl: YUUKO_DEMO_PROFILE.youtubeUrl || null,
    websiteUrl: YUUKO_DEMO_PROFILE.websiteUrl || null,
    themeKey: YUUKO_DEMO_PROFILE.themeKey,
    characters: YUUKO_DEMO_PROFILE.characters,
    polaroids: YUUKO_DEMO_PROFILE.polaroids,
  };
}
