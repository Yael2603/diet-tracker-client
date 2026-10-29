import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { getDashboard } from "../api/me";
import { getConsultations, sendConsultation } from "../api/consultations";
import { showServerErrors } from "../utils/formErrors";
import type { Consultation, ConsultationData } from "../types/consultations";
import type { ApiError } from "../types/common";

function AskDietitianPage() {

    const { data: consultations } = useQuery({
        queryKey: ["consultations"],
        queryFn: () => getConsultations()
    });

    const { data: dashboard } = useQuery({
        queryKey: ["dashboard"],
        queryFn: getDashboard
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
        reset
    } = useForm<ConsultationData>();

    const queryClient = useQueryClient();

    const mutation = useMutation<Consultation, ApiError, ConsultationData>({
        mutationKey: ["consultations"],
        mutationFn: sendConsultation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["consultations"] });
            reset();
        },
        onError: (error) => showServerErrors(error, setError)
    })

    if (!dashboard)
        return <p>טוען...</p>;

    const canSend = dashboard.user.shareWithDietitian;

    return <>
        <h2>פנייה לדיאטן</h2>
        <h3>הפניות שלי</h3>
        {consultations?.length === 0 ? (
            <p>עדיין לא נשלחו פניות</p>
        ) : (
            <ul>
                {consultations?.map((c) => (
                    <li key={c.id}>
                        <h3>{c.subject}</h3>
                        <p>{c.message}</p>
                        <p>מצב: {c.statusLabel}</p>

                        {c.answer && (
                            <div>
                                <strong>תשובת הדיאטן:</strong>
                                <p>{c.answer}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        )}

        <h3>פנייה חדשה</h3>
        {canSend ? (
            <form onSubmit={handleSubmit(((data) => mutation.mutate(data)))}>
                <label>נושא
                    <textarea {...register("subject", { required: "שדה חובה" })} />
                    {errors.subject && <span>{errors.subject.message}</span>}
                </label>
                <label>תוכן
                    <textarea {...register("message", { required: "שדה חובה" })} />
                    {errors.message && <span>{errors.message.message}</span>}
                </label>
                {errors.root && <p className="error">{errors.root.message}</p>}
                <button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? "שולח..." : "שליחה"}
                </button>
            </form>
        ) : (
            <p>
                כדי לשלוח פנייה יש להפעיל שיתוף מידע עם הדיאטן. <Link to="/">לבית שלי</Link>
            </p>
        )}

    </>
}

export default AskDietitianPage;
