import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const email = 'yaemikodayoo@gmail.com';
const polaroids = [
  { position: 0, imageUrl: null, caption: 'maid yae at jtown' },
  { position: 1, imageUrl: null, caption: 'double yae set soon' },
  { position: 2, imageUrl: null, caption: 'tingyun mirror break' },
  { position: 3, imageUrl: null, caption: 'sakura weekend crumbs' },
  { position: 4, imageUrl: null, caption: 'waiting on pro shots' },
];

async function main() {
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: 'Matthew / Yuuko',
      emailVerified: new Date(),
    },
    create: {
      email,
      name: 'Matthew / Yuuko',
      emailVerified: new Date(),
    },
  });

  const existingProfile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  const profileData = {
    handle: 'yuuko',
    displayName: 'Yuuko',
    bio: 'bay area cosplay girlie, fox ears collector, and chronic eyeliner overdoer. cherry blossom festival weekend is still living in my head rent free.',
    avatarUrl: '/miko.jpg',
    twitterHandle: 'pci_yae',
    instagramHandle: 'yuuko.koro',
    websiteUrl: 'https://yaepublishing.house',
    themeKey: 'blush',
    characters: ['Yae Miko', 'Tingyun', 'Takina', 'March 7th'],
  };

  const profile = existingProfile
    ? await prisma.profile.update({
        where: { userId: user.id },
        data: profileData,
      })
    : await prisma.profile.create({
        data: {
          userId: user.id,
          ...profileData,
        },
      });

  await prisma.polaroid.deleteMany({
    where: { profileId: profile.id },
  });

  await prisma.polaroid.createMany({
    data: polaroids.map((polaroid) => ({
      ...polaroid,
      profileId: profile.id,
    })),
  });

  console.log('Seeded @yuuko for', email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
