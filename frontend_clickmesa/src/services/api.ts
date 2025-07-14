
import toast from "react-hot-toast";

const hasShownExpiredToast = false;

export async function apiFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token && {Authorization: `Bearer ${token}`}), 
    };

    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {}),
        },
    });

    if (response.status === 401 || response.status === 403) {
        if (!hasShownExpiredToast) {
            toast.error("Sua sessão expirou. Faça login novamente.");
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");

            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
            return Promise.reject("Sessão expirada");
        }
    }

    return response;
}