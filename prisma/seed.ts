import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await db.user.deleteMany().catch(() => {
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
    })
  );
}

seed();

function getMemorials() {
    return [
        {
            publicId: "a",
        },
        {
            publicId: "b",
            name: "Dennis Keith Myres",
            obituary: "An icelandic legend, cut from some tough cloth.",
            links: '{"familySearch": "familysearch.org", "publicObituary": "google.com"}',
            birthDate: '6/15/1938',
            deathDate: '5/18/2017',
            mainImage: 'b.jpeg'
        },
        {
            publicId: "c",
        },
        {
            publicId: "d",
        },
    ]
}
