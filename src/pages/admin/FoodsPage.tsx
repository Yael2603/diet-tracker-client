import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getFoods, setFoodStatus } from "../../api/foods";
import FoodForm from "../../components/FoodForm";
import { foodCategories } from "../../utils/options";
import type { FoodItemProps } from "../../types/track";
import type { ApiError } from "../../types/common";

function FoodsPage() {

    // TODO: state לטקסט החיפוש. ערך התחלתי: ריק
    const [search, setSearch] = useState("");

    // TODO: state לקטגוריה שנבחרה בסינון. ערך התחלתי: ריק (= הכל)
    const [category, setCategory] = useState("");

    // TODO: state של מה פתוח: כלום / הוספה / עריכה של מאכל מסוים (כמו במסלולים)
    const [status, setStatus] = useState<true | null | FoodItemProps>(null);

    // TODO: useQuery לרשימת המאכלים
    //   - מפתח: כולל את החיפוש ואת הקטגוריה
    //   - פונקציה: getFoods עם שניהם
    //   - placeholderData: כדי שהשדה לא יאבד פוקוס בזמן הקלדה
    const { data: foods, isLoading, error } = useQuery({
        queryKey: ["foods", search, category],
        queryFn: () => getFoods(search, category),
        placeholderData: keepPreviousData
    });

    // TODO: גישה ל-queryClient
    const queryClient = useQueryClient();

    // TODO: mutation להפעלה / השבתה
    //   - שלושת הטיפוסים
    //   - mutationFn: setFoodStatus עם מספר המאכל והמצב החדש
    //   - onSuccess: רענון לפי המפתח של הרשימה
    const mutation = useMutation<FoodItemProps, ApiError, { foodId: number, isActive: boolean }>({
        mutationFn: ({ foodId, isActive }) => setFoodStatus(foodId, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["foods"] });
        }
    });

    return (
        <>
            <h2>ניהול מאכלים</h2>

            {/* TODO: שדה חיפוש - value מה-state, onChange מעדכן את ה-state */}
            <label>חיפוש לפי שם
                <input value={search} type="text" onChange={(e) => setSearch(e.target.value)} />
            </label>
            {/* TODO: select לקטגוריה - אפשרות "הכל" עם ערך ריק, ואחריה map על foodCategories */}
            <label>קטגוריה
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">הכל</option>
                    {foodCategories.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </label>

            {/* TODO: כפתור "מאכל חדש" - משנה את ה-state למצב הוספה */}
            <button type="button" onClick={() => setStatus(true)}>מאכל חדש</button>

            {/* TODO: הטופס - מוצג רק כשמשהו פתוח
                הוספה: FoodForm עם onDone בלבד
                עריכה: FoodForm עם food ועם onDone
                key שמשתנה לפי המאכל
                ליד הטופס: כפתור ביטול */}
            {status !== null && (
                <div>
                    <FoodForm
                        key={status === true ? "new" : status.id}
                        food={status === true ? undefined : status}
                        onDone={() => setStatus(null)}
                    />
                    <button type="button" onClick={() => setStatus(null)}>ביטול</button>
                </div>
            )}

            {/* TODO: הודעות: טוען / שגיאה / אין מאכלים (בתוך ה-JSX, כדי שהחיפוש יישאר על המסך) */}
            {isLoading && <p>טוען...</p>}
            {error && <p className="error">{error.message}</p>}
            {foods?.length === 0 && <p>לא נמצאו מאכלים</p>}

            {/* TODO: רשימה - map על המאכלים, ולכל מאכל:
                שם, קטגוריה (התווית בעברית), תיאור מנה, קלוריות למנה
                מצב: פעיל / מושבת
                כפתור הפעלה / השבתה - הטקסט לפי המצב
                כפתור עריכה - שומר את המאכל ב-state */}
            <ul>
                {foods?.map((f) => (
                    <li key={f.id}>
                        <h3>{f.name}</h3>
                        <p>{f.categoryLabel} | {f.servingDescription} | {f.caloriesPerServing} קלוריות למנה</p>
                        <p>מצב: {f.isActive ? "פעיל" : "מושבת"}</p>
                        <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate({ foodId: f.id, isActive: !f.isActive })}>
                            {f.isActive ? "השבתה" : "הפעלה"}
                        </button>
                        <button type="button" onClick={() => setStatus(f)}>עריכה</button>
                    </li>
                ))}
            </ul>

            {/* TODO: הודעת שגיאה של ה-mutation, אם יש */}
            {mutation.error && <p className="error">{mutation.error.message}</p>}
        </>
    );
}

export default FoodsPage;
