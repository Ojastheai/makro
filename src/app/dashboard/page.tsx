import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PlusCircle, Utensils, Target, LogOut } from "lucide-react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      dailyLogs: {
        where: { date: today },
        include: {
          mealItems: {
            include: { foodItem: true }
          }
        }
      }
    }
  });

  if (!user) return null;

  const todayLog = user.dailyLogs[0];
  const mealItems = todayLog?.mealItems || [];

  const consumed = mealItems.reduce(
    (acc, item) => {
      const multiplier = item.amount / item.foodItem.baseAmount;
      return {
        calories: acc.calories + item.foodItem.calories * multiplier,
        protein: acc.protein + item.foodItem.protein * multiplier,
        carbs: acc.carbs + item.foodItem.carbs * multiplier,
        fat: acc.fat + item.foodItem.fat * multiplier,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="p-4 flex items-center justify-between border-b border-border">
        <h1 className="text-xl font-bold">Today's Summary</h1>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="text-muted-foreground p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </header>

      <main className="p-4 space-y-6">
        {/* Macro Progress */}
        <section className="bg-card p-4 rounded-xl border border-border space-y-4 shadow-sm">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-muted-foreground">Calories</p>
              <h2 className="text-2xl font-bold">{Math.round(consumed.calories)} / {user.targetCalories}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="font-medium text-lg">{Math.max(0, user.targetCalories - Math.round(consumed.calories))} kcal</p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${Math.min(100, (consumed.calories / user.targetCalories) * 100)}%` }}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <MacroBar label="Protein" consumed={consumed.protein} target={user.targetProtein} color="bg-blue-500" />
            <MacroBar label="Carbs" consumed={consumed.carbs} target={user.targetCarbs} color="bg-yellow-500" />
            <MacroBar label="Fat" consumed={consumed.fat} target={user.targetFat} color="bg-red-500" />
          </div>
        </section>

        {/* Today's Meals */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Meals
            </h2>
            <Link 
              href="/dashboard/add-meal"
              className="flex items-center gap-1 text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90"
            >
              <PlusCircle className="w-4 h-4" /> Add
            </Link>
          </div>

          {mealItems.length === 0 ? (
            <div className="text-center p-8 bg-card border border-border rounded-xl text-muted-foreground">
              <p>No meals logged today yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mealItems.map(item => (
                <div key={item.id} className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{item.foodItem.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.mealPeriod} • {item.amount}{item.foodItem.baseUnit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{Math.round(item.foodItem.calories * (item.amount / item.foodItem.baseAmount))} kcal</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-card border-t border-border flex justify-around p-3 pb-safe">
        <Link href="/dashboard" className="flex flex-col items-center text-primary">
          <Utensils className="w-6 h-6" />
          <span className="text-[10px] mt-1">Diary</span>
        </Link>
        <Link href="/foods" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
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

function MacroBar({ label, consumed, target, color }: { label: string, consumed: number, target: number, color: string }) {
  const percentage = Math.min(100, (consumed / target) * 100);
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{Math.round(consumed)} / {target}g</p>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
