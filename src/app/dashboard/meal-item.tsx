"use client";

import { useState, useTransition } from "react";
import { editMealAction, deleteMealAction } from "./actions";
import { Edit2, Trash2, Check, X } from "lucide-react";

type MealItemProps = {
  item: {
    id: string;
    amount: number;
    mealPeriod: string;
    foodItem: {
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      baseAmount: number;
      baseUnit: string;
    };
  };
};

export function MealItem({ item }: MealItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [amount, setAmount] = useState(item.amount);
  
  const [isPending, startTransition] = useTransition();

  const multiplier = item.amount / item.foodItem.baseAmount;
  const calories = Math.round(item.foodItem.calories * multiplier);
  const protein = Math.round(item.foodItem.protein * multiplier);
  const carbs = Math.round(item.foodItem.carbs * multiplier);
  const fat = Math.round(item.foodItem.fat * multiplier);

  const handleEdit = () => {
    startTransition(async () => {
      try {
        await editMealAction(item.id, Number(amount));
        setIsEditing(false);
      } catch (e) {
        console.error(e);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteMealAction(item.id);
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <div className={`bg-card p-3 rounded-lg border border-border flex justify-between items-center group transition hover:shadow-sm ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex-1">
        <h4 className="font-medium">{item.foodItem.name}</h4>
        
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(Number(e.target.value))}
              className="w-20 px-2 py-1 text-sm border border-input rounded bg-background"
              step="any"
              min="0"
              disabled={isPending}
            />
            <span className="text-sm text-muted-foreground">{item.foodItem.baseUnit}</span>
            <button onClick={handleEdit} disabled={isPending} className="text-green-500 p-1 hover:bg-green-500/10 rounded">
              {isPending ? <div className="w-4 h-4 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button onClick={() => { setIsEditing(false); setAmount(item.amount); }} disabled={isPending} className="text-red-500 p-1 hover:bg-red-500/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {item.amount}{item.foodItem.baseUnit} • P: {protein}g • C: {carbs}g • F: {fat}g
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-bold text-primary">{calories}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">kcal</p>
        </div>
        
        {!isEditing && (
          <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button onClick={() => setIsEditing(true)} disabled={isPending} className="text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-full" title="Edit amount">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleDelete} disabled={isPending} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-full" title="Delete meal">
              {isPending ? <div className="w-3.5 h-3.5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
