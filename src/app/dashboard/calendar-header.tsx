"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addDays, subDays, parseISO } from "date-fns";
import { useEffect, useState } from "react";

export function CalendarHeader({ initialDate }: { initialDate: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date") || initialDate;

  // We ensure the date looks like YYYY-MM-DD
  const [currentDate, setCurrentDate] = useState(dateParam);

  useEffect(() => {
    setCurrentDate(dateParam);
  }, [dateParam]);

  const handleDateChange = (newDate: string) => {
    router.push(`/dashboard?date=${newDate}`);
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
    <div className="flex items-center justify-between bg-primary text-primary-foreground p-3 rounded-xl shadow-md">
      <button 
        onClick={() => handleDateChange(prevDay)}
        className="p-2 hover:bg-primary-foreground/20 rounded-full transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 opacity-80" />
          <span className="font-semibold text-lg">{displayDate}</span>
        </div>
      </div>

      <button 
        onClick={() => handleDateChange(nextDay)}
        className="p-2 hover:bg-primary-foreground/20 rounded-full transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
