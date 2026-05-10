import { PrismaClient, TourCategory, TourDifficulty, RegistrationStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  console.log('Seeding database...')

  await prisma.registration.deleteMany()
  await prisma.tour.deleteMany()
  await prisma.admin.deleteMany()

  const passwordHash = await bcrypt.hash('admin123', 12)
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@tallinn-tours.com',
      passwordHash,
      name: 'Admin',
    },
  })
  console.log(`Created admin: ${admin.email}`)

  const tours = await Promise.all([
    prisma.tour.create({
      data: {
        title: 'Old Town Walking Tour',
        slug: 'old-town-walking-tour',
        description:
          "Discover the enchanting medieval heart of Tallinn on this immersive walking tour through the UNESCO-listed Old Town. We begin at the iconic Viru Gate — the medieval entrance to the city — and wind through cobblestone streets past Gothic churches, guild houses, and hidden courtyards that have changed little since the 13th century. Your expert guide brings history to life with stories of Hanseatic merchants, Teutonic knights, and Estonian resilience. We climb to Toompea Hill for breathtaking panoramic views over the terracotta rooftops and the Baltic Sea beyond. The tour concludes at the medieval Town Hall Square, where you'll have time to browse the artisan market stalls.",
        shortDescription:
          'Explore the UNESCO-listed medieval Old Town with its Gothic spires, cobblestone lanes, and 800 years of living history.',
        date: new Date('2026-06-15T10:00:00.000Z'),
        durationMinutes: 150,
        meetingLocation: 'Viru Gate (Viru värav)',
        meetingLocationDetails:
          'Meet at the two medieval towers on Viru Street. Look for the guide holding a yellow Tallinn Tours flag.',
        price: 28,
        capacity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=1200',
        category: TourCategory.WALKING,
        difficulty: TourDifficulty.EASY,
        language: 'English',
        highlights: [
          'Viru Gate — 14th-century medieval entrance towers',
          'Town Hall Square — Gothic masterpiece from 1404',
          'Toompea Castle — seat of Estonian parliament',
          'Alexander Nevsky Cathedral — stunning Russian Orthodox architecture',
          'Viewpoint panoramas over Tallinn and the Baltic Sea',
          "St. Olaf's Church — once the tallest building in the world",
        ],
        includes: [
          'Professional licensed guide',
          'Headsets for groups over 8',
          'City map and walking guide booklet',
          'Welcome drink at the tour end',
        ],
        isActive: true,
      },
    }),

    prisma.tour.create({
      data: {
        title: 'Evening Legends & Ghost Tour',
        slug: 'evening-legends-ghost-tour',
        description:
          "As darkness falls over Tallinn's medieval streets, the city transforms into a place of shadows and stories. This atmospheric evening tour explores the darker side of one of Europe's most haunted old towns — a city that has witnessed plague, siege, occupation, and centuries of human drama. Your storyteller guide leads you through flickering alleyways to sites tied to Tallinn's most chilling legends: the plague doctor's quarter where thousands perished in 1603, the tower cell where prisoners were bricked alive into the walls, and the ghost of the White Lady said to haunt Toompea Castle on the eve of battles. The tour ends at a medieval tavern for a warming cup of mulled wine and a final tale told by candlelight. Not recommended for children under 12.",
        shortDescription:
          "After dark, Tallinn's cobblestone streets become a stage for plague doctors, bricked-up prisoners, and the White Lady of Toompea — a chilling evening tour.",
        date: new Date('2026-08-07T21:00:00.000Z'),
        durationMinutes: 120,
        meetingLocation: 'Fat Margaret Tower (Paks Margareeta)',
        meetingLocationDetails:
          'Meet at the base of the Fat Margaret cannon tower on Pikk Street near the Great Coast Gate. Look for the guide in period costume.',
        price: 32,
        capacity: 16,
        imageUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=1200',
        category: TourCategory.EVENING,
        difficulty: TourDifficulty.EASY,
        language: 'English',
        highlights: [
          'Fat Margaret Tower — scene of a dramatic 1917 massacre',
          'Plague quarter — where 1603 killed thousands in weeks',
          "Kiek in de Kök — tower with walled-up human remains",
          "St. Catherine's Passage — legendary home of the White Lady",
          'Toompea Castle by moonlight',
          'Mulled wine finale at a candle-lit medieval cellar tavern',
        ],
        includes: [
          'Professional storyteller guide in period costume',
          'Entry to medieval cellar tavern finale',
          'Mulled wine or hot cider at the end',
          'Legends booklet to take home',
        ],
        isActive: true,
      },
    }),
  ])

  console.log(`Created ${tours.length} tours`)

  const registrations = [
    {
      tourId: tours[0].id,
      fullName: 'Sarah Mitchell',
      email: 'sarah.mitchell@example.com',
      phone: '+44 7700 900123',
      groupSize: 2,
      country: 'United Kingdom',
      city: 'London',
      status: RegistrationStatus.CONFIRMED,
    },
    {
      tourId: tours[0].id,
      fullName: 'Marcus Weber',
      email: 'marcus.weber@example.de',
      phone: '+49 176 1234567',
      groupSize: 3,
      country: 'Germany',
      city: 'Berlin',
      specialRequests: 'One member has limited mobility, please advise on cobblestone sections.',
      status: RegistrationStatus.CONFIRMED,
    },
    {
      tourId: tours[1].id,
      fullName: 'James O\'Brien',
      email: 'james.obrien@example.ie',
      phone: '+353 87 123 4567',
      groupSize: 3,
      country: 'Ireland',
      city: 'Dublin',
      status: RegistrationStatus.CONFIRMED,
    },
    {
      tourId: tours[1].id,
      fullName: 'Katarzyna Nowak',
      email: 'katarzyna.n@example.pl',
      phone: '+48 500 123 456',
      groupSize: 2,
      country: 'Poland',
      city: 'Warsaw',
      specialRequests: 'Please keep it fun rather than terrifying!',
      status: RegistrationStatus.CONFIRMED,
    },
  ]

  for (const reg of registrations) {
    await prisma.registration.create({ data: reg })
  }

  console.log(`Created ${registrations.length} registrations`)
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
