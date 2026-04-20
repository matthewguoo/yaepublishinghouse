import prisma from './prisma';
import { getDemoProfile, getSeedProfileTemplate } from './demo-profile';
import { labelFromHandle, normalizeHandle, validateHandle } from './handles';
import { DEFAULT_PROFILE_THEME, isProfileThemeKey } from './themes';
import type {
  DefaultProfileTemplate,
  EditableProfilePayload,
  ProfileRecord,
  PublicProfile,
  SocialLink,
} from './types';

function clampText(value = '', max = 240): string {
  return value.trim().slice(0, max);
}

function cleanSocialHandle(value = ''): string {
  return value.trim().replace(/^@+/, '').slice(0, 40);
}

function cleanUrl(value = ''): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  try {
    const url = trimmed.startsWith('http') ? new URL(trimmed) : new URL(`https://${trimmed}`);
    return url.toString();
  } catch {
    return '';
  }
}

function normalizeThemeKey(value?: string | null) {
  if (value && isProfileThemeKey(value)) {
    return value;
  }

  return DEFAULT_PROFILE_THEME;
}

function buildDefaultProfile(handle: string): DefaultProfileTemplate {
  const seeded = getSeedProfileTemplate(handle);

  if (seeded) {
    return seeded;
  }

  return {
    displayName: labelFromHandle(handle) || handle,
    bio: '',
    avatarUrl: '',
    twitterHandle: '',
    instagramHandle: '',
    tiktokHandle: '',
    youtubeUrl: '',
    websiteUrl: '',
    themeKey: DEFAULT_PROFILE_THEME,
    characters: [],
    polaroids: Array.from({ length: 5 }, (_, position) => ({ position, imageUrl: '', caption: '' })),
  };
}

function serializeProfile(profile: ProfileRecord | null): PublicProfile | null {
  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    userId: profile.userId,
    handle: profile.handle,
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    twitterHandle: profile.twitterHandle,
    instagramHandle: profile.instagramHandle,
    tiktokHandle: profile.tiktokHandle,
    youtubeUrl: profile.youtubeUrl,
    websiteUrl: profile.websiteUrl,
    themeKey: normalizeThemeKey(profile.themeKey),
    characters: profile.characters || [],
    polaroids: (profile.polaroids || [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((polaroid) => ({
        position: polaroid.position,
        imageUrl: polaroid.imageUrl,
        caption: polaroid.caption,
      })),
  };
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL);
}

export function formatSocialLinks(profile: PublicProfile): SocialLink[] {
  const links: SocialLink[] = [];

  if (profile.twitterHandle) {
    links.push({ label: 'Twitter', href: `https://x.com/${profile.twitterHandle}`, accent: 'berry' });
  }

  if (profile.instagramHandle) {
    links.push({ label: 'Instagram', href: `https://instagram.com/${profile.instagramHandle}`, accent: 'petal' });
  }

  if (profile.tiktokHandle) {
    links.push({ label: 'TikTok', href: `https://www.tiktok.com/@${profile.tiktokHandle}`, accent: 'ink' });
  }

  if (profile.youtubeUrl) {
    links.push({ label: 'YouTube', href: profile.youtubeUrl, accent: 'jam' });
  }

  if (profile.websiteUrl) {
    links.push({ label: 'Website', href: profile.websiteUrl, accent: 'cream' });
  }

  return links;
}

export async function getProfileByHandle(rawHandle: string): Promise<PublicProfile | null> {
  const handle = normalizeHandle(rawHandle);

  if (!handle) {
    return null;
  }

  if (!isDatabaseConfigured()) {
    return getDemoProfile(handle);
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { handle },
      include: {
        polaroids: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return serializeProfile(profile) || getDemoProfile(handle);
  } catch (error) {
    console.error('Failed to load profile by handle', error);
    return getDemoProfile(handle);
  }
}

export async function getProfileByUserId(userId: string): Promise<PublicProfile | null> {
  if (!isDatabaseConfigured() || !userId) {
    return null;
  }

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        polaroids: {
          orderBy: { position: 'asc' },
        },
      },
    });

    return serializeProfile(profile);
  } catch (error) {
    console.error('Failed to load profile by user id', error);
    return null;
  }
}

export async function prepareHandleReservation({
  email,
  rawHandle,
}: {
  email: string;
  rawHandle: string;
}): Promise<{ handle: string }> {
  if (!isDatabaseConfigured()) {
    throw new Error('Database is not configured yet. Add POSTGRES_URL first.');
  }

  const trimmedEmail = email.trim().toLowerCase();
  const validation = validateHandle(rawHandle);

  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    throw new Error('Enter a real email address.');
  }

  if (!validation.ok) {
    const message = 'message' in validation ? validation.message : 'Invalid handle.';
    throw new Error(message);
  }

  const handle = validation.handle;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

  await prisma.handleReservation.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });

  const existingProfile = await prisma.profile.findUnique({ where: { handle } });
  if (existingProfile) {
    throw new Error('That handle is already taken.');
  }

  const existingReservation = await prisma.handleReservation.findUnique({ where: { handle } });
  if (existingReservation && existingReservation.email !== trimmedEmail) {
    throw new Error('That handle is already being claimed right now.');
  }

  await prisma.handleReservation.upsert({
    where: { handle },
    update: {
      email: trimmedEmail,
      expiresAt,
    },
    create: {
      handle,
      email: trimmedEmail,
      expiresAt,
    },
  });

  return { handle };
}

export async function claimHandleForUser({
  userId,
  email,
  rawHandle,
}: {
  userId: string;
  email: string;
  rawHandle: string;
}): Promise<PublicProfile | null> {
  if (!isDatabaseConfigured()) {
    throw new Error('Database is not configured yet.');
  }

  const trimmedEmail = email.trim().toLowerCase();
  const validation = validateHandle(rawHandle);

  if (!validation.ok) {
    const message = 'message' in validation ? validation.message : 'Invalid handle.';
    throw new Error(message);
  }

  const handle = validation.handle;
  const defaults = buildDefaultProfile(handle);

  return prisma.$transaction(async (tx) => {
    const existingUserProfile = await tx.profile.findUnique({
      where: { userId },
      include: {
        polaroids: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (existingUserProfile) {
      return serializeProfile(existingUserProfile);
    }

    const handleOwner = await tx.profile.findUnique({ where: { handle } });
    if (handleOwner) {
      throw new Error('That handle is already taken.');
    }

    const now = new Date();
    const reservation = await tx.handleReservation.findUnique({ where: { handle } });

    if (reservation && reservation.expiresAt >= now && reservation.email !== trimmedEmail) {
      throw new Error('That handle is already reserved.');
    }

    if (reservation && reservation.expiresAt < now) {
      await tx.handleReservation.delete({ where: { handle } });
    }

    const profile = await tx.profile.create({
      data: {
        userId,
        handle,
        displayName: defaults.displayName,
        bio: defaults.bio,
        avatarUrl: defaults.avatarUrl || null,
        twitterHandle: defaults.twitterHandle || null,
        instagramHandle: defaults.instagramHandle || null,
        tiktokHandle: defaults.tiktokHandle || null,
        youtubeUrl: defaults.youtubeUrl || null,
        websiteUrl: defaults.websiteUrl || null,
        themeKey: defaults.themeKey,
        characters: defaults.characters,
        polaroids: {
          create: defaults.polaroids.map((polaroid, position) => ({
            position,
            imageUrl: polaroid.imageUrl || null,
            caption: polaroid.caption || null,
          })),
        },
      },
      include: {
        polaroids: {
          orderBy: { position: 'asc' },
        },
      },
    });

    await tx.handleReservation.deleteMany({
      where: {
        OR: [{ email: trimmedEmail }, { handle }],
      },
    });

    return serializeProfile(profile);
  });
}

export async function updateProfileForUser({
  userId,
  payload,
}: {
  userId: string;
  payload: EditableProfilePayload;
}): Promise<PublicProfile | null> {
  if (!isDatabaseConfigured()) {
    throw new Error('Database is not configured yet.');
  }

  const existingProfile = await prisma.profile.findUnique({ where: { userId } });
  if (!existingProfile) {
    throw new Error('Profile not found.');
  }

  const displayName = clampText(payload.displayName || existingProfile.displayName, 60);
  const bio = clampText(payload.bio || '', 240);
  const avatarUrl = cleanUrl(payload.avatarUrl || '') || (payload.avatarUrl?.startsWith('/') ? payload.avatarUrl : '');
  const twitterHandle = cleanSocialHandle(payload.twitterHandle || '');
  const instagramHandle = cleanSocialHandle(payload.instagramHandle || '');
  const tiktokHandle = cleanSocialHandle(payload.tiktokHandle || '');
  const youtubeUrl = cleanUrl(payload.youtubeUrl || '');
  const websiteUrl = cleanUrl(payload.websiteUrl || '');
  const themeKey = normalizeThemeKey(payload.themeKey || existingProfile.themeKey);
  const characters = Array.isArray(payload.characters)
    ? payload.characters.map((value) => clampText(value, 30)).filter(Boolean).slice(0, 12)
    : [];
  const polaroids = Array.isArray(payload.polaroids)
    ? payload.polaroids.slice(0, 5).map((polaroid, position) => ({
        position,
        imageUrl:
          cleanUrl(polaroid?.imageUrl || '') ||
          (polaroid?.imageUrl?.startsWith('/') ? polaroid.imageUrl : '') ||
          null,
        caption: clampText(polaroid?.caption || '', 80) || null,
      }))
    : [];

  await prisma.$transaction(async (tx) => {
    await tx.profile.update({
      where: { userId },
      data: {
        displayName: displayName || labelFromHandle(existingProfile.handle),
        bio,
        avatarUrl: avatarUrl || null,
        twitterHandle: twitterHandle || null,
        instagramHandle: instagramHandle || null,
        tiktokHandle: tiktokHandle || null,
        youtubeUrl: youtubeUrl || null,
        websiteUrl: websiteUrl || null,
        themeKey,
        characters,
      },
    });

    await tx.polaroid.deleteMany({
      where: { profileId: existingProfile.id },
    });

    if (polaroids.length) {
      await tx.polaroid.createMany({
        data: polaroids.map((polaroid) => ({
          profileId: existingProfile.id,
          position: polaroid.position,
          imageUrl: polaroid.imageUrl,
          caption: polaroid.caption,
        })),
      });
    }
  });

  return getProfileByUserId(userId);
}
