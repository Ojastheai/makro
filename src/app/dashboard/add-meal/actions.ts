"use strict";
"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function logMealAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const foodItemId = formData.get("foodItemId") as string;
  const mealPeriod = formData.get("mealPeriod") as string;
  const amount = parseFloat(formData.get("amount") as string);

  if (!foodItemId || !mealPeriod || isNaN(amount)) {
    throw new Error("Invalid input");
  }

  const date = formData.get("date") as string || new Date().toISOString().split("T")[0];

  // Find or create daily log for that specific date
  let dailyLog = await prisma.dailyLog.findUnique({
    where: {
      userId_date: {
        userId: session.user.id,
        date,
      }
    }
  });

  if (!dailyLog) {
    dailyLog = await prisma.dailyLog.create({
      data: {
        userId: session.user.id,
        date,
      }
    });
  }

  await prisma.mealItem.create({
    data: {
      dailyLogId: dailyLog.id,
      foodItemId,
      mealPeriod,
      amount,
    }
  });

  redirect(`/dashboard?date=${date}`);
}
