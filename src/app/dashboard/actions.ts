"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function deleteMealAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Ensure the meal belongs to the user
  const mealItem = await prisma.mealItem.findUnique({
    where: { id },
    include: { dailyLog: true }
  });

  if (!mealItem || mealItem.dailyLog.userId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  await prisma.mealItem.delete({
    where: { id }
  });

  revalidatePath("/dashboard");
}

export async function editMealAction(id: string, amount: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Ensure the meal belongs to the user
  const mealItem = await prisma.mealItem.findUnique({
    where: { id },
    include: { dailyLog: true }
  });

  if (!mealItem || mealItem.dailyLog.userId !== session.user.id) {
    throw new Error("Not found or unauthorized");
  }

  await prisma.mealItem.update({
    where: { id },
    data: { amount }
  });

  revalidatePath("/dashboard");
}
