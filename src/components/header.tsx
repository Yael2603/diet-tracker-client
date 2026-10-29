import { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { UserContext } from "../context/userContext"
import { LogoMark, NavIcon, Sprig } from "./Illustrations"

export default function Header() {

    const { user, setLogout } = useContext(UserContext)
    const navigate = useNavigate();
    const exit = () => {
        setLogout();
        navigate("/login");
    }

    return (
        <aside className="sidebar">
            <div className="brand"><LogoMark />מסלול בריא</div>

            {user?.role === "USER" && (<nav>
                <NavLink to="/" end><NavIcon name="home" />הבית שלי</NavLink>
                <NavLink to="/plan"><NavIcon name="route" />מסלול ותפריט</NavLink>
                <NavLink to="/meals"><NavIcon name="book" />יומן אכילה</NavLink>
                <NavLink to="/ask"><NavIcon name="chat" />שאל את הדיאטן</NavLink>
            </nav>)}

            {user?.role === "ADMIN" && (<nav>
                <NavLink to="/admin/users" end><NavIcon name="users" />משתמשים</NavLink>
                <NavLink to="/admin/tracks"><NavIcon name="route" />מסלולים</NavLink>
                <NavLink to="/admin/foods"><NavIcon name="book" />מאכלים</NavLink>
                <NavLink to="/admin/answer"><NavIcon name="chat" />פניות משתמשים</NavLink>
            </nav>)}

            <Sprig />

            {user && (
                <div className="me">
                    <div className="avatar">{user.fullName.charAt(0)}</div>
                    <div>
                        <b>{user.fullName}</b>
                        <button type="button" onClick={exit}><NavIcon name="out" />יציאה</button>
                    </div>
                </div>
            )}
        </aside>
    )
}
