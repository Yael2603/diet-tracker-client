import { apiFetch } from "./client";
import type { TrackProps, TrackData } from "../types/track";

export const createTrack = (data: TrackData) =>
    apiFetch<TrackProps>("/api/tracks", { method: "POST", body: JSON.stringify(data) });

export const updateTrack = (id: number, data: TrackData) =>
    apiFetch<TrackProps>(`/api/tracks/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const setTrackStatus = (id: number, isActive: boolean) =>
    apiFetch<TrackProps>(`/api/tracks/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) });
