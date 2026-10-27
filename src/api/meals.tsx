import { apiFetch } from "./client";
import type { Meal } from "../types/track";
import type { MealsDay, MealData } from "../types/meals";

export const getMeals = (date: string) => apiFetch<MealsDay>(`/api/meals?date=${date}`);

export const addMeal = (data: MealData) =>
  apiFetch<Meal>("/api/meals", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const addFromMenu = (menuItemId: number, date: string) =>
  apiFetch<Meal>("/api/meals/from-menu", {
    method: "POST",
    body: JSON.stringify({ menuItemId, date }),
  });

export const deleteMeal = (id: number) => apiFetch<void>(`/api/meals/${id}`, { method: "DELETE" });

