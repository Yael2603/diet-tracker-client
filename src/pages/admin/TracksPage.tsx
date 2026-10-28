import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTracks } from "../../api/plan";
import { setTrackStatus } from "../../api/tracks";
import TrackForm from "../../components/TrackForm";
import type { TrackProps } from "../../types/track";
import type { ApiError } from "../../types/common";

export default function TracksPage() {

    const[status,setStatus]=useState<true|TrackProps|null>(null);

    const { data: tracks, isLoading, error } = useQuery({
        queryKey: ["tracks"],
        queryFn: getTracks
    });

    const queryClient = useQueryClient();

    const mutation = useMutation<TrackProps, ApiError, { trackid: number, status: boolean }>({
        mutationFn: ({ trackid, status }) => setTrackStatus(trackid, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] });
        }
    });

    if (isLoading) return <p>טוען...</p>;
    if (error) return <p className="error">{error.message}</p>;

    return (
        <>
            <h2>ניהול מסלולים</h2>

            <button type="button" onClick={()=>setStatus(true)}>הוספת מסלול</button>

            {status !== null && (
                <div>
                    <TrackForm
                        key={status === true ? "new" : status.id}
                        track={status === true ? undefined : status}
                        onDone={() => setStatus(null)}
                    />
                    <button type="button" onClick={() => setStatus(null)}>ביטול</button>
                </div>
            )}

            <ul>
                {tracks?.map((t) => (
                    <li key={t.id}>
                        <h3>{t.name}</h3>
                        <p>{t.typeLabel} | {t.difficultyLabel} | {t.dailyCalories} קלוריות ליום | {t.durationWeeks} שבועות | {t.menusCount ?? 0} תפריטים</p>

                        <p>מצב: {t.isActive ? "פעיל" : "מושבת"}</p>

                        <button type="button" disabled={mutation.isPending} onClick={() => mutation.mutate({ trackid: t.id, status: !t.isActive })}>
                            {t.isActive ? "השבתה" : "הפעלה"}
                        </button>

                        <button type="button" onClick={() => setStatus(t)}>עריכה</button>
                    </li>
                ))}
            </ul>

            {mutation.error && <p className="error">{mutation.error.message}</p>}
        </>
    );
}
