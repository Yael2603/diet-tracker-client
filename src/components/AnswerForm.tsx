import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { answerConsultation } from "../api/consultations";
import { showServerErrors } from "../utils/formErrors";
import type { Consultation, AnswerData } from "../types/consultations";
import type { ApiError } from "../types/common";

function AnswerForm({ id }: { id: number }) {
    
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<AnswerData>();
    const queryClient = useQueryClient();

    const mutation = useMutation<Consultation, ApiError, AnswerData>({
        mutationFn: (data) => answerConsultation(id, data.answer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["consulations"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
            reset();
        },
        onError: (error) => showServerErrors(error, setError)
    });

    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <label>תשובה
                <textarea {...register("answer", {
                    required: "שדה חובה",
                    minLength: { value: 2, message: "יש להזין לפחות 2 תווים" },
                    maxLength: { value: 2000, message: "עד 2000 תווים" }
                })} />
                {errors.answer && <span>{errors.answer.message}</span>}
            </label>
            {errors.root && <p className="error">{errors.root.message}</p>}
            <button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "שולח..." : "שליחת תשובה"}
            </button>
        </form>
    );
}

export default AnswerForm;
