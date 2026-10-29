import type{ ApiError } from "../types/common";
const BASE_URL = import.meta.env.VITE_API_URL;
if (!BASE_URL) {
    throw new Error("חסר המשתנה VITE_API_URL בקובץ .env");
}

export async function apiFetch <T>  (path: string, options: RequestInit ={}): Promise<T>{
    const token = localStorage.getItem("token");
    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        });
    } catch  {
        const error: ApiError = {status: 0, code: "Network_error",message: "אין חיבור לאינטרנט, אנא בדוק את החיבור ונסה שוב."};
        throw error;
    }
    
    if(response.status === 204) return undefined as T;
    if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({ status: response.status, code: "Unknown_error", message: "שגיאה לא ידועה, אנא נסה שוב." }));
        throw error;
    }
    return response.json() as Promise<T>;
};

