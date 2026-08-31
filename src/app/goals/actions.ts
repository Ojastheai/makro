"use strict";
"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function updateGoalsAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const targetCalories = parseInt(formData.get("targetCalories") as string);
  const targetProtein = parseInt(formData.get("targetProtein") as string);
  const targetCarbs = parseInt(formData.get("targetCarbs") as string);
  const targetFat = parseInt(formData.get("targetFat") as string);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/goals");
}

export async function logWeightAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const weight = parseFloat(formData.get("weight") as string);

  await prisma.weightLog.create({
    data: {
      userId: session.user.id,
      weight,
    }
  });

  revalidatePath("/goals");
}
