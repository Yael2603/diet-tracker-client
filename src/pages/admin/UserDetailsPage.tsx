import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails, getUserMeals } from "../../api/admin";
import { todayString } from "../../utils/dates";

function UserDetailsPage() {
    const { id } = useParams();
    const userId = Number(id);

    const { data: details, isLoading, error } = useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUserDetails(userId)
    }
    )

    const isShare = details?.user.shareWithDietitian;

    const [date, setDate] = useState(todayString());

    const { data: day } = useQuery({
        queryKey: ["adminUserMeals", userId, date],
        queryFn: () => getUserMeals(userId, date),
        enabled: isShare,
    })

    if (isLoading) return <p>טוען...</p>
    if (error) return <p>{error.message}</p>
    if (!details) return <>אין נתונים</>

    if (!details.sharing)
        return <>
            <h2>{details.user.fullName} </h2>
            <p>{details.user.email}</p>
            <p>{details.message}</p>
        </>

    const overview = details.overview!;

    return (
        <>
            <Link to={"/admin/users"}>חזרה לרשימה</Link>
            <h2>{details.user.fullName} </h2>
            <p>{details.user.email}</p>
            <p>{overview.track?overview.track.name:<>לא נמצא מסלול</>}</p>
            <p>{overview.menu?overview.menu.name:<>לא נמצא תפריט</>}</p>
            {overview.progress.percent === null ? (
                <p>לא הוזן משקל התחלתי או משקל יעד</p>
            ) : (
                <p>
                    משקל התחלתי: {overview.progress.startWeightKg} ק"ג · נוכחי: {overview.progress.currentWeightKg} ק"ג · יעד: {overview.progress.targetWeightKg} ק"ג (התקדמות {overview.progress.percent}%)
                </p>
            )}
            <p>
                היום: {overview.today.totalCalories}
                {overview.today.targetCalories && <> מתוך {overview.today.targetCalories}</>} קלוריות · ציון: {overview.today.score === null ? "-" : overview.today.score}
            </p>

            <h3>שקילות</h3>
            {details.weights!.length === 0 && <p>אין שקילות</p>}
            <ul>
                {details.weights!.map((w) => (
                    <li key={w.id}>
                        {w.date} - {w.weightKg} ק"ג
                    </li>
                ))}
            </ul>

            <h3>יומן אכילה</h3>
            <label> בחירת תאריך
                <input value={date} type="date" max={todayString()} onChange={(e) => setDate(e.target.value)} />
            </label>
            {day?.meals.length === 0 && <p>לא נרשמו ארוחות ביום הזה</p>}
            <ul>
                {day?.meals.map((meal) => (
                    <li key={meal.id}>
                        {meal.mealTypeLabel}: {meal.food.name}, {meal.servings} מנות, {meal.calories} קלוריות · {meal.sourceLabel}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default UserDetailsPage;
