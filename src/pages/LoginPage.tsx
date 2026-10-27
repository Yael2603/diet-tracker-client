import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../context/userContext";
import { login, register as registerUser } from "../api/auth";
import type { AuthResponse, RegisterData } from "../types/user";
import type { ApiError } from "../types/common";
import { showServerErrors } from "../utils/formErrors";

function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const { setLogin } = useContext(UserContext);
    const navigate = useNavigate();
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<RegisterData>();
    const mutation = useMutation<AuthResponse, ApiError, RegisterData>({
        mutationFn: (data) => isRegister ? registerUser(data) : login({email: data.email, password: data.password}),
        onSuccess: (data) => {
            setLogin(data.token, data.user);
            navigate(data.user.role === "ADMIN" ? "/admin/users" :isRegister?"/plan": "/");
        },
        onError: (error) => showServerErrors(error, setError)
    })

    return (
        <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
            <h2>{isRegister ? "הרשמה" : "כניסה"}</h2>
            {isRegister && (
                <>
                    <input type="text" placeholder="שם" {...register("fullName", { required: "שדה חובה" })} />
                    {errors.fullName && <p>{errors.fullName.message}</p>}
                </>
            )}
           < input type="email" placeholder="אימייל" {...register("email", { required: "שדה חובה" })} />
           {errors.email && <p>{errors.email.message}</p>}
           < input type="password" placeholder="סיסמה" {...register("password", { required: "שדה חובה" })} />
           {errors.password && <p>{errors.password.message}</p>}
           {errors.root && <p>{errors.root.message}</p>}
           <button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "שולח..." : isRegister ? "הרשמה" : "כניסה"}</button>
              <button type="button" onClick={() => { setIsRegister(!isRegister); clearErrors(); }}>{isRegister ? "יש לך חשבון? היכנס" : "אין לך חשבון? הרשם"}</button>
        </form>
    );
}

export default LoginPage;