import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getFoods, setFoodStatus } from "../../api/foods";
import FoodForm from "../../components/FoodForm";
import { foodCategories } from "../../utils/options";
import type { FoodItemProps } from "../../types/track";
import type { ApiError } from "../../types/common";

function FoodsPage() {

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [status, setStatus] = useState<true | null | FoodItemProps>(null);

    const { data: foods, isLoading, error } = useQuery({
        queryKey: ["foods", search, category],
        queryFn: () => getFoods(search, category),
        placeholderData: keepPreviousData
    });

    const queryClient = useQueryClient();

    const mutation = useMutation<FoodItemProps, ApiError, { foodId: number, isActive: boolean }>({
        mutationFn: ({ foodId, isActive }) => setFoodStatus(foodId, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["foods"] });
        }
    });

    return (
        <>
            <h2>ניהול מאכלים</h2>

            <label>חיפוש לפי שם
                <input value={search} type="text" onChange={(e) => setSearch(e.target.value)} />
            </label>
            <label>קטגוריה
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">הכל</option>
                    {foodCategories.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
            </label>

            <button type="button" onClick={() => setStatus(true)}>מאכל חדש</button>

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

            {isLoading && <p>טוען...</p>}
            {error && <p className="error">{error.message}</p>}
            {foods?.length === 0 && <p>לא נמצאו מאכלים</p>}

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

            {mutation.error && <p className="error">{mutation.error.message}</p>}
        </>
    );
}

export default FoodsPage;
