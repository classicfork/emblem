import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await db.user.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  await db.pricing.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  await db.memorialImages.deleteMany().catch(() => {
    // no worries if it doesn't exist yet
  });

  const dallin = await db.user.create({
    data: {
      email: "dallin@gmail.com",
      firstName: "Dallin",
      lastName: "Murphy",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });

  await Promise.all(
    getMemorials().map((memorial) => {
      console.log(memorial);
      if (!memorial.name) {
        return db.memorial.create({ data: { ...memorial } });
      }
      return db.memorial.create({ data: { ...memorial, ownerId: dallin.id} });
    }),
  );

  await Promise.all(
    getPricing().map((price) => {
      console.log(price);
      return db.pricing.create({ data: { ...price } });
    }),
  )

  await Promise.all(
    getMemorialImages().map((image) => {
      console.log(image);
      return db.memorialImages.create({ data: { ...image } });
    }),
  )
}

seed();

function getMemorials() {
  return [
    {
      publicId: "a",
      name: "Lebron James",
      description: 'LeBron James is an American basketball player with the Los Angeles Lakers. James first garnered national attention as the top high school basketball player in the country. With his unique combination of size, athleticism and court vision, he became a four-time NBA MVP.',
      obituary: "A famous basketball player.",
      // links: '{"familySearch": "familysearch.org", "publicObituary": "google.com"}',
      birthDate: '6/15/1982',
      deathDate: '5/18/2022',
      mainImage: 'b.png',
    },
    {
      publicId: "b",
      name: "Dennis Keith Myres",
      description: "Dennis Keith was born in Mountain, North Dakota to an Icelandic family, and as a young boy moved to National City, California (part of San Diego). He joined the Church of Jesus Christ of Latter-day Saints in his early 20's, and his testimony guided his path in fatherhood, work, and his dealings with everyone around him. His wife of over 50 years, Paula Haymond, 9 children, and over 50 grandchildren survive him. His great legacy lives on in all of them.",
      obituary: "An icelandic legend, cut from some tough cloth.",
      // links: '{"familySearch": "familysearch.org", "publicObituary": "google.com"}',
      birthDate: '6/15/1938',
      deathDate: '5/18/2017',
      mainImage: 'b.jpeg',
    },
  ]
}

function getPricing() {
  return [
    {
      publicId: '1001',
      name:     'Bronze',   
      price:     '4.99',
      photo:     'Memorial Photo',
      obituary:  'Obituary',
      links:     'Unlimited Links',
      stories:   '# Stories',
      visits:    'No Visits',
    },
    {
      publicId: '1002',
      name:     'Silver',   
      price:     '9.99',
      photo:     'Memorial Photo',
      obituary:  'Obituary',
      links:     'Unlimited Links',
      stories:   '# Stories',
      visits:    'No Visits',
    },
    {
      publicId: '1003',
      name:     'Gold',   
      price:     '14.99',
      photo:     'Memorial Photo',
      obituary:  'Obituary',
      links:     'Unlimited Links',
      stories:   'Unlimited Stories',
      visits:    'Unlimited Visits',
    },
  ]
}

function getMemorialImages() {
  return [
    {
      memorialId: 'b',
      fileName: 'bob.png',
      name: 'Bob Portrait',
      description: '1986 Christmas picture',
      url: 'http://localhost:3000'
    },
    {
      memorialId: 'b',
      fileName: 'remember.jpg',
      name: 'Grand Canyon Trip',
      description: '1992 Grand Canyon trip - my favorite picture',
      url: 'http://localhost:3000'
    },
    {
      memorialId: 'b',
      fileName: 'memory1.png',
      name: 'My Favorite Memory',
      description: 'Putting together a dollhouse',
      url: 'http://localhost:3000'
    },
    {
      memorialId: 'a',
      fileName: 'james.jpg',
      name: '2006 Championship',
      description: 'James a his first tournament', 
      url: 'http://localhost:3000'
    },
    {
      memorialId: 'a',
      fileName: 'graduation.png',
      name: 'Graduation',
      description: 'College graduation photo - so proud!',  
      url: 'http://localhost:3000'
    },
  ]
}

