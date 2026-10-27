import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getUsers, setUserStatus } from "../../api/admin";
import type { User } from "../../types/user";
import type { ApiError } from "../../types/common";

function UsersListPage() {
    const [search, setSearch] = useState("");


    const { data: users, isLoading, error } = useQuery({
        queryKey: ["users", search],
        queryFn: () => getUsers(search),
        placeholderData: keepPreviousData
    });

    const queryClient = useQueryClient();

    const mutation = useMutation<User, ApiError, { userid: number, isActive: boolean }>({
        mutationFn: ({ userid, isActive }) => setUserStatus(userid, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        }
    })


    if (isLoading) return <p>טוען...</p>
    if (error) return <p>{error.message}</p>

    return (
        <>
            <label>הזן שם לחיפוש
                <input value={search} type="text" onChange={(e) => setSearch(e.target.value)} />
            </label>
            {users?.length === 0 && <p>לא נמצאו משתמשים</p>}
            <ul>
                {users?.map((user) => (

                    <li key={user.id}>
                        {user.fullName} | {user.email} | {user.track ? user.track.name : <>לא נבחר מסלול</>} | {user.shareWithDietitian ? <>משתף</> : <>לא משתף</>} | {user.pendingConsultations} פניות ממתינות | {user.isActive ? "פעיל" : "חסום"}
                        <button type="button" onClick={() => mutation.mutate({ userid: user.id, isActive: !user.isActive })}>{user.isActive ? <>חסימת משתמש</> : <>שחרור משתמש</>}</button>
                        <Link to={`/admin/user/${user.id}`}>מעבר לעמוד המשתמש</Link>
                    </li>
                )
                )}
                {mutation.error && <p>{mutation.error.message}</p>}
            </ul>
        </>
    )


}
export default UsersListPage;