import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrack, updateTrack } from "../api/tracks";
import { showServerErrors } from "../utils/formErrors";
import type { TrackProps, TrackData, TrackFormProps } from "../types/track";
import type { ApiError } from "../types/common";

function TrackForm({ track, onDone }: TrackFormProps) {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<TrackData>({
        defaultValues: track
            ? {
                name: track.name,
                description: track.description,
                type: track.type,
                difficulty: track.difficulty,
                dailyCalories: track.dailyCalories,
                durationWeeks: track.durationWeeks
            }
            : { type: "LOSE", difficulty: "MEDIUM" }
    });

    const queryClient = useQueryClient();

    const mutation = useMutation<TrackProps, ApiError, TrackData>({
        mutationFn: (data) => track ? updateTrack(track.id, data) : createTrack(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] });
            onDone();
        },
        onError: (error) => showServerErrors(error, setError)
    });

    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <h3>{track ? "עריכת מסלול" : "מסלול חדש"}</h3>

            <label>שם
                <input {...register("name", {
                    required: "שדה חובה",
                    minLength: { value: 2, message: "לפחות 2 תווים" },
                    maxLength: { value: 60, message: "עד 60 תווים" }
                })} />
                {errors.name && <span>{errors.name.message}</span>}
            </label>

            <label>תיאור
                <textarea {...register("description", {
                    required: "שדה חובה",
                    minLength: { value: 5, message: "לפחות 5 תווים" },
                    maxLength: { value: 500, message: "עד 500 תווים" }
                })} />
                {errors.description && <span>{errors.description.message}</span>}
            </label>

            <label>סוג
                <select {...register("type", { required: "שדה חובה" })}>
                    <option value="LOSE">ירידה במשקל</option>
                    <option value="MAINTAIN">שמירה על משקל</option>
                    <option value="GAIN">עלייה במשקל</option>
                </select>
            </label>

            <label>רמת קושי
                <select {...register("difficulty", { required: "שדה חובה" })}>
                    <option value="EASY">קל</option>
                    <option value="MEDIUM">בינוני</option>
                    <option value="HARD">מאתגר</option>
                </select>
            </label>

            <label>קלוריות ליום
                <input type="number" {...register("dailyCalories", {
                    required: "שדה חובה",
                    valueAsNumber: true,
                    min: { value: 1000, message: "לפחות 1000" },
                    max: { value: 4500, message: "עד 4500" }
                })} />
                {errors.dailyCalories && <span>{errors.dailyCalories.message}</span>}
            </label>

            <label>משך (שבועות)
                <input type="number" {...register("durationWeeks", {
                    required: "שדה חובה",
                    valueAsNumber: true,
                    min: { value: 1, message: "לפחות שבוע אחד" },
                    max: { value: 104, message: "עד 104 שבועות" }
                })} />
                {errors.durationWeeks && <span>{errors.durationWeeks.message}</span>}
            </label>

            {errors.root && <p className="error">{errors.root.message}</p>}

            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "שומר..." : "שמירה"}
            </button>
        </form>
    );
}

export default TrackForm;
