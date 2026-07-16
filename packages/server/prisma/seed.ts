import { prisma } from "./client";

async function main() {
  const product = await prisma.product.create({
    data: {
      name: "WonderWorld Annual Pass",
      description:
        "Unlimited park entry for a full year, plus parking and special discounts.",
      price: 899,
      reviews: {
        create: [
          {
            author: "Maria S.",
            rating: 5,
            content:
              "Best purchase we made all year! We've been three times already and the kids love the FastLane perks.",
          },
          {
            author: "James T.",
            rating: 4,
            content:
              "Great value if you visit often, though parking still felt like an extra hassle even with the discount.",
          },
          {
            author: "Priya K.",
            rating: 2,
            content:
              "Wait times were longer than expected during the summer, and a couple of the rides we wanted were closed for maintenance both visits.",
          },
        ],
      },
    },
  });

  console.log(`Seeded product ${product.id} with reviews.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
