import { useEffect,useState,createContext,type ReactNode } from "react";

import { getMe } from "../api/auth";
import type { User } from "../types/user";

interface UserContextValue {
    user: User | null;
    isLoading: boolean;
    setLogin:(token:string, user: User) => void;
    setLogout: () => void;
}

export const UserContext = createContext<UserContextValue>({
    user: null,
    isLoading: true,
    setLogin: () => {},
    setLogout: () => {},
});

const UserProvider   = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const setLogin = (token: string, newUser: User) => {
        localStorage.setItem("token", token);
        setUser(newUser);
    }

    const setLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoading(false);
            return;
        }
        getMe()
            .then((me) => {
                setUser(me);
            })
            .catch(() => {
                setLogout();
            })
            .finally(() => {
                setIsLoading(false);
            });
},[]);

return (
    <UserContext.Provider value={{ user, isLoading, setLogin, setLogout }}>
        {children}
    </UserContext.Provider>
);
}

export default UserProvider;