import type { Meal, MenuItemProps } from "./track";

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export interface MenuItemToday extends MenuItemProps {
  eaten: boolean;
}

export interface MealsDay {
  date: string;
  source: string;
  totalCalories: number;
  targetCalories: number | null;
  remainingCalories: number | null;
  score: number | null;
  status: string;
  statusLabel: string;
  percentOfTarget: number | null;
  caloriesByMealType: Record<MealType, number>;
  menu: { id: number; name: string } | null;
  menuAdherence: { eaten: number; total: number } | null;
  menuItems: MenuItemToday[];
  meals: Meal[];
}

export interface MealData {
  date: string;
  mealType: MealType;
  foodId: number;
  servings: number;
}
