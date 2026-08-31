import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Utensils, Target, Scale } from "lucide-react";
import Link from "next/link";
import { updateGoalsAction, logWeightAction } from "./actions";

const prisma = new PrismaClient();

export default async function GoalsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      weightLogs: {
        orderBy: { date: 'desc' },
        take: 5
      }
    }
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="p-4 flex items-center justify-between border-b border-border">
        <h1 className="text-xl font-bold">Goals & Weight</h1>
      </header>

      <main className="p-4 space-y-6">
        {/* Macro Goals */}
        <section className="bg-card p-4 rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" /> Macro Targets
          </h2>
          <form action={updateGoalsAction} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Daily Calories (kcal)</label>
              <input type="number" name="targetCalories" required defaultValue={user.targetCalories} className="w-full bg-input border border-border rounded p-2" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Protein (g)</label>
                <input type="number" name="targetProtein" required defaultValue={user.targetProtein} className="w-full bg-input border border-border rounded p-2" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Carbs (g)</label>
                <input type="number" name="targetCarbs" required defaultValue={user.targetCarbs} className="w-full bg-input border border-border rounded p-2" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Fat (g)</label>
                <input type="number" name="targetFat" required defaultValue={user.targetFat} className="w-full bg-input border border-border rounded p-2" />
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium">
              Update Goals
            </button>
          </form>
        </section>

        {/* Weight Logging */}
        <section className="bg-card p-4 rounded-xl border border-border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5" /> Log Weight
          </h2>
          <form action={logWeightAction} className="flex gap-2">
            <input type="number" step="0.1" name="weight" required placeholder="Weight (kg/lbs)" className="flex-1 bg-input border border-border rounded p-2" />
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium">
              Log
            </button>
          </form>

          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Recent Logs</h3>
            {user.weightLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No weight logs yet.</p>
            ) : (
              user.weightLogs.map(log => (
                <div key={log.id} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                  <span>{new Date(log.date).toLocaleDateString()}</span>
                  <span className="font-semibold">{log.weight}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full z-50 bg-card border-t border-border flex justify-around p-3 pb-safe">
        <Link href="/dashboard" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
          <Utensils className="w-6 h-6" />
          <span className="text-[10px] mt-1">Diary</span>
        </Link>
        <Link href="/foods" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors">
          <Target className="w-6 h-6" />
          <span className="text-[10px] mt-1">Foods</span>
        </Link>
        <Link href="/goals" className="flex flex-col items-center text-primary">
          <Target className="w-6 h-6" />
          <span className="text-[10px] mt-1">Goals</span>
        </Link>
      </nav>
    </div>
  );
}
