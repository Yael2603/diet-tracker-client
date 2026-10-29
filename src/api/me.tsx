import{apiFetch} from "./client";
import type{User} from "../types/user";
import type{Dashboard,Weight,ProfileData,WeightData} from "../types/dashboard";

export const getDashboard = () => apiFetch<Dashboard>("/api/me/dashboard");
export const updateProfile = (data:ProfileData) => apiFetch<User>("/api/me/profile",{method:"PUT",body:JSON.stringify(data)});
export const getWeights = () => apiFetch<Weight[]>("/api/weights");
export const addWeight = (data:WeightData) => apiFetch<Weight>("/api/weights",{method:"POST",body:JSON.stringify(data)});
export const deleteWeight = (id:number) => apiFetch<void>(`/api/weights/${id}`,{method:"DELETE"});