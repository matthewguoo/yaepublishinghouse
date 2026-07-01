import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const articles = [
  {
    slug: 'hiring-writers',
    title: 'The Guuji Seeks Editorial Staff',
    date: '2026-05-18',
    category: 'Recruitment',
    excerpt: 'Writers, reporters, and content creators wanted. Contributors receive free merchandise, store vouchers, early access, and direct monetary compensation.',
    published: true,
    featured: true,
    content: `Yae Publishing House is expanding its editorial team. We are seeking talented writers, reporters, and content creators to join our publication and cover the ever-growing world of HoYoverse games and community events.

## What We're Looking For

We welcome applications from passionate fans who can contribute original content about Genshin Impact, Honkai: Star Rail, Zenless Zone Zero, and other HoYoverse titles. Whether you're interested in event coverage, lore analysis, community spotlights, or product reviews, we want to hear from you.

## What You'll Receive

Contributors to Yae Publishing House receive free merchandise from our store, store vouchers for future purchases, early access to limited edition drops, and direct monetary compensation for published work. Your writing will be published under the Yae Publishing House banner and shared with our growing community of Travelers.

## How to Apply

To express your interest, please fill out our [application form](https://docs.google.com/forms/d/e/1FAIpQLSdcW9rmgzqiSqJCJhAYXyIs3fivJOMu0jjDR7-W4V5M_yVexA/viewform). We'll ask about:

- A brief introduction about yourself
- Which HoYoverse games you play and your experience level
- What type of content you'd like to create
- Any relevant writing samples or portfolio links

We look forward to welcoming new voices to the Yae Publishing House family. May your words be as sharp as the Guuji's wit.

— The Editorial Department`,
  },
  {
    slug: 'star-rail-pass-announcement',
    title: 'Introducing the Star Rail Special Pass',
    date: '2026-05-17',
    category: 'Product Launch',
    excerpt: 'Limited edition gold-plated collectible commemorating the 2158th Year of the Trailblaze.',
    published: true,
    featured: true,
    content: `![Star Rail Special Pass Banner](/banner-ipc.png)

We are pleased to announce the Star Rail Special Pass, a limited edition gold-plated collectible commemorating the 2158th Year of the Trailblaze.

[View Product Details](/products/star-rail-pass)

## About This Edition

Each Star Rail Special Pass is manufactured using premium materials and processes typically reserved for aerospace-grade electronics.

The pass features an ENIG finish, with real gold plating covering over 50% of the surface area. Each unit is individually serialized from 0001 to 2158, ensuring every piece is unique.

## Manufacturing Specifications

Dimensions: 100 × 40 × 1.0 mm. Surface finish: ENIG with UV silkscreen printing for vibrant, fade-resistant colors.

## The Stellaron Hunters Collaboration

In an unprecedented partnership, the Stellaron Hunters have collaborated to bring this commemorative item to Trailblazers across the cosmos. Silver Wolf personally supervised the digital security measures embedded in each pass.

A portion of proceeds supports Astral Express operational costs, including but not limited to fuel, snacks for Pom-Pom, and emergency repairs.

## Availability

The Star Rail Special Pass will be available for pre-order starting at the Seattle HoYo Community Event on May 30th. Online orders will open shortly after.

Due to the limited production run of 2,158 units, we recommend joining the waitlist to secure your serial number.`,
  },
  {
    slug: 'hoyofair-2026',
    title: 'HoYoFair 2026 Los Angeles: A Report from the Front Row',
    date: '2026-05-03',
    category: 'Event Report',
    excerpt: 'This reporter was fortunate to attend the event with a gifted front-row seat ticket.',
    published: true,
    featured: true,
    content: `![HoYoFair 2026 Key Visual](/banner-hoyofair.png)

On Friday, May 1st, 2026, HoYoverse brought its annual fan celebration HoYoFair 2026 to the Dolby Theatre in Los Angeles. The historic venue, famous for hosting the Academy Awards, provided a fitting backdrop for an unforgettable evening of music and celebration.

This reporter was fortunate to attend the concert with a gifted front-row seat ticket, courtesy of a generous contact within the community. Accommodations were secured at a hostel on Hollywood Boulevard, where a two-night stay cost approximately $70. Combined with a $60 flight arranged well in advance, the entire trip totaled roughly $130.

## Concert Highlights

The evening opened with an orchestral arrangement of Genshin Impact's Liyue theme that immediately drew gasps from the audience. The HoYoverse Symphony Orchestra, accompanied by a full choir, delivered breathtaking performances of fan-favorite tracks spanning all four titles.

Of particular note was a medley from Honkai: Star Rail featuring music from the Penacony arc, which earned a standing ovation from the crowd.

## Community Atmosphere

The lobby and surrounding areas of Hollywood Boulevard were filled with cosplayers representing characters from all four titles. The sense of community was palpable.

> With careful planning, a weekend of celebration need not break the bank.

Yae Publishing House extends its gratitude to all who made this coverage possible, and looks forward to continued reporting on community events in the future.`,
  },
  {
    slug: 'anniversary-dialogue',
    title: 'Anniversary Dialogue: A Year of Publishing',
    date: '2026-01-01',
    category: 'Editorial',
    excerpt: 'Reflecting on our first year of bringing stories to the Traveler community.',
    published: true,
    featured: false,
    content: `![Yae Miko and Raiden Shogun](/yae-raiden-banner.png)

In commemoration of the anniversary of Yae Publishing House, we are honored to present an exclusive dialogue between Lady Yae Miko, Chief Priestess of the Grand Narukami Shrine, and the Raiden Shogun, Almighty Narukami Ogosho.

## On the Founding of Yae Publishing House

**Raiden Shogun:** Even by the measure of eternity, this is no small span of time. I recall when you first proposed this venture. Many in the court questioned the necessity of such an establishment.

**Yae Miko:** And yet here we are, still printing, still binding, still selling books that the people of Inazuma and beyond seem quite eager to purchase. I believe the phrase is I told you so, though I'm far too gracious to say it directly.

## On Literature and Eternity

**Yae Miko:** What I find most fascinating is how stories endure. Buildings crumble, empires shift, but a good story finds its way into the hearts of each new generation. That is a form of eternity, is it not?

**Raiden Shogun:** You speak of the eternity of ideas rather than physical permanence. This is a valid interpretation.

## Looking Forward

Yae Publishing House thanks its readers for their patronage, and looks forward to bringing more stories to Teyvat and beyond.`,
  },
];

for (const article of articles) {
  await prisma.article.upsert({
    where: { slug: article.slug },
    update: article,
    create: article,
  });
}

await prisma.user.updateMany({
  where: { email: process.env.ADMIN_EMAIL || 'yaemikodayoo@gmail.com' },
  data: { isAdmin: true },
});

await prisma.$disconnect();
console.log(`Seeded ${articles.length} articles and promoted admin user if present`);
