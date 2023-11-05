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


}

seed();

function getMemorials() {
    return [
        {
            publicId: "a",
            name: "Lebron James",
            obituary: "A famous basketball player.",
            // links: '{"familySearch": "familysearch.org", "publicObituary": "google.com"}',
            birthDate: '6/15/1982',
            deathDate: '5/18/2022',
            mainImage: 'b.png',
            imageId: "12345",
        },
        {
            publicId: "b",
            name: "Dennis Keith Myres",
            obituary: "An icelandic legend, cut from some tough cloth.",
            // links: '{"familySearch": "familysearch.org", "publicObituary": "google.com"}',
            birthDate: '6/15/1938',
            deathDate: '5/18/2017',
            mainImage: 'b.jpeg',
            imageId: "56789",
        },
    ]
}

function getPricing() {
  return [
      {
        publicId: '1001',
        name:     'Brone',   
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
