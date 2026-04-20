import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const email = 'yaemikodayoo@gmail.com';
const polaroids = [
  { position: 0, imageUrl: null, caption: 'Maid Yae at Japantown' },
  { position: 1, imageUrl: null, caption: 'Double Yae photo set soon' },
  { position: 2, imageUrl: null, caption: 'Tingyun mirror moment' },
  { position: 3, imageUrl: null, caption: 'Cherry blossom weekend' },
  { position: 4, imageUrl: null, caption: 'Waiting for pro shots' },
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

  const profile = existingProfile
    ? await prisma.profile.update({
        where: { userId: user.id },
        data: {
          handle: 'yuuko',
          displayName: 'Yuuko',
          bio: 'Bay Area cosplayer, fox energy enthusiast, and serial over-committer to eyeliner. Fresh off Cherry Blossom Festival weekend in Maid Yae.',
          avatarUrl: '/miko.jpg',
          twitterHandle: 'pci_yae',
          instagramHandle: 'yuuko.koro',
          websiteUrl: 'https://yaepublishing.house',
          characters: ['Yae Miko', 'Tingyun', 'Takina', 'March 7th'],
        },
      })
    : await prisma.profile.create({
        data: {
          userId: user.id,
          handle: 'yuuko',
          displayName: 'Yuuko',
          bio: 'Bay Area cosplayer, fox energy enthusiast, and serial over-committer to eyeliner. Fresh off Cherry Blossom Festival weekend in Maid Yae.',
          avatarUrl: '/miko.jpg',
          twitterHandle: 'pci_yae',
          instagramHandle: 'yuuko.koro',
          websiteUrl: 'https://yaepublishing.house',
          characters: ['Yae Miko', 'Tingyun', 'Takina', 'March 7th'],
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
