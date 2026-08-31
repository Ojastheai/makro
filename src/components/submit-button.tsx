"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ 
  children, 
  className = "w-full bg-primary text-primary-foreground py-3 rounded-md font-medium disabled:opacity-50 flex justify-center items-center gap-2",
  disabled = false
}: { 
  children: React.ReactNode, 
  className?: string,
  disabled?: boolean
}) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending || disabled}
      className={className}
    >
      {pending ? (
        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      ) : children}
    </button>
  );
}
