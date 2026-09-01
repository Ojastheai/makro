"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addDays, subDays, parseISO } from "date-fns";
import { useEffect, useState, useTransition } from "react";

export function CalendarHeader({ initialDate }: { initialDate: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date") || initialDate;

  // We ensure the date looks like YYYY-MM-DD
  const [currentDate, setCurrentDate] = useState(dateParam);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setCurrentDate(dateParam);
  }, [dateParam]);

  const handleDateChange = (newDate: string) => {
    startTransition(() => {
      router.push(`/dashboard?date=${newDate}`);
    });
  };

  const parsedDate = parseISO(currentDate);

  const prevDay = format(subDays(parsedDate, 1), "yyyy-MM-dd");
  const nextDay = format(addDays(parsedDate, 1), "yyyy-MM-dd");

  const today = format(new Date(), "yyyy-MM-dd");
  const isToday = currentDate === today;

  let displayDate = format(parsedDate, "EEEE, MMMM d");
  if (isToday) {
    displayDate = "Today";
  } else if (currentDate === format(subDays(new Date(), 1), "yyyy-MM-dd")) {
    displayDate = "Yesterday";
  } else if (currentDate === format(addDays(new Date(), 1), "yyyy-MM-dd")) {
    displayDate = "Tomorrow";
  }

  return (
    <div className={`flex items-center justify-between bg-primary text-primary-foreground p-3 rounded-xl shadow-md transition-opacity duration-200 ${isPending ? "opacity-60" : "opacity-100"}`}>
      <button 
        onClick={() => handleDateChange(prevDay)}
        disabled={isPending}
        className="p-2 hover:bg-primary-foreground/20 rounded-full transition disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Calendar className="w-4 h-4 opacity-80" />
          )}
          <span className="font-semibold text-lg">{displayDate}</span>
        </div>
      </div>

      <button 
        onClick={() => handleDateChange(nextDay)}
        disabled={isPending}
        className="p-2 hover:bg-primary-foreground/20 rounded-full transition disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
