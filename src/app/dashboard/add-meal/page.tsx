import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { logMealAction } from "./actions";

const prisma = new PrismaClient();

export default async function AddMealPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const foods = await prisma.foodItem.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" }
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 flex items-center gap-4 border-b border-border">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
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
          <form action={logMealAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Food Item</label>
              <select 
                name="foodItemId" 
                required 
                className="w-full bg-input border border-border rounded-md p-3 text-foreground"
              >
                <option value="">Select a food...</option>
                {foods.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.calories}kcal per {f.baseAmount}{f.baseUnit})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meal Period</label>
              <select 
                name="mealPeriod" 
                required
                className="w-full bg-input border border-border rounded-md p-3 text-foreground"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
                <option value="Pre-Workout">Pre-Workout</option>
                <option value="Post-Workout">Post-Workout</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <input 
                type="number" 
                step="0.1" 
                name="amount" 
                required 
                placeholder="e.g. 1, 100, 2"
                className="w-full bg-input border border-border rounded-md p-3 text-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Enter the amount matching the food's unit (e.g., if base unit is grams, enter grams).
              </p>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium"
            >
              Log Meal
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
