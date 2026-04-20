export const YUUKO_DEMO_PROFILE = {
  handle: 'yuuko',
  displayName: 'Yuuko',
  bio: 'Bay Area cosplayer, fox energy enthusiast, and serial over-committer to eyeliner. Fresh off Cherry Blossom Festival weekend in Maid Yae.',
  avatarUrl: '/miko.jpg',
  twitterHandle: 'pci_yae',
  instagramHandle: 'yuuko.koro',
  tiktokHandle: '',
  youtubeUrl: '',
  websiteUrl: 'https://yaepublishing.house',
  characters: ['Yae Miko', 'Tingyun', 'Takina', 'March 7th'],
  polaroids: [
    { position: 0, imageUrl: '', caption: 'Maid Yae at Japantown' },
    { position: 1, imageUrl: '', caption: 'Double Yae photo set soon' },
    { position: 2, imageUrl: '', caption: 'Tingyun mirror moment' },
    { position: 3, imageUrl: '', caption: 'Cherry blossom weekend' },
    { position: 4, imageUrl: '', caption: 'Waiting for pro shots' },
  ],
};

export function getDemoProfile(handle = '') {
  if (handle === 'yuuko') {
    return YUUKO_DEMO_PROFILE;
  }

  return null;
}

export function getSeedProfileTemplate(handle = '') {
  if (handle !== 'yuuko') {
    return null;
  }

  return {
    displayName: YUUKO_DEMO_PROFILE.displayName,
    bio: YUUKO_DEMO_PROFILE.bio,
    avatarUrl: YUUKO_DEMO_PROFILE.avatarUrl,
    twitterHandle: YUUKO_DEMO_PROFILE.twitterHandle,
    instagramHandle: YUUKO_DEMO_PROFILE.instagramHandle,
    tiktokHandle: YUUKO_DEMO_PROFILE.tiktokHandle || null,
    youtubeUrl: YUUKO_DEMO_PROFILE.youtubeUrl || null,
    websiteUrl: YUUKO_DEMO_PROFILE.websiteUrl || null,
    characters: YUUKO_DEMO_PROFILE.characters,
    polaroids: YUUKO_DEMO_PROFILE.polaroids,
  };
}
