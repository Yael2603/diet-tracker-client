import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDashboard } from "../api/me";
import { getTracks, getTrackMenus, updatePlan } from "../api/plan";
import type { PlanResponse } from "../types/track";
import type { ApiError } from "../types/common";

function PlanPage() {
    const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);

    const { data: dashboard, isLoading, error } = useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboard,
    });

    const { data: tracks = [] } = useQuery({
        queryKey: ["tracks"],
        queryFn: getTracks,
    });

    const shownTrackId = selectedTrackId ?? dashboard?.user.trackId ?? null;

    const { data: menus = [] } = useQuery({
        queryKey: ["menus", shownTrackId],
        queryFn: () => getTrackMenus(shownTrackId!),
        enabled: shownTrackId !== null,
    });

    const queryClient = useQueryClient();

    const planMutation = useMutation<PlanResponse, ApiError, { trackId: number; menuId: number }>({
        mutationFn: ({ trackId, menuId }) => updatePlan(trackId, menuId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            queryClient.invalidateQueries({ queryKey: ["meals"] });
        },
    });

    if (isLoading) return <p>טוען...</p>;
    if (error) return <p>שגיאה: {error.message}</p>;

    return (
        <>
            <h2>מסלול ותפריט</h2>
            {dashboard?.track ? <p>מסלול נוכחי: {dashboard.track.name}</p> : <p>אין מסלול נבחר</p>}
            <ul>
                {tracks.map((track) => (
                    <li key={track.id}>
                        {track.name} | {track.typeLabel} | {track.difficultyLabel} | {track.dailyCalories} קלוריות ליום | {track.durationWeeks} שבועות
                        {track.id === shownTrackId ? <>מוצג</> : <button type="button" onClick={() => setSelectedTrackId(track.id)}>הצגת תפריטים</button>}
                    </li>
                ))}
            </ul>
            {planMutation.error && <p>{planMutation.error.message}</p>}
            <ul>
                {menus.map((menu) => (
                    <li key={menu.id}>
                        {menu.name} | {menu.totalCalories} קלוריות 
                        {dashboard?.menu?.id === menu.id ? (<>נבחר</>) : (
                            <button type="button" onClick={() => planMutation.mutate({ trackId: menu.trackId, menuId: menu.id })}>בחר תפריט</button> )}
                            <ul>
                                {menu.items.map((item) => (
                                    <li key={item.id}>
                                        {item.mealTypeLabel}: {item.food.name}, {item.servings} מנות ({item.calories} קלוריות)
                                    </li>
                                ))}
                            </ul>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default PlanPage;
