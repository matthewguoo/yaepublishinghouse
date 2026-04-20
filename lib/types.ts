import type { Prisma } from '@prisma/client';

export type ProfileRecord = Prisma.ProfileGetPayload<{
  include: {
    polaroids: true;
  };
}>;

export type PolaroidSlot = {
  position: number;
  imageUrl: string | null;
  caption: string | null;
};

export type PublicProfile = {
  id?: string;
  userId?: string;
  handle: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  twitterHandle: string | null;
  instagramHandle: string | null;
  tiktokHandle: string | null;
  youtubeUrl: string | null;
  websiteUrl: string | null;
  characters: string[];
  polaroids: PolaroidSlot[];
};

export type DefaultProfileTemplate = Omit<PublicProfile, 'handle'>;

export type SocialLinkAccent = 'berry' | 'petal' | 'ink' | 'jam' | 'cream';

export type SocialLink = {
  label: string;
  href: string;
  accent: SocialLinkAccent;
};

export type EditablePolaroid = {
  position: number;
  imageUrl: string;
  caption: string;
};

export type EditableProfilePayload = {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  twitterHandle?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  characters?: string[];
  polaroids?: Array<Partial<EditablePolaroid>>;
};
