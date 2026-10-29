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
import { EmptyPlate, MealIcon } from "../components/Illustrations";
import type { MealType } from "../types/meals";

const MEAL_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "SNACK", "DINNER"];
const MEAL_LABELS: Record<MealType, string> = { BREAKFAST: "בוקר", LUNCH: "צהריים", SNACK: "ביניים", DINNER: "ערב" };

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
            <div className="page-head">
                <h1>יומן אכילה</h1>
                <label className="date-pick">תאריך
                    <input type="date" value={date} max={todayString()} onChange={(e) => setDate(e.target.value)} />
                </label>
            </div>

            <div className="stats">
                <div className="stat"><span>קלוריות</span><b>{day.totalCalories.toLocaleString()}</b>{day.targetCalories && <small>מתוך {day.targetCalories.toLocaleString()}</small>}</div>
                <div className="stat"><span>ציון יומי</span><b>{day.score === null ? "–" : day.score}</b><small>{day.statusLabel}</small></div>
                {day.menuAdherence && <div className="stat"><span>עמידה בתפריט</span><b>{day.menuAdherence.eaten}/{day.menuAdherence.total}</b><small>פריטים</small></div>}
            </div>

            <div className="cols">
                <section className="panel">
                    <h2>התפריט שלי</h2>
                    {!day.menu ? (
                        <p className="sub">לא נבחר תפריט</p>
                    ) : (
                        <>
                            <p className="sub">{day.menu.name}</p>
                            {MEAL_ORDER.map((type) => {
                                const items = day.menuItems.filter((item) => item.mealType === type);
                                if (items.length === 0) return null;
                                return (
                                    <div key={type} className="meal-block">
                                        <div className="meal-head"><MealIcon type={type} /><b>{MEAL_LABELS[type]}</b></div>
                                        <ul className="checklist">
                                            {items.map((item) => (
                                                <li key={item.id} className={item.eaten ? "done" : ""}>
                                                    {item.eaten ? (
                                                        <span className="check" aria-label="נאכל">✓</span>
                                                    ) : (
                                                        <button type="button" className="check" aria-label={`אכלתי ${item.food.name}`}
                                                            onClick={() => ated.mutate(item.id)} disabled={ated.isPending} />
                                                    )}
                                                    <span className="name">{item.food.name}, {item.servings} מנות</span>
                                                    <span className="kcal">{item.calories}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </section>

                <section className="panel">
                    <h2>הוספת ארוחה</h2>
                    <p className="sub">מאכל שלא מופיע בתפריט</p>
                    <label>חיפוש מאכל
                        <input placeholder="למשל: לחם" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </label>
            <form className="inline-form" onSubmit={handleSubmit((data) => addMutation.mutate({ ...data, date }))}>
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
                </section>
            </div>

            {day.meals.length === 0 ? (
                <section className="empty">
                    <EmptyPlate />
                    <div>
                        <h2>עוד לא נרשמו ארוחות ביום הזה</h2>
                        <p>אפשר לסמן פריטים מהתפריט, או לחפש מאכל ולהוסיף אותו.</p>
                    </div>
                </section>
            ) : (
                <section className="panel">
                    <h2>הארוחות שלי</h2>
                    <ul className="rows">
                        {day.meals.map((meal) => (
                            <li key={meal.id}>
                                <span className="tag">{meal.mealTypeLabel}</span>
                                <span className="name">{meal.food.name}, {meal.servings} מנות</span>
                                <span className="kcal">{meal.calories} קל׳ · {meal.sourceLabel}</span>
                                <button type="button" className="btn small" onClick={() => deleteMutation.mutate(meal.id)} disabled={deleteMutation.isPending}>
                                    מחיקה
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    );
}

export default MealsPage;