import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getDashboard, getWeights, updateProfile, addWeight, deleteWeight } from "../api/me";
import { getMeals, addFromMenu } from "../api/meals";
import PlateRing from "../components/PlateRing";
import { MealIcon, ScaleCorner, FlagCorner } from "../components/Illustrations";
import type { Meal } from "../types/track";
import type { MealType } from "../types/meals";
import type { User } from "../types/user";
import type { Weight, ProfileData, WeightData } from "../types/dashboard";
import type { ApiError } from "../types/common";
import { showServerErrors } from "../utils/formErrors";
import { todayString, weekDates } from "../utils/dates";

const MEAL_ORDER: MealType[] = ["BREAKFAST", "LUNCH", "SNACK", "DINNER"];
const MEAL_LABELS: Record<MealType, string> = { BREAKFAST: "בוקר", LUNCH: "צהריים", SNACK: "ביניים", DINNER: "ערב" };
const DAY_LETTERS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];
const GOOD_SCORE = 75;

function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 17) return "צהריים טובים";
    return "ערב טוב";
}

function HomePage() {
    const { data: dashboard, isLoading, error } = useQuery({ queryKey: ["dashboard"], queryFn: getDashboard });
    const { data: weights = [] } = useQuery({ queryKey: ["weights"], queryFn: getWeights });
    const today0 = todayString();
    const week = weekDates(today0);
    const { data: todayMeals } = useQuery({ queryKey: ["meals", today0], queryFn: () => getMeals(today0) });
    const { data: weekScores = [] } = useQuery({
        queryKey: ["week", week[0]],
        queryFn: () => Promise.all(week.map((date) => date <= today0 ? getMeals(date).then((day) => day.score) : Promise.resolve(null))),
    });

    const queryClient = useQueryClient();
    const {
        register: profileRegister,
        handleSubmit: profileSubmit,
        setError: profileSetError,
        formState: { errors: profileErrors },
    } = useForm<ProfileData>({
        values: dashboard
            ? {
                  fullName: dashboard.user.fullName,
                  heightCm: dashboard.user.heightCm,
                  startWeightKg: dashboard.user.startWeightKg,
                  targetWeightKg: dashboard.user.targetWeightKg,
                  birthDate: dashboard.user.birthDate,
                  shareWithDietitian: dashboard.user.shareWithDietitian,
              }
            : undefined,
    });

    const profileMutation = useMutation<User, ApiError, ProfileData>({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
        onError: (error) => showServerErrors(error, profileSetError),
    });

    const {
        register: weightRegister,
        handleSubmit: weightSubmit,
        setError: weightSetError,
        reset,
        formState: { errors: weightErrors },
    } = useForm<WeightData>();

    const addWeightMutation = useMutation<Weight, ApiError, WeightData>({
        mutationFn: addWeight,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weights"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            reset();
        },
        onError: (error) => showServerErrors(error, weightSetError),
    });

    const deleteWeightMutation = useMutation<void, ApiError, number>({
        mutationFn: deleteWeight,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["weights"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
    });

    const eatMutation = useMutation<Meal, ApiError, number>({
        mutationFn: (menuItemId) => addFromMenu(menuItemId, today0),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meals", today0] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["week"] });
        },
    });

    if (isLoading) return <p>טוען...</p>;
    if (error) return <p>שגיאה: {error.message}</p>;
    if (!dashboard) return <p>לא נמצאו נתונים</p>;

    const { today, progress, track } = dashboard;

    let streak = 0;
    for (let i = week.indexOf(today0); i >= 0; i--) {
        const score = weekScores[i];
        if (score === null || score === undefined || score < GOOD_SCORE) break;
        streak++;
    }

    const recent = [...weights].sort((a, b) => a.date.localeCompare(b.date)).slice(-6);
    const minW = Math.min(...recent.map((w) => w.weightKg));
    const maxW = Math.max(...recent.map((w) => w.weightKg));
    const points = recent.map((w, i) => {
        const x = recent.length === 1 ? 300 : 300 - (i / (recent.length - 1)) * 300;
        const y = maxW === minW ? 40 : 10 + ((maxW - w.weightKg) / (maxW - minW)) * 60;
        return `${x},${y}`;
    }).join(" ");

    const lost = progress.startWeightKg !== null && progress.currentWeightKg !== null
        ? Math.round((progress.startWeightKg - progress.currentWeightKg) * 10) / 10
        : null;
    const remaining = today.targetCalories !== null ? today.targetCalories - today.totalCalories : null;

    return (
        <>
            <section className="hero">
                <div>
                    <p className="date">
                        {new Date().toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" })}
                        {streak >= 2 && <span className="badge">{streak} ימים ברצף מעל {GOOD_SCORE}</span>}
                    </p>
                    <h1>{greeting()}, {dashboard.user.fullName.split(" ")[0]}</h1>
                    <p className="lead">
                        אכלת {today.totalCalories.toLocaleString()}
                        {today.targetCalories !== null && <> מתוך {today.targetCalories.toLocaleString()}</>} קלוריות.
                        {remaining !== null && remaining > 0 && <> נשארו {remaining.toLocaleString()}.</>}
                        {today.score !== null && <> הציון היומי: {today.score} · {today.statusLabel}.</>}
                    </p>
                    <Link className="btn main" to="/meals">הוספת ארוחה</Link>

                    <div className="week">
                        <p>השבוע שלי</p>
                        <div className="week-days">
                            {week.map((date, i) => {
                                const score = weekScores[i];
                                const isToday = date === today0;
                                const kind = date > today0 ? "future" : isToday ? "today" : score === null || score === undefined ? "empty" : score >= GOOD_SCORE ? "good" : "low";
                                return (
                                    <div key={date} className={`week-day ${kind}`}>
                                        <span>{score ?? ""}</span>
                                        {isToday ? "היום" : DAY_LETTERS[i]}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {todayMeals && (
                    <PlateRing byMeal={todayMeals.caloriesByMealType} total={todayMeals.totalCalories} target={todayMeals.targetCalories} />
                )}
            </section>

            <div className="cols">
                <section className="panel">
                    <h2>התפריט שלי להיום</h2>
                    {!todayMeals?.menu ? (
                        <p className="sub">עוד לא נבחר תפריט. <Link to="/plan">לבחירת מסלול ותפריט</Link></p>
                    ) : (
                        <>
                            <p className="sub">
                                {todayMeals.menu.name}
                                {todayMeals.menuAdherence && <> · {todayMeals.menuAdherence.eaten} מתוך {todayMeals.menuAdherence.total} פריטים</>}
                            </p>
                            {MEAL_ORDER.map((type) => {
                                const items = todayMeals.menuItems.filter((item) => item.mealType === type);
                                if (items.length === 0) return null;
                                return (
                                    <div key={type} className="meal-block">
                                        <div className="meal-head">
                                            <MealIcon type={type} />
                                            <b>{MEAL_LABELS[type]}</b>
                                            <span>{todayMeals.caloriesByMealType[type] ? `${todayMeals.caloriesByMealType[type]} קל׳` : "טרם"}</span>
                                        </div>
                                        <ul className="checklist">
                                            {items.map((item) => (
                                                <li key={item.id} className={item.eaten ? "done" : ""}>
                                                    {item.eaten ? (
                                                        <span className="check" aria-label="נאכל">✓</span>
                                                    ) : (
                                                        <button type="button" className="check" aria-label={`אכלתי ${item.food.name}`}
                                                            onClick={() => eatMutation.mutate(item.id)} disabled={eatMutation.isPending} />
                                                    )}
                                                    <span className="name">{item.food.name}</span>
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

                <div className="stack">
                    <section className="panel weight">
                        <ScaleCorner />
                        <h2>המשקל שלי</h2>
                        {progress.currentWeightKg === null ? (
                            <p className="sub">עוד לא נרשמו שקילות</p>
                        ) : (
                            <>
                                <p className="big">{progress.currentWeightKg} <small>ק"ג</small></p>
                                {lost !== null && <p className="sub">{lost >= 0 ? `ירדת ${lost} ק"ג` : `עלית ${-lost} ק"ג`} מתחילת המסלול</p>}
                            </>
                        )}
                        {recent.length > 1 && (
                            <svg className="spark" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
                                <polygon points={`${points} 0,80 300,80`} />
                                <polyline points={points} />
                            </svg>
                        )}
                        {progress.percent !== null ? (
                            <>
                                <div className="bar"><i style={{ width: `${Math.min(Math.max(progress.percent, 0), 100)}%` }} /></div>
                                <p className="sub">{progress.percent}% מהדרך ליעד של {progress.targetWeightKg} ק"ג</p>
                            </>
                        ) : (
                            <p className="sub">כדי לראות התקדמות, יש להשלים משקל התחלתי ויעד בפרופיל</p>
                        )}
                    </section>

                    <section className="panel track">
                        <FlagCorner />
                        <h2>המסלול שלי</h2>
                        {track ? (
                            <>
                                <p className="chips"><span>{track.name}</span><span>{track.difficultyLabel}</span></p>
                                <p className="big">{track.dailyCalories.toLocaleString()} <small>קל׳ ליום</small></p>
                                <p className="sub">{dashboard.menu ? `תפריט: ${dashboard.menu.name}` : "לא נבחר תפריט"} · {track.durationWeeks} שבועות</p>
                            </>
                        ) : (
                            <p className="sub">עוד לא נבחר מסלול.</p>
                        )}
                        <Link className="btn" to="/plan">{track ? "החלפת מסלול" : "לבחירת מסלול"}</Link>
                    </section>
                </div>
            </div>

            <div className="cols">
                <section className="panel">
                    <h2>הוספת משקל</h2>
            <form onSubmit={weightSubmit((data) => addWeightMutation.mutate(data))}>
                        <label>תאריך
                            <input type="date" max={todayString()} {...weightRegister("date", { required: "שדה חובה" })} />
                        </label>
                        {weightErrors.date && <p>{weightErrors.date.message}</p>}
                        <label>משקל (kg)
                            <input type="number" step="0.1" {...weightRegister("weightKg", { required: "שדה חובה", valueAsNumber: true })} />
                        </label>
                        {weightErrors.weightKg && <p>{weightErrors.weightKg.message}</p>}
                        <label>הערה
                            <input {...weightRegister("note")} />
                        </label>
                        {weightErrors.note && <p>{weightErrors.note.message}</p>}
                        {weightErrors.root && <p>{weightErrors.root.message}</p>}
                        <button type="submit" disabled={addWeightMutation.isPending}>
                            {addWeightMutation.isPending ? "מוסיף..." : "הוספת משקל"}
                        </button>
                    </form>

                                    </section>
                <section className="panel">
                    <h2>השקילות שלי</h2>
            {weights.length === 0 ? (
                        <p>לא נמצאו משקלים</p>
                    ) : (
                        <ul>
                            {weights.map((weight) => (
                                <li key={weight.id}>
                                    {new Date(weight.date).toLocaleDateString()}: {weight.weightKg} kg
                                    {weight.note && <p>{weight.note}</p>}
                                    <button type="button" onClick={() => deleteWeightMutation.mutate(weight.id)} disabled={deleteWeightMutation.isPending}>מחיקה</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <section className="panel">
                <h2>הפרופיל שלי</h2>
            <form className="grid-form" onSubmit={profileSubmit((data) => profileMutation.mutate(data))}>
                <label>שם מלא
                    <input type="text" {...profileRegister("fullName", { required: "שדה חובה" })} />
                </label>
                {profileErrors.fullName && <p>{profileErrors.fullName.message}</p>}
                <label>גובה (cm)
                    <input type="number" {...profileRegister("heightCm", { setValueAs: (v) => (v === "" ? null : Number(v)) })} />
                </label>
                {profileErrors.heightCm && <p>{profileErrors.heightCm.message}</p>}
                <label>משקל התחלתי (kg)
                    <input type="number" step="0.1" {...profileRegister("startWeightKg", { setValueAs: (v) => (v === "" ? null : Number(v)) })} />
                </label>
                {profileErrors.startWeightKg && <p>{profileErrors.startWeightKg.message}</p>}
                <label>משקל יעד (kg)
                    <input type="number" step="0.1" {...profileRegister("targetWeightKg", { setValueAs: (v) => (v === "" ? null : Number(v)) })} />
                </label>
                {profileErrors.targetWeightKg && <p>{profileErrors.targetWeightKg.message}</p>}
                <label>תאריך לידה
                    <input type="date" {...profileRegister("birthDate", { setValueAs: (v) => v || null })} />
                </label>
                {profileErrors.birthDate && <p>{profileErrors.birthDate.message}</p>}
                <label>
                    <input type="checkbox" {...profileRegister("shareWithDietitian")} />
                    שתף עם דיאטנית
                </label>
                {profileErrors.root && <p>{profileErrors.root.message}</p>}
                <button type="submit" disabled={profileMutation.isPending} >
                    {profileMutation.isPending ? "שומר..." : "שמירה"}
                </button>
                {profileMutation.isSuccess && <p>נשמר ✓</p>}
            </form>

                        </section>
        </>
    );
}

export default HomePage;
