const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

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
  console.log("Start seeding demo data...");

  const password = await bcrypt.hash("12345678", 10);

  // --- Create Users ---
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@gmail.com` },
      update: {},
      create: {
        fullName: `Demo User ${i}`,
        email: `user${i}@gmail.com`,
        phone: `987654320${i}`,
        password: password,
        address: `User Address ${i}, Bhopal`,
        role: "USER",
      },
    });
    users.push(user);
    console.log(`Created User: ${user.email}`);
  }

  // --- Create NGOs ---
  for (let i = 1; i <= 5; i++) {
    const loc = getRandomLocation();
    const ngo = await prisma.ngo.upsert({
      where: { email: `ngo${i}@gmail.com` },
      update: {},
      create: {
        role: "NGO",
        ngoName: `Helping Hands NGO ${i}`,
        ngoType: "Food Bank",
        category: "NGO",
        registrationNumber: `NGO-REG-${i}`,
        yearEstablished: "2010",
        website: `https://ngo${i}.org`,
        fullName: `NGO Admin ${i}`,
        email: `ngo${i}@gmail.com`,
        password: password,
        phone: `987654330${i}`,
        designation: "Director",
        streetAddress: `NGO Street ${i}`,
        city: "Bhopal",
        state: "Madhya Pradesh",
        pincode: "462001",
        latitude: loc.latitude,
        longitude: loc.longitude,
        areasServed: "Bhopal City",
        operatingHours: "9 AM - 6 PM",
        daysAvailable: "Mon-Sat",
        canPickup: true,
        registrationCertificate: "https://placehold.co/400",
        addressProof: "https://placehold.co/400",
        agreeTerms: true,
      },
    });
    console.log(`Created NGO: ${ngo.email}`);
  }

  // --- Create Gaushalas ---
  for (let i = 1; i <= 5; i++) {
    const loc = getRandomLocation();
    const gaushala = await prisma.ngo.upsert({
      where: { email: `gaushala${i}@gmail.com` },
      update: {},
      create: {
        role: "NGO",
        ngoName: `Shri Krishna Gaushala ${i}`,
        ngoType: "Shelter Home",
        category: "Gaushala",
        registrationNumber: `GAU-REG-${i}`,
        yearEstablished: "2015",
        website: `https://gaushala${i}.org`,
        fullName: `Gaushala Caretaker ${i}`,
        email: `gaushala${i}@gmail.com`,
        password: password,
        phone: `987654340${i}`,
        designation: "Manager",
        streetAddress: `Gaushala Road ${i}`,
        city: "Bhopal",
        state: "Madhya Pradesh",
        pincode: "462001",
        latitude: loc.latitude,
        longitude: loc.longitude,
        areasServed: "Bhopal Outskirts",
        operatingHours: "6 AM - 8 PM",
        daysAvailable: "All Days",
        canPickup: true,
        registrationCertificate: "https://placehold.co/400",
        addressProof: "https://placehold.co/400",
        agreeTerms: true,
      },
    });
    console.log(`Created Gaushala: ${gaushala.email}`);
  }

  // --- Create Donations ---
  const foodItems = [
    "Rice",
    "Wheat",
    "Vegetables",
    "Fruits",
    "Bread",
    "Milk",
    "Pulses",
  ];
  const categories = ["Non-perishable", "Fresh Produce", "Bakery", "Dairy"];

  for (let i = 1; i <= 15; i++) {
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
        quantity: `${Math.floor(Math.random() * 10) + 1} kg`,
        expiry: "2025-12-31",
        preparationDate: "2025-11-30",
        preparationTime: "10:00 AM",
        location: `Donation Location ${i}, Bhopal`,
        latitude: loc.latitude,
        longitude: loc.longitude,
        description: `Fresh ${item} available for donation.`,
        contactPhone: user.phone,
        pickupTimes: "Evening 5-7 PM",
        hasAllergens: false,
        foodImage: "https://placehold.co/400",
        status: "pending",
      },
    });
    console.log(`Created Donation ${i} (${type})`);
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
