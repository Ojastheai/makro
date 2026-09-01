"use client";

import { useState } from "react";
import { logMealAction } from "./actions";
import { SubmitButton } from "@/components/submit-button";

type FoodItem = {
  id: string;
  name: string;
  calories: number;
  baseAmount: number;
  baseUnit: string;
};

export default function ClientLogMealForm({ 
  foods, 
  initialDate, 
  initialPeriod 
}: { 
  foods: FoodItem[]; 
  initialDate: string; 
  initialPeriod: string; 
}) {
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");

  const selectedFood = foods.find(f => f.id === selectedFoodId);

  return (
    <form action={logMealAction} className="space-y-6">
      <input type="hidden" name="date" value={initialDate} />
      <div className="space-y-2">
        <label className="text-sm font-medium">Food Item</label>
        <select 
          name="foodItemId" 
          required 
          value={selectedFoodId}
          onChange={(e) => setSelectedFoodId(e.target.value)}
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
          defaultValue={initialPeriod}
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
        <label className="text-sm font-medium">Amount {selectedFood ? `(in ${selectedFood.baseUnit.trim()}s)` : ""}</label>
        <div className="relative">
          <input 
            type="number" 
            step="0.1" 
            name="amount" 
            required 
            placeholder={selectedFood ? `e.g. ${selectedFood.baseAmount}` : "Select a food first"}
            disabled={!selectedFoodId}
            className="w-full bg-input border border-border rounded-md p-3 pr-16 text-foreground disabled:opacity-50"
          />
          {selectedFood && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground">
              {selectedFood.baseUnit.trim()}s
            </div>
          )}
        </div>
      </div>

      <SubmitButton disabled={!selectedFoodId}>
        Log Meal
      </SubmitButton>
    </form>
  );
}
