import type { User } from "./user";
import type { TrackProps, MenuProps } from "./track";

export interface Weight {
  id: number;
  date: string;
  weightKg: number;
  note: string | null;
  createdAt: string;
}

export interface Progress {
  startWeightKg: number | null;
  targetWeightKg: number | null;
  currentWeightKg: number | null;
  changeKg: number | null;
  remainingKg: number | null;
  percent: number | null;
}

export interface TodaySummary {
  date: string;
  totalCalories: number;
  targetCalories: number | null;
  remainingCalories: number | null;
  score: number | null;
  status: string;
  statusLabel: string;
  percentOfTarget: number | null;
  menuAdherence: { eaten: number; total: number } | null;
}

export interface Dashboard {
  user: User;
  track: TrackProps | null;
  menu: MenuProps | null;
  progress: Progress;
  today: TodaySummary;
}

export interface ProfileData {
  fullName?: string;
  heightCm?: number | null;
  startWeightKg?: number | null;
  targetWeightKg?: number | null;
  birthDate?: string | null;
  shareWithDietitian?: boolean;
}

export interface WeightData {
  date: string;
  weightKg: number;
  note?: string;
}
