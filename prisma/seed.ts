import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create categories and their subcategories
  const categories = [
    {
      name: 'Eco Tours',
      description: 'Environmentally conscious tours focusing on nature and sustainability',
      subcategories: [
        'Wildlife Watching',
        'Bird Watching',
        'Nature Photography',
        'Forest Hiking',
        'Marine Conservation',
        'Eco-Friendly Transportation'
      ]
    },
    {
      name: 'Adventures',
      description: 'Thrilling outdoor activities and adventure sports',
      subcategories: [
        'Rock Climbing',
        'White Water Rafting',
        'Mountain Biking',
        'Paragliding',
        'Scuba Diving',
        'Trekking',
        'Zip-lining'
      ]
    },
    {
      name: 'Eco Stays',
      description: 'Sustainable accommodation options',
      subcategories: [
        'Eco Lodges',
        'Tree Houses',
        'Camping',
        'Farm Stays',
        'Solar Powered Accommodations',
        'Zero Waste Hotels'
      ]
    },
    {
      name: 'Heritage Tours',
      description: 'Cultural and historical site visits',
      subcategories: [
        'Historical Monuments',
        'Archaeological Sites',
        'Museums',
        'Traditional Villages',
        'UNESCO World Heritage Sites',
        'Cultural Landmarks'
      ]
    },
    {
      name: 'Cultural Tours',
      description: 'Immersive cultural experiences',
      subcategories: [
        'Local Festivals',
        'Traditional Crafts',
        'Cultural Performances',
        'Local Cuisine',
        'Art Galleries',
        'Traditional Music'
      ]
    },
    {
      name: 'Wellness Tours',
      description: 'Health and wellness focused experiences',
      subcategories: [
        'Yoga Retreats',
        'Meditation Centers',
        'Spa Treatments',
        'Ayurvedic Therapies',
        'Mindfulness Workshops',
        'Nature Therapy'
      ]
    },
    {
      name: 'Community Exploration',
      description: 'Community-based tourism experiences',
      subcategories: [
        'Village Tours',
        'Local Community Projects',
        'Social Impact Tours',
        'Community Workshops',
        'Local Guide Experiences',
        'Cultural Exchange Programs'
      ]
    },
    {
      name: 'Sustainable Tour Itineraries',
      description: 'Comprehensive sustainable travel packages',
      subcategories: [
        'Multi-day Eco Tours',
        'Carbon Neutral Travel',
        'Sustainable Transportation',
        'Green Travel Packages',
        'Eco-Friendly Itineraries',
        'Sustainable Travel Planning'
      ]
    },
    {
      name: 'Buy from Local',
      description: 'Supporting local businesses and artisans',
      subcategories: [
        'Local Markets',
        'Artisan Workshops',
        'Local Food Tours',
        'Handicraft Shopping',
        'Local Product Tours',
        'Fair Trade Shopping'
      ]
    },
    {
      name: 'Learning Trips',
      description: 'Educational and skill-building experiences',
      subcategories: [
        'Language Learning',
        'Cooking Classes',
        'Traditional Skills',
        'Environmental Education',
        'Cultural Workshops',
        'Professional Development'
      ]
    }
  ]

  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: {
        name: categoryData.name,
        description: categoryData.description,
      },
    })

    for (const subcategoryName of categoryData.subcategories) {
      await prisma.subcategory.upsert({
        where: {
          name_categoryId: {
            name: subcategoryName,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          name: subcategoryName,
          categoryId: category.id,
        },
      })
    }
  }

  console.log('Categories and subcategories seeded successfully!')

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Create 1 Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sustainabletourism.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@sustainabletourism.com',
      password: hashedPassword,
      role: 'ADMIN',
      bio: 'Platform administrator for sustainable tourism',
      location: 'Global',
      phone: '+1-555-0001',
      isVerified: true,
    },
  })

  // Create 5 Service Providers
  const serviceProviders = [
    {
      name: 'Eco Adventures Co.',
      email: 'contact@ecoadventures.com',
      businessName: 'Eco Adventures Co.',
      businessType: 'Tour Operator',
      businessLicense: 'EA-2024-001',
      businessAddress: '123 Green Street, Eco City, EC 12345',
      businessPhone: '+1-555-1001',
      businessEmail: 'contact@ecoadventures.com',
      businessWebsite: 'https://ecoadventures.com',
      businessDescription: 'Leading provider of sustainable adventure tours',
      isBusinessVerified: true,
      bio: 'Professional eco-tourism service provider',
      location: 'Eco City, EC',
      phone: '+1-555-1001',
      isVerified: true,
    },
    {
      name: 'Green Stay Lodges',
      email: 'info@greenstay.com',
      businessName: 'Green Stay Lodges',
      businessType: 'Accommodation',
      businessLicense: 'GS-2024-002',
      businessAddress: '456 Nature Lane, Forest Town, FT 67890',
      businessPhone: '+1-555-1002',
      businessEmail: 'info@greenstay.com',
      businessWebsite: 'https://greenstay.com',
      businessDescription: 'Sustainable eco-lodges in pristine natural locations',
      isBusinessVerified: true,
      bio: 'Eco-friendly accommodation specialist',
      location: 'Forest Town, FT',
      phone: '+1-555-1002',
      isVerified: true,
    },
    {
      name: 'Cultural Heritage Tours',
      email: 'tours@culturalheritage.com',
      businessName: 'Cultural Heritage Tours',
      businessType: 'Tour Guide Service',
      businessLicense: 'CH-2024-003',
      businessAddress: '789 Heritage Road, Culture City, CC 11111',
      businessPhone: '+1-555-1003',
      businessEmail: 'tours@culturalheritage.com',
      businessWebsite: 'https://culturalheritage.com',
      businessDescription: 'Authentic cultural and heritage tour experiences',
      isBusinessVerified: true,
      bio: 'Cultural heritage and local community expert',
      location: 'Culture City, CC',
      phone: '+1-555-1003',
      isVerified: true,
    },
    {
      name: 'Wellness Retreat Center',
      email: 'retreat@wellnesscenter.com',
      businessName: 'Wellness Retreat Center',
      businessType: 'Wellness Facility',
      businessLicense: 'WR-2024-004',
      businessAddress: '321 Serenity Street, Wellness Valley, WV 22222',
      businessPhone: '+1-555-1004',
      businessEmail: 'retreat@wellnesscenter.com',
      businessWebsite: 'https://wellnesscenter.com',
      businessDescription: 'Holistic wellness and mindfulness retreats',
      isBusinessVerified: true,
      bio: 'Wellness and mindfulness retreat specialist',
      location: 'Wellness Valley, WV',
      phone: '+1-555-1004',
      isVerified: true,
    },
    {
      name: 'Local Artisan Collective',
      email: 'artisans@localcollective.com',
      businessName: 'Local Artisan Collective',
      businessType: 'Artisan Network',
      businessLicense: 'LA-2024-005',
      businessAddress: '654 Craft Avenue, Art District, AD 33333',
      businessPhone: '+1-555-1005',
      businessEmail: 'artisans@localcollective.com',
      businessWebsite: 'https://localcollective.com',
      businessDescription: 'Supporting local artisans and traditional crafts',
      isBusinessVerified: true,
      bio: 'Local artisan and traditional craft specialist',
      location: 'Art District, AD',
      phone: '+1-555-1005',
      isVerified: true,
    },
  ]

  for (const spData of serviceProviders) {
    await prisma.user.upsert({
      where: { email: spData.email },
      update: {},
      create: {
        ...spData,
        password: hashedPassword,
        role: 'SERVICE_PROVIDER',
      },
    })
  }

  // Create 10 Regular Users
  const regularUsers = [
    {
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      bio: 'Passionate about sustainable travel and eco-tourism',
      location: 'Seattle, WA',
      phone: '+1-555-2001',
      isVerified: true,
    },
    {
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      bio: 'Adventure seeker and nature lover',
      location: 'Portland, OR',
      phone: '+1-555-2002',
      isVerified: true,
    },
    {
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      bio: 'Cultural enthusiast and heritage explorer',
      location: 'San Francisco, CA',
      phone: '+1-555-2003',
      isVerified: true,
    },
    {
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      bio: 'Wellness traveler seeking mindful experiences',
      location: 'Austin, TX',
      phone: '+1-555-2004',
      isVerified: true,
    },
    {
      name: 'Emma Brown',
      email: 'emma.brown@email.com',
      bio: 'Community-focused traveler and local supporter',
      location: 'Denver, CO',
      phone: '+1-555-2005',
      isVerified: true,
    },
    {
      name: 'Frank Miller',
      email: 'frank.miller@email.com',
      bio: 'Learning-focused traveler and skill builder',
      location: 'Miami, FL',
      phone: '+1-555-2006',
      isVerified: true,
    },
    {
      name: 'Grace Lee',
      email: 'grace.lee@email.com',
      bio: 'Eco-conscious traveler and sustainability advocate',
      location: 'Boston, MA',
      phone: '+1-555-2007',
      isVerified: true,
    },
    {
      name: 'Henry Taylor',
      email: 'henry.taylor@email.com',
      bio: 'Adventure photographer and nature documentarian',
      location: 'Phoenix, AZ',
      phone: '+1-555-2008',
      isVerified: true,
    },
    {
      name: 'Iris Garcia',
      email: 'iris.garcia@email.com',
      bio: 'Cultural exchange enthusiast and language learner',
      location: 'Chicago, IL',
      phone: '+1-555-2009',
      isVerified: true,
    },
    {
      name: 'Jack Anderson',
      email: 'jack.anderson@email.com',
      bio: 'Sustainable lifestyle advocate and green traveler',
      location: 'Nashville, TN',
      phone: '+1-555-2010',
      isVerified: true,
    },
  ]

  for (const userData of regularUsers) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
        role: 'USER',
      },
    })
  }

  console.log('Test users seeded successfully!')
  console.log('Created:')
  console.log('- 1 Admin user (admin@sustainabletourism.com)')
  console.log('- 5 Service Provider users')
  console.log('- 10 Regular users')
  console.log('All users have password: password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
