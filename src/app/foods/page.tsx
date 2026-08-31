import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Utensils, Target, PlusCircle } from "lucide-react";
import Link from "next/link";
import { addFoodAction } from "./actions";

const prisma = new PrismaClient();

export default async function FoodsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const foods = await prisma.foodItem.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" }
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 flex items-center justify-between border-b border-border">
        <h1 className="text-xl font-bold">Food Database</h1>
      </header>

      <main className="p-4 space-y-6">
        <section className="bg-card p-4 rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-4">Add Custom Food</h2>
          <form action={addFoodAction} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <input type="text" name="name" required className="w-full bg-input border border-border rounded p-2" placeholder="e.g. 1 whole egg" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Base Amount</label>
                <input type="number" step="0.1" name="baseAmount" required className="w-full bg-input border border-border rounded p-2" placeholder="e.g. 1" defaultValue="1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Base Unit</label>
                <input type="text" name="baseUnit" required className="w-full bg-input border border-border rounded p-2" placeholder="e.g. egg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Calories (kcal)</label>
                <input type="number" step="0.1" name="calories" required className="w-full bg-input border border-border rounded p-2" placeholder="e.g. 70" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Protein (g)</label>
                <input type="number" step="0.1" name="protein" required className="w-full bg-input border border-border rounded p-2" placeholder="e.g. 6" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Carbs (g)</label>
                <input type="number" step="0.1" name="carbs" required className="w-full bg-input border border-border rounded p-2" placeholder="e.g. 0.5" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Fat (g)</label>
                <input type="number" step="0.1" name="fat" required className="w-full bg-input border border-border rounded p-2" placeholder="e.g. 5" />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md flex items-center justify-center gap-2">
              <PlusCircle className="w-4 h-4" /> Save Food
            </button>
          </form>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Your Foods</h2>
          {foods.length === 0 ? (
            <p className="text-muted-foreground text-sm">No foods added yet.</p>
          ) : (
            foods.map(food => (
              <div key={food.id} className="bg-card p-3 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium">{food.name}</h3>
                  <span className="text-sm font-bold">{food.calories} kcal</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Per {food.baseAmount}{food.baseUnit} • P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                </p>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-card border-t border-border flex justify-around p-3 pb-safe">
        <Link href="/dashboard" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
          <Utensils className="w-6 h-6" />
          <span className="text-[10px] mt-1">Diary</span>
        </Link>
        <Link href="/foods" className="flex flex-col items-center text-primary">
          <Target className="w-6 h-6" />
          <span className="text-[10px] mt-1">Foods</span>
        </Link>
        <Link href="/goals" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
          <Target className="w-6 h-6" />
          <span className="text-[10px] mt-1">Goals</span>
        </Link>
      </nav>
    </div>
  );
}
