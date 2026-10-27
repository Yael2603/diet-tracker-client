import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getMeals, addMeal, addFromMenu, deleteMeal } from "../api/meals";
import { searchFood } from "../api/foods";
import type { Meal } from "../types/track";
import type { MealData } from "../types/meals";
import type { ApiError } from "../types/common";
import { showServerErrors } from "../utils/formErrors";
import { todayString } from "../utils/dates";

function MealsPage() {
    const [date, setDate] = useState(todayString());
    const [search, setSearch] = useState("");

    const { data: day, isLoading, error } = useQuery({
        queryKey: ["meals", date],
        queryFn: () => getMeals(date),
    });

    const { data: foods = [] } = useQuery({
        queryKey: ["foods", search],
        queryFn: () => searchFood(search),
    });

    const queryClient = useQueryClient();
    const ated = useMutation<Meal, ApiError, number>({
        mutationFn: (menuItemId) => addFromMenu(menuItemId, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meals", date] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
    const deleteMutation = useMutation({
        mutationFn: deleteMeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meals", date] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<MealData>({
        defaultValues: {
            mealType: "BREAKFAST",servings:1}
    });

    const addMutation = useMutation<Meal, ApiError, MealData>({
        mutationFn: addMeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meals", date] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            reset();
        },
        onError: (error) => showServerErrors(error, setError),
    });

    



    if (isLoading) return <p>טוען...</p>;
    if (error) return <p>שגיאה: {error.message}</p>;
    if (!day) return <p>לא נמצאו נתונים</p>;


    return (
        <>
            <h2>יומן אכילה</h2>
            <label>בחירת תאריך:
                <input type="date" value={date} max={todayString()} onChange={(e) => setDate(e.target.value)} />
            </label>
            <h3>סיכום היום</h3>
            <p>קלוריות: {day.totalCalories}{day.targetCalories && <> מתוך {day.targetCalories}</>}</p>
            <p>ציון: {day.score === null ? "-" : day.score} · {day.statusLabel}</p>
            <h3>התפריט שלי להיום{day.menu && <> · {day.menu.name}</>}</h3>
            {!day.menu && <p>לא נבחר תפריט</p>}
            <ul>
                {day.menuItems.map((item) => (
                    <li key={item.id}>
                        {item.mealTypeLabel}: {item.food.name}, {item.servings} מנות ({item.calories} קלוריות)
                        {item.eaten ? (
                            <span> ✓ נאכל</span>
                        ) : (
                            <button type="button" onClick={() => ated.mutate(item.id)} disabled={ated.isPending}>
                                אכלתי ✓
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <h3>הוספת ארוחה</h3>
            <input placeholder="חיפוש מאכל" value={search} onChange={(e) => setSearch(e.target.value)} />
            <form onSubmit={handleSubmit((data) => addMutation.mutate({ ...data, date }))}>
                <select {...register("foodId", { required: "יש לבחור מאכל", valueAsNumber: true })}>
                    <option value="">בחר מאכל</option>
                    {foods.map((food) => (
                        <option key={food.id} value={food.id}>
                            {food.name} ({food.servingDescription}, {food.caloriesPerServing} קל')
                        </option>
                    ))}
                </select>
                {errors.foodId && <p>{errors.foodId.message}</p>}

                <select {...register("mealType")}>
                    <option value="BREAKFAST">בוקר</option>
                    <option value="LUNCH">צהריים</option>
                    <option value="DINNER">ערב</option>
                    <option value="SNACK">ביניים</option>
                </select>

                <input type="number" step="0.25" min="0.25" {...register("servings", { required: "יש להזין כמות", valueAsNumber: true })} />
                {errors.servings && <p>{errors.servings.message}</p>}

                {errors.root && <p>{errors.root.message}</p>}
                <button type="submit" disabled={addMutation.isPending}>הוספה</button>
            </form>

            <h3>הארוחות שלי</h3>
            {day.meals.length === 0 && <p>עוד לא נרשמו ארוחות</p>}
            <ul>
                {day.meals.map((meal) => (
                    <li key={meal.id}>
                        {meal.mealTypeLabel}: {meal.food.name}, {meal.servings} מנות, {meal.calories} קלוריות · {meal.sourceLabel}
                        <button type="button" onClick={() => deleteMutation.mutate(meal.id)} disabled={deleteMutation.isPending}>
                            מחיקה
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default MealsPage;