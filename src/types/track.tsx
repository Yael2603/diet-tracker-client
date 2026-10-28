import type { User } from "./user";

export type TrackType = "LOSE" | "MAINTAIN" | "GAIN";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface TrackProps {
    "id": number,
    "name": string,
    "description": string,
    "type": TrackType,
    "typeLabel": string,
    "difficulty": Difficulty,
    "difficultyLabel": string,
    "dailyCalories": number,
    "durationWeeks": number,
    "isActive": boolean,
    "menusCount"?: number,
    "createdAt": string,
    "updatedAt": string
}

export interface FoodItemProps {
    "id": number,
    "name": string,
    "category": string,
    "categoryLabel": string,
    "servingDescription": string,
    "caloriesPerServing": number,
    "isActive": boolean,
    "createdAt": string,
    "updatedAt": string
}

export interface FoodShortProps {
    "id": number,
    "name": string,
    "category": string,
    "categoryLabel": string,
    "servingDescription": string,
    "caloriesPerServing": number
}

export interface MenuItemProps {
    "id": number,
    "mealType": string,
    "mealTypeLabel": string,
    "servings": number,
    "calories": number,
    "food": FoodShortProps
}

export interface MenuProps {
    "id": number,
    "trackId": number,
    "name": string,
    "description": string | null,
    "isActive": boolean,
    "totalCalories": number,
    "items": MenuItemProps[],
    "createdAt": string,
    "updatedAt": string
}

export interface Meal {
    "id": number,
    "date": string,
    "mealType": string,
    "mealTypeLabel": string,
    "servings": number,
    "calories": number,
    "fromMenu": boolean,
    "source": string,
    "sourceLabel": string,
    "menuItemId": number | null,
    "food": FoodShortProps,
    "createdAt": string,
    "updatedAt": string
}

export interface PlanResponse {
    "user": User,
    "track": TrackProps,
    "menu": MenuProps | null
}

export interface TrackData {
    "name": string,
    "description": string,
    "type": TrackType,
    "difficulty": Difficulty,
    "dailyCalories": number,
    "durationWeeks": number
}

export interface TrackFormProps {
    "track"?: TrackProps,
    "onDone": () => void
}

export interface FoodData {
    "name": string,
    "category": string,
    "servingDescription": string,
    "caloriesPerServing": number
}

export interface FoodFormProps {
    "food"?: FoodItemProps,
    "onDone": () => void
}
