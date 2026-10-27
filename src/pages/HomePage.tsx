import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getDashboard, getWeights, updateProfile, addWeight, deleteWeight } from "../api/me";
import type { User } from "../types/user";
import type { Weight, ProfileData, WeightData } from "../types/dashboard";
import type { ApiError } from "../types/common";
import { showServerErrors } from "../utils/formErrors";
import { todayString } from "../utils/dates";

function HomePage() {
    const { data: dashboard, isLoading, error } = useQuery({ queryKey: ["dashboard"], queryFn: getDashboard });
    const { data: weights = [] } = useQuery({ queryKey: ["weights"], queryFn: getWeights });

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

    if (isLoading) return <p>טוען...</p>;
    if (error) return <p>שגיאה: {error.message}</p>;
    if (!dashboard) return <p>לא נמצאו נתונים</p>;

    const { today, progress, track } = dashboard;

    return (
        <>
            <h2>סיכום היום</h2>
            <p>
                קלוריות: {today.totalCalories}
            </p>
            {today.targetCalories &&
                <p>
                    קלוריות יעד: {today.targetCalories}
                </p>}
            <p>ציון יומי</p>{today.score === null ? <p>-</p> : <p>{today.score}</p>}
            <p>סטטוס: {today.statusLabel}</p>
            {today.menuAdherence && <p>עמידה בתפריט: {today.menuAdherence.eaten} מתוך {today.menuAdherence.total}</p>}
            <h2>ההתקדמות שלי</h2>
            {progress.percent === null ? (
                <p>השלם את הפרופיל: משקל התחלתי ומשקל יעד</p>
            ) : (
                <>
                    <p>משקל התחלתי: {progress.startWeightKg} ק"ג</p>
                    <p>משקל נוכחי: {progress.currentWeightKg} ק"ג</p>
                    <p>יעד: {progress.targetWeightKg} ק"ג (התקדמות {progress.percent}%)</p>
                </>
            )}
            <h2>המסלול שלי</h2>
            {track ? (
                <p>
                    {track.name}
                    {dashboard.menu && <> · תפריט: {dashboard.menu.name}</>}
                </p>
            ) : (
                <p>
                    עוד לא נבחר מסלול. <Link to="/plan">לבחירת מסלול</Link>
                </p>
            )}

            <h2>הפרופיל שלי</h2>
            <form onSubmit={profileSubmit((data) => profileMutation.mutate(data))}>
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

            <h2>רשימת משקלים</h2>
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
        </>
    );
}

export default HomePage;
