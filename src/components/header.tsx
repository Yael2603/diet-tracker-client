import { useContext } from "react"
import { NavLink,useNavigate } from "react-router-dom"
import { UserContext } from "../context/userContext"

export default function Header() {

    const{user,setLogout}=useContext(UserContext)
    const navigate = useNavigate();
    const exit = ()=>{
        setLogout();
        navigate("/login");
    }

    return (
        <header>
            <h1>מסלול בריא</h1>

            {user&&<span>שלום {user.fullName}</span>}

            {user?.role==="USER"&&(<nav>
                <NavLink to="/" end >הבית שלי</NavLink>
                <NavLink to="/plan">מסלול ותפריט</NavLink>
                <NavLink to="/meals">יומן אכילה</NavLink>
                <NavLink to="/ask">שאל את הדיאטן</NavLink>
            </nav>)}

            {user?.role==="ADMIN"&&(<nav>
                <NavLink to="/admin/users" end>הבית שלי</NavLink>
                <NavLink to="/admin/tracks">מסלול ותפריט</NavLink>
                <NavLink to="/admin/foods">יומן אכילה</NavLink>
                <NavLink to="/admin/answer">שאל את הדיאטן</NavLink>
            </nav>)}

            {user&&<button onClick={exit}>יציאה</button>}
        </header>
    )
}