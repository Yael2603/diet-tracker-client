import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./context/userContext";
import type{ Role } from "./types/common";

export const UserProtected = ({ type }: { type: Role[] }) => {
  const{user,isLoading}=useContext(UserContext);
  if(isLoading) return <>טוען...</>
  if (!user) return <Navigate to="/login" replace />;
  if (!type.includes(user.role)) return <div>אין לך הרשאות מתאימות</div>;
  return <Outlet />;
};