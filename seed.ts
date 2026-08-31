import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const foods = [
  { name: "Whole Egg", calories: 70, protein: 6, carbs: 0.5, fat: 5, baseAmount: 1, baseUnit: " egg" },
  { name: "Egg White", calories: 17, protein: 3.6, carbs: 0.2, fat: 0, baseAmount: 1, baseUnit: " egg white" },
  { name: "Amul Slim 'n' Trim Milk", calories: 46, protein: 3.2, carbs: 5, fat: 1.5, baseAmount: 100, baseUnit: "ml" },
  { name: "Whey Protein", calories: 120, protein: 24, carbs: 3, fat: 2, baseAmount: 1, baseUnit: " scoop" },
  { name: "Milky Mist High Protein Paneer", calories: 170, protein: 25, carbs: 4, fat: 6, baseAmount: 100, baseUnit: "g" },
  { name: "Almonds", calories: 58, protein: 2.1, carbs: 2.2, fat: 5, baseAmount: 10, baseUnit: "g" },
  { name: "Whole-wheat Atta Bread", calories: 70, protein: 3, carbs: 12, fat: 1, baseAmount: 1, baseUnit: " slice" },
  { name: "Ghee", calories: 45, protein: 0, carbs: 0, fat: 5, baseAmount: 1, baseUnit: " tsp" },
  { name: "Butter", calories: 34, protein: 0, carbs: 0, fat: 3.8, baseAmount: 1, baseUnit: " tsp" },
  { name: "Roti (without ghee/butter)", calories: 110, protein: 3.5, carbs: 20, fat: 1, baseAmount: 1, baseUnit: " roti" },
  { name: "Medium Banana", calories: 100, protein: 1, carbs: 25, fat: 0.3, baseAmount: 1, baseUnit: " banana" },
  { name: "Poha (with peanuts)", calories: 250, protein: 5, carbs: 40, fat: 7, baseAmount: 1, baseUnit: " bowl" },
  { name: "Yellow Dal", calories: 220, protein: 11, carbs: 32, fat: 5, baseAmount: 1, baseUnit: " bowl" },
  { name: "Ghiya Sabzi", calories: 120, protein: 3, carbs: 12, fat: 6, baseAmount: 1, baseUnit: " large bowl" },
  { name: "Thin Paratha (17-18cm)", calories: 220, protein: 5, carbs: 30, fat: 9, baseAmount: 1, baseUnit: " paratha" },
  { name: "Milk Coffee (Slim milk + 1.5 tsp sugar)", calories: 145, protein: 8, carbs: 19, fat: 4, baseAmount: 250, baseUnit: "ml" },
  { name: "Protein Shake (Whey + Milk + Coffee)", calories: 258, protein: 33.6, carbs: 18, fat: 6.5, baseAmount: 1, baseUnit: " shake" }
];

async function main() {
  const email = "ojastheai@gmail.com";
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.error(`User with email ${email} not found! Please log into the app first.`);
    return;
  }

  console.log(`Found user ${user.id}. Injecting foods...`);

  let addedCount = 0;
  for (const food of foods) {
    // Check if it already exists to avoid duplicates
    const existing = await prisma.foodItem.findFirst({
      where: { userId: user.id, name: food.name }
    });
    
    if (!existing) {
      await prisma.foodItem.create({
        data: {
          ...food,
          userId: user.id
        }
      });
      addedCount++;
    }
  }

  console.log(`Successfully added ${addedCount} foods!`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
