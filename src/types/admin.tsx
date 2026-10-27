import type { User } from "./user";
import type { TrackProps, MenuProps } from "./track";
import type { Progress, TodaySummary, Weight } from "./dashboard";

export interface AdminUserRow {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  shareWithDietitian: boolean;
  track: { id: number; name: string } | null;
  pendingConsultations: number;
  createdAt: string;
}

export interface AdminUserOverview {
  track: TrackProps | null;
  menu: MenuProps | null;
  progress: Progress;
  today: TodaySummary;
}

export interface AdminUserDetails {
  user: User;
  sharing: boolean;
  message: string | null;
  overview: AdminUserOverview | null;
  weights: Weight[] | null;
}
