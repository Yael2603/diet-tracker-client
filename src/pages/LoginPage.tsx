import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../context/userContext";
import { login, register as registerUser } from "../api/auth";
import type { AuthResponse, RegisterData } from "../types/user";
import type { ApiError } from "../types/common";
import { showServerErrors } from "../utils/formErrors";
import { LoginArt, LogoMark } from "../components/Illustrations";

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
        <div className="login">
            <div className="login-art">
                <div className="brand"><LogoMark />מסלול בריא</div>
                <LoginArt />
                <div>
                    <h2>צעד קטן כל יום</h2>
                    <p>מסלול, תפריט ויומן אכילה במקום אחד, עם דיאטן שעונה לשאלות.</p>
                </div>
            </div>
            <form className="login-form" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
                <h1>{isRegister ? "הרשמה" : "כניסה לחשבון"}</h1>
                <p className="sub">{isRegister ? "כמה פרטים, ומתחילים." : "המסלול, התפריט והיומן שלך מחכים כאן."}</p>
                {isRegister && (
                    <label>שם מלא
                        <input type="text" {...register("fullName", { required: "שדה חובה" })} />
                        {errors.fullName && <span className="error">{errors.fullName.message}</span>}
                    </label>
                )}
                <label>אימייל
                    <input type="email" {...register("email", { required: "שדה חובה" })} />
                    {errors.email && <span className="error">{errors.email.message}</span>}
                </label>
                <label>סיסמה
                    <input type="password" {...register("password", { required: "שדה חובה" })} />
                    {errors.password && <span className="error">{errors.password.message}</span>}
                </label>
                {errors.root && <p className="error">{errors.root.message}</p>}
                <button type="submit" className="btn main" disabled={mutation.isPending}>{mutation.isPending ? "שולח..." : isRegister ? "הרשמה" : "כניסה"}</button>
                <button type="button" className="link" onClick={() => { setIsRegister(!isRegister); clearErrors(); }}>{isRegister ? "יש לך חשבון? לכניסה" : "אין לך חשבון? להרשמה"}</button>
            </form>
        </div>
    );
}

export default LoginPage;