export type ConsultationStatus = "PENDING" | "ANSWERED";

export interface Consultation {
  id: number;
  subject: string;
  message: string;
  status: ConsultationStatus;
  statusLabel: string;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
  user?: { id: number; fullName: string; email: string };
}

export interface ConsultationData {
  subject: string;
  message: string;
}

export interface AnswerData {
  answer: string;
}

export interface AnswerFormProps {
  id: number;
}
