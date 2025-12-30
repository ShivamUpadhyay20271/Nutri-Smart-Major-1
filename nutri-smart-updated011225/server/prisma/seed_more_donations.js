const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const BHOPAL_LAT = 23.2599;
const BHOPAL_LNG = 77.4126;

function getRandomLocation() {
  // Generate random offset within ~5-10km
  const latOffset = (Math.random() - 0.5) * 0.1;
  const lngOffset = (Math.random() - 0.5) * 0.1;
  return {
    latitude: BHOPAL_LAT + latOffset,
    longitude: BHOPAL_LNG + lngOffset,
  };
}

async function main() {
  console.log("Start seeding 20 more donations...");

  // Fetch existing users
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.error("No users found. Please run seed_demo.js first.");
    return;
  }

  const foodItems = [
    "Rice",
    "Wheat",
    "Vegetables",
    "Fruits",
    "Bread",
    "Milk",
    "Pulses",
    "Canned Food",
    "Biscuits",
  ];
  const categories = [
    "Non-perishable",
    "Fresh Produce",
    "Bakery",
    "Dairy",
    "Prepared Meals",
  ];

  for (let i = 1; i <= 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const loc = getRandomLocation();
    const isGaushalaDonation = Math.random() > 0.5;
    const type = isGaushalaDonation ? "Gaushala" : "NGO";
    const item = foodItems[Math.floor(Math.random() * foodItems.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    await prisma.donation.create({
      data: {
        userId: user.id,
        donationType: type,
        foodItems: `${item} and others`,
        foodCategory: category,
        quantity: `${Math.floor(Math.random() * 20) + 1} kg`,
        expiry: "2025-12-31",
        preparationDate: "2025-12-01",
        preparationTime: "12:00 PM",
        location: `Extra Donation Location ${i}, Bhopal`,
        latitude: loc.latitude,
        longitude: loc.longitude,
        description: `Extra donation of ${item}.`,
        contactPhone: user.phone,
        pickupTimes: "Morning 9-11 AM",
        hasAllergens: false,
        foodImage: "https://placehold.co/400",
        status: "pending",
      },
    });
    console.log(`Created Extra Donation ${i} (${type})`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
