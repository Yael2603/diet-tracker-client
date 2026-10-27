import { apiFetch } from "./client";
import type { TrackProps, MenuProps, PlanResponse } from "../types/track";

export const getTracks = () => apiFetch<TrackProps[]>("/api/tracks");

export const getTrackMenus = (trackId: number) => apiFetch<MenuProps[]>(`/api/tracks/${trackId}/menus`);

export const updatePlan = (trackId: number, menuId: number) =>
  apiFetch<PlanResponse>("/api/me/plan", {
    method: "PUT",
    body: JSON.stringify({ trackId, menuId }),
  });
