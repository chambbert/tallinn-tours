import { PrismaClient, TourCategory, TourDifficulty, RegistrationStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

async function main() {
  console.log('Seeding database...')

  // Clean existing data in correct order
  await prisma.registration.deleteMany()
  await prisma.tour.deleteMany()
  await prisma.admin.deleteMany()

  // Create admin
  const passwordHash = await bcrypt.hash('admin123', 12)
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@tallinn-tours.com',
      passwordHash,
      name: 'Admin',
    },
  })
  console.log(`Created admin: ${admin.email}`)

  // Create tours
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
          'St. Olaf\'s Church — once the tallest building in the world',
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
        title: 'Medieval History & Legends Tour',
        slug: 'medieval-history-legends-tour',
        description:
          "Step back into the Middle Ages on this deep-dive historical tour of Tallinn's extraordinary medieval heritage. The city is one of the best-preserved medieval towns in Northern Europe, and this tour takes you beyond the surface to uncover the political intrigues, trade rivalries, and dramatic sieges that shaped its destiny. Visit the Dominican Monastery founded in 1246, explore the Great Guild Hall where powerful merchants once negotiated deals, and descend into an authentic medieval pharmacy that has operated since 1422. Our historian guide connects the dots between Tallinn's Danish founding, Hanseatic League membership, Teutonic rule, and eventual Swedish and Russian empires — all of which left their mark on the city's streets and architecture.",
        shortDescription:
          'A deep historical journey through 800 years of medieval Tallinn — crusaders, merchants, monks, and the stories written in stone.',
        date: new Date('2026-06-22T11:00:00.000Z'),
        durationMinutes: 180,
        meetingLocation: 'Town Hall Square (Raekoja plats)',
        meetingLocationDetails:
          'Meet at the Old Thomas weather vane statue in the centre of Town Hall Square.',
        price: 35,
        capacity: 12,
        imageUrl: 'https://images.unsplash.com/photo-1548018560-c7196548acd4?w=1200',
        category: TourCategory.HISTORY,
        difficulty: TourDifficulty.EASY,
        language: 'English',
        highlights: [
          'Dominican Monastery founded in 1246 — oldest in Estonia',
          'Raeapteek — one of the oldest continuously operating pharmacies in Europe',
          'Great Guild Hall — 15th-century merchant powerhouse',
          'St. Nicholas Church — Gothic art and medieval altarpieces',
          'Secret passages and hidden layers of the city walls',
          'Tallinn\'s role in the Hanseatic League trade network',
        ],
        includes: [
          'Expert historian guide',
          'Entry to Dominican Monastery cloister',
          'Printed historical timeline booklet',
          'Traditional Estonian honey pastry tasting',
        ],
        isActive: true,
      },
    }),

    prisma.tour.create({
      data: {
        title: 'Tallinn Food & Culture Walk',
        slug: 'tallinn-food-culture-walk',
        description:
          "Taste your way through Tallinn on this culinary and cultural walking tour that combines the best of Estonian cuisine with the city's vibrant food scene. We begin in the Old Town and work our way to the creative Telliskivi district, stopping at carefully curated spots along the way — from a traditional Estonian tavern serving elk stew and black bread, to a cutting-edge food hall showcasing Nordic innovation. You'll sample at least six different tastings including wild berry preserves, smoked Baltic herring, craft beer from a local microbrewery, and world-famous Kalev chocolate. Our guide shares the fascinating story of how Estonian food culture evolved from peasant staples to a celebrated Nordic cuisine, and how a new generation of chefs is reinventing tradition.",
        shortDescription:
          'Six delicious tastings across Old Town and Telliskivi — discover Estonian cuisine from hearty peasant traditions to modern Nordic innovation.',
        date: new Date('2026-07-08T12:00:00.000Z'),
        durationMinutes: 210,
        meetingLocation: 'Viru Gate (Viru värav)',
        meetingLocationDetails:
          'Meet outside the Viru Centre shopping mall entrance facing the medieval gate towers on Viru Street.',
        price: 55,
        capacity: 10,
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
        category: TourCategory.FOOD,
        difficulty: TourDifficulty.EASY,
        language: 'English',
        highlights: [
          'Traditional Estonian black bread tasting',
          'Smoked Baltic herring from a historic market stall',
          'Wild berry jams and preserves at an artisan shop',
          'Elk and wild boar meat dishes at a medieval tavern',
          'Craft beer tasting at a local Tallinn microbrewery',
          'Kalev chocolate — Estonia\'s most beloved confectionery',
        ],
        includes: [
          'All food and drink tastings (6 stops)',
          'Knowledgeable food guide',
          'Recipe card to recreate dishes at home',
          'Discount voucher for food hall',
        ],
        isActive: true,
      },
    }),

    prisma.tour.create({
      data: {
        title: 'Golden Hour Photography Walk',
        slug: 'golden-hour-photography-walk',
        description:
          "Capture the magic of Tallinn's medieval silhouette at the most photogenic time of day on this intimate photography-focused walking tour. Led by a professional photographer with over a decade of experience shooting Tallinn, this small-group tour (max 8 people) focuses on composition, natural light, and finding the hidden angles most visitors miss entirely. We visit Toompea Hill as the sun sinks towards the sea, then descend through the Lower Town to find perfectly framed shots through archways and down lantern-lit lanes. The evening light transforms the terracotta rooftops and Gothic spires into a painter's palette. Suitable for all skill levels — from smartphone photographers to DSLR enthusiasts — you'll leave with a portfolio of images to be proud of.",
        shortDescription:
          'Shoot Tallinn like a pro — small group, professional photographer guide, and access to the city\'s most photogenic hidden angles at golden hour.',
        date: new Date('2026-07-18T19:00:00.000Z'),
        durationMinutes: 150,
        meetingLocation: 'Kohtuotsa Viewing Platform',
        meetingLocationDetails:
          'Take Pikk jalg street up from the Lower Town or Lühike jalg from Toompea. The platform is at the top with views over the red rooftops.',
        price: 45,
        capacity: 8,
        imageUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=1200',
        category: TourCategory.PHOTOGRAPHY,
        difficulty: TourDifficulty.MODERATE,
        language: 'English',
        highlights: [
          'Kohtuotsa and Patkuli viewpoints at golden hour',
          'Hidden medieval courtyards and archway compositions',
          'Long exposure techniques on the city walls',
          'St. Olaf\'s Church spire reflected in puddles',
          'Narrow lantern-lit passages of the Lower Town',
          'Post-processing tips shared via email after the tour',
        ],
        includes: [
          'Professional photographer guide',
          'Composition and technique tips throughout',
          'Locations guide PDF sent after the tour',
          'Post-processing cheat sheet',
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
          'After dark, Tallinn\'s cobblestone streets become a stage for plague doctors, bricked-up prisoners, and the White Lady of Toompea — a chilling evening tour.',
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
          'Kiek in de Kök — tower with walled-up human remains',
          'St. Catherine\'s Passage — legendary home of the White Lady',
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

    prisma.tour.create({
      data: {
        title: 'Kalamaja Neighbourhood Adventure',
        slug: 'kalamaja-neighbourhood-adventure',
        description:
          "Escape the tourist trails and explore Kalamaja — Tallinn's coolest neighbourhood and the beating heart of the city's creative scene. This laid-back walking tour through the wooden house district takes you past colourful 19th-century timber cottages, independent coffee roasters, concept stores, street art murals, and the buzzing Balti Jaama Turg market where locals shop for organic produce, vintage clothing, and street food. We visit the Telliskivi Creative City — a former industrial complex transformed into studios, galleries, and restaurants — and finish with a locally brewed craft beer at a neighbourhood taproom. Kalamaja is authentic, unpretentious, and utterly unlike anything else in the Baltics. This is the Tallinn that Tallinnites actually live in.",
        shortDescription:
          'Tallinn\'s hippest neighbourhood on foot — wooden houses, street art, Balti Jaama market, Telliskivi studios, and craft beer among the locals.',
        date: new Date('2026-09-05T10:00:00.000Z'),
        durationMinutes: 180,
        meetingLocation: 'Balti Jaama Turg (Baltic Station Market)',
        meetingLocationDetails:
          'Meet at the main entrance of Balti Jaama Turg market on Kopli Street, directly across from the Baltic train station.',
        price: 25,
        capacity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
        category: TourCategory.ADVENTURE,
        difficulty: TourDifficulty.MODERATE,
        language: 'English',
        highlights: [
          'Kalamaja wooden architecture — 19th-century Estonian vernacular',
          'Telliskivi Creative City — galleries, studios, and design shops',
          'Balti Jaama Turg — Tallinn\'s best local market',
          'Street art and murals by Estonian artists',
          'Sea plane harbour panorama over Tallinn Bay',
          'Craft beer tasting at a local Kalamaja taproom',
        ],
        includes: [
          'Local neighbourhood guide',
          'Market tasting stop (cheese, bread, seasonal produce)',
          'Craft beer tasting at the end',
          'Neighbourhood map with recommended spots',
        ],
        isActive: true,
      },
    }),
  ])

  console.log(`Created ${tours.length} tours`)

  // Create registrations for each tour
  const registrationData = [
    // Old Town Walking Tour
    {
      tourIndex: 0,
      registrations: [
        {
          fullName: 'Sarah Mitchell',
          email: 'sarah.mitchell@example.com',
          phone: '+44 7700 900123',
          groupSize: 2,
          country: 'United Kingdom',
          city: 'London',
          status: RegistrationStatus.CONFIRMED,
        },
        {
          fullName: 'Marcus Weber',
          email: 'marcus.weber@example.de',
          phone: '+49 176 1234567',
          groupSize: 3,
          country: 'Germany',
          city: 'Berlin',
          specialRequests: 'One member of the group has limited mobility, please advise on cobblestone sections.',
          status: RegistrationStatus.CONFIRMED,
        },
        {
          fullName: 'Emma Larsson',
          email: 'emma.larsson@example.se',
          phone: '+46 70 123 4567',
          groupSize: 1,
          country: 'Sweden',
          city: 'Stockholm',
          status: RegistrationStatus.CONFIRMED,
        },
      ],
    },
    // Medieval History Tour
    {
      tourIndex: 1,
      registrations: [
        {
          fullName: 'David Chen',
          email: 'david.chen@example.com',
          phone: '+1 555 234 5678',
          groupSize: 2,
          country: 'United States',
          city: 'San Francisco',
          specialRequests: 'Very interested in the Hanseatic League connections. Please go into detail!',
          status: RegistrationStatus.CONFIRMED,
        },
        {
          fullName: 'Aino Virtanen',
          email: 'aino.v@example.fi',
          phone: '+358 40 123 4567',
          groupSize: 4,
          country: 'Finland',
          city: 'Helsinki',
          status: RegistrationStatus.CONFIRMED,
        },
      ],
    },
    // Food & Culture Walk
    {
      tourIndex: 2,
      registrations: [
        {
          fullName: 'Isabella Rossi',
          email: 'isabella.rossi@example.it',
          phone: '+39 340 123 4567',
          groupSize: 2,
          country: 'Italy',
          city: 'Rome',
          specialRequests: 'One vegetarian in the group.',
          status: RegistrationStatus.CONFIRMED,
        },
        {
          fullName: 'Pieter van den Berg',
          email: 'pieter.vdb@example.nl',
          phone: '+31 6 12345678',
          groupSize: 2,
          country: 'Netherlands',
          city: 'Amsterdam',
          status: RegistrationStatus.CONFIRMED,
        },
        {
          fullName: 'Yuki Tanaka',
          email: 'yuki.tanaka@example.jp',
          phone: '+81 90 1234 5678',
          groupSize: 1,
          country: 'Japan',
          city: 'Tokyo',
          specialRequests: 'Shellfish allergy — please confirm this is manageable.',
          status: RegistrationStatus.CANCELLED,
        },
      ],
    },
    // Photography Walk
    {
      tourIndex: 3,
      registrations: [
        {
          fullName: 'Luca Bianchi',
          email: 'luca.bianchi@example.it',
          phone: '+39 338 987 6543',
          groupSize: 1,
          country: 'Italy',
          city: 'Milan',
          specialRequests: 'Bringing a Sony A7R IV and a drone — is drone use permitted at the viewpoints?',
          status: RegistrationStatus.CONFIRMED,
        },
        {
          fullName: 'Sophie Dubois',
          email: 'sophie.dubois@example.fr',
          phone: '+33 6 12 34 56 78',
          groupSize: 2,
          country: 'France',
          city: 'Paris',
          status: RegistrationStatus.CONFIRMED,
        },
      ],
    },
    // Evening Ghost Tour
    {
      tourIndex: 4,
      registrations: [
        {
          fullName: 'James O\'Brien',
          email: 'james.obrien@example.ie',
          phone: '+353 87 123 4567',
          groupSize: 3,
          country: 'Ireland',
          city: 'Dublin',
          status: RegistrationStatus.CONFIRMED,
        },
        {
          fullName: 'Katarzyna Nowak',
          email: 'katarzyna.n@example.pl',
          phone: '+48 500 123 456',
          groupSize: 2,
          country: 'Poland',
          city: 'Warsaw',
          specialRequests: 'Please note we are easily scared — keep it fun rather than terrifying!',
          status: RegistrationStatus.CONFIRMED,
        },
        {
          fullName: 'Aleksander Kovacs',
          email: 'aleksander.k@example.hu',
          phone: '+36 30 123 4567',
          groupSize: 1,
          country: 'Hungary',
          city: 'Budapest',
          status: RegistrationStatus.CONFIRMED,
        },
      ],
    },
    // Kalamaja Adventure
    {
      tourIndex: 5,
      registrations: [
        {
          fullName: 'Fiona MacLeod',
          email: 'fiona.macleod@example.co.uk',
          phone: '+44 7800 123456',
          groupSize: 2,
          country: 'United Kingdom',
          city: 'Edinburgh',
          status: RegistrationStatus.CONFIRMED,
        },
        {
          fullName: 'Tobias Müller',
          email: 'tobias.mueller@example.de',
          phone: '+49 152 9876543',
          groupSize: 4,
          country: 'Germany',
          city: 'Hamburg',
          specialRequests: 'One member uses a wheelchair — is the route accessible?',
          status: RegistrationStatus.PENDING,
        },
      ],
    },
  ]

  let totalRegistrations = 0
  for (const group of registrationData) {
    const tour = tours[group.tourIndex]
    for (const reg of group.registrations) {
      await prisma.registration.create({
        data: {
          tourId: tour.id,
          ...reg,
        },
      })
      totalRegistrations++
    }
  }

  console.log(`Created ${totalRegistrations} registrations`)
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
