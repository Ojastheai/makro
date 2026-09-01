import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PlusCircle, Target, LogOut } from "lucide-react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { CalendarHeader } from "./calendar-header";
import { MealItem } from "./meal-item";

const prisma = new PrismaClient();

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  // Parse the date searchParam
  const params = await searchParams;
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const date = params?.date || today;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      dailyLogs: {
        where: { date },
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

  const mealPeriods = ["Breakfast", "Lunch", "Dinner", "Snacks", "Pre-Workout", "Post-Workout"];

  // Group mealItems by mealPeriod
  const groupedMeals = mealPeriods.map(period => {
    const items = mealItems.filter(item => item.mealPeriod === period);
    const macros = items.reduce((acc, item) => {
      const multiplier = item.amount / item.foodItem.baseAmount;
      return {
        calories: acc.calories + item.foodItem.calories * multiplier,
        protein: acc.protein + item.foodItem.protein * multiplier,
        carbs: acc.carbs + item.foodItem.carbs * multiplier,
        fat: acc.fat + item.foodItem.fat * multiplier,
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return { period, items, macros };
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="p-4 flex items-center justify-between border-b border-border bg-card">
        <h1 className="text-xl font-bold tracking-tight">Makro Diary</h1>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="text-muted-foreground p-2 hover:bg-muted rounded-full transition">
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <CalendarHeader initialDate={today} />

        {/* Macro Progress */}
        <section className="bg-card p-5 rounded-2xl border border-border space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Calories</p>
              <h2 className="text-3xl font-black">{Math.round(consumed.calories)}</h2>
              <p className="text-sm text-muted-foreground">/ {user.targetCalories} kcal goal</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Remaining</p>
              <p className={`text-3xl font-black ${consumed.calories > user.targetCalories ? 'text-red-500' : 'text-green-500'}`}>
                {Math.abs(user.targetCalories - Math.round(consumed.calories))}
              </p>
              <p className="text-sm text-muted-foreground">{consumed.calories > user.targetCalories ? 'over' : 'kcal'}</p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${consumed.calories > user.targetCalories ? 'bg-red-500' : 'bg-primary'}`}
              style={{ width: `${Math.min(100, (consumed.calories / user.targetCalories) * 100)}%` }}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-6 pt-2">
            <MacroBar label="Protein" consumed={consumed.protein} target={user.targetProtein} color="bg-blue-500" />
            <MacroBar label="Carbs" consumed={consumed.carbs} target={user.targetCarbs} color="bg-yellow-500" />
            <MacroBar label="Fat" consumed={consumed.fat} target={user.targetFat} color="bg-orange-500" />
          </div>
        </section>

        {/* Meal Periods */}
        <section className="space-y-6">
          {groupedMeals.map(({ period, items, macros }) => (
            <div key={period} className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div>
                  <h2 className="text-lg font-bold">{period}</h2>
                  {items.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {Math.round(macros.calories)} kcal • {Math.round(macros.protein)}g P • {Math.round(macros.carbs)}g C • {Math.round(macros.fat)}g F
                    </p>
                  )}
                </div>
                <Link 
                  href={`/dashboard/add-meal?date=${date}&period=${period}`}
                  className="flex items-center gap-1.5 text-sm text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors font-medium"
                >
                  <PlusCircle className="w-4 h-4" /> Add
                </Link>
              </div>

              {items.length === 0 ? (
                <div className="py-4 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                  No foods logged for {period.toLowerCase()}.
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map(item => (
                    <MealItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-card/80 backdrop-blur-md border-t border-border flex justify-around p-3 pb-safe">
        <Link href="/dashboard" className="flex flex-col items-center text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          <span className="text-[10px] mt-1 font-medium">Diary</span>
        </Link>
        <Link href="/foods" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="text-[10px] mt-1 font-medium">Foods</span>
        </Link>
        <Link href="/goals" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
          <Target className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Goals</span>
        </Link>
      </nav>
    </div>
  );
}

function MacroBar({ label, consumed, target, color }: { label: string, consumed: number, target: number, color: string }) {
  const percentage = Math.min(100, (consumed / target) * 100);
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold">{Math.round(consumed)}<span className="text-muted-foreground text-xs font-normal"> / {target}g</span></p>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
