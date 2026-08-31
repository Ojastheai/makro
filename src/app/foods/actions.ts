"use strict";
"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function addFoodAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const baseAmount = parseFloat(formData.get("baseAmount") as string);
  const baseUnit = formData.get("baseUnit") as string;
  const calories = parseFloat(formData.get("calories") as string);
  const protein = parseFloat(formData.get("protein") as string);
  const carbs = parseFloat(formData.get("carbs") as string);
  const fat = parseFloat(formData.get("fat") as string);

  await prisma.foodItem.create({
    data: {
      userId: session.user.id,
      name,
      baseAmount,
      baseUnit,
      calories,
      protein,
      carbs,
      fat,
    }
  });

  revalidatePath("/foods");
  revalidatePath("/dashboard/add-meal");
}
