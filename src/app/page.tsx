import { LogIn } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="flex flex-col items-center space-y-6 max-w-md w-full text-center">
        <div className="bg-primary/10 p-4 rounded-full">
          <LogIn className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Makro</h1>
        <p className="text-muted-foreground">
          Track your macros, reach your goals, and manage your daily food intake efficiently.
        </p>
        
        <div className="w-full pt-8">
          <Link 
            href="/api/auth/signin" 
            className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            Sign in with Google
          </Link>
        </div>
      </div>
    </main>
  );
}
