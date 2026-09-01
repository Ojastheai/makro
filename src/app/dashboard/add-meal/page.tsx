import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { logMealAction } from "./actions";
import ClientLogMealForm from "./client-form";

const prisma = new PrismaClient();

export default async function AddMealPage({ searchParams }: { searchParams: Promise<{ date?: string, period?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const params = await searchParams;
  const date = params?.date || new Date().toISOString().split("T")[0];
  const period = params?.period || "Breakfast";

  const foods = await prisma.foodItem.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" }
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 flex items-center gap-4 border-b border-border">
        <Link href={`/dashboard?date=${date}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">Add Meal</h1>
      </header>

      <main className="p-4">
        {foods.length === 0 ? (
          <div className="text-center p-8 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground mb-4">You have no foods in your database.</p>
            <Link href="/foods" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Add Foods
            </Link>
          </div>
        ) : (
          <ClientLogMealForm foods={foods} initialDate={date} initialPeriod={period} />
        )}
      </main>
    </div>
  );
}
