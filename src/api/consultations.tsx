import { apiFetch } from "./client";
import type { Consultation, ConsultationData, ConsultationStatus } from "../types/consultations";

export const getConsultations = (status?: ConsultationStatus) =>
    apiFetch<Consultation[]>(status ? `/api/consultations?status=${status}` : "/api/consultations");

export const sendConsultation = (data: ConsultationData) =>
    apiFetch<Consultation>("/api/consultations", { method: "POST", body: JSON.stringify(data) });

export const answerConsultation = (id: number, answer: string) =>
    apiFetch<Consultation>(`/api/consultations/${id}/answer`, {
        method: "PATCH",
        body: JSON.stringify({ answer })
    });
