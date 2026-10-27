import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Userprovider from "./context/userContext";
import { UserProtected } from "./protected";

import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import PlanPage from "./pages/PlanPage";
import MealsPage from "./pages/MealsPage";
import AskDietitianPage from "./pages/AskDietitianPage";
import UsersListPage from "./pages/admin/UsersListPage";
import UserDetailsPage from "./pages/admin/UserDetailsPage";
import TracksPage from "./pages/admin/TracksPage";
import FoodsPage from "./pages/admin/FoodsPage";
import AnswerUsersPage from "./pages/admin/AnswerUsersPage";

const routes = createBrowserRouter([
  {
    path: "",
    element: (<Userprovider>
      <App />
      </Userprovider >),
      children: [
      {path: "login", element: <LoginPage /> },
      {
        element: <UserProtected type={["USER"]} />,
      children: [
      {path: "", element: <HomePage /> },
      {path: "plan", element: <PlanPage /> },
      {path: "meals", element: <MealsPage /> },
      {path: "ask", element: <AskDietitianPage /> },
      ],
      },
      {
        path: "admin",
      element: <UserProtected type={["ADMIN"]} />,
      children: [
      {path: "users", element: <UsersListPage /> },
      {path: "user/:id", element: <UserDetailsPage /> },
      {path: "tracks", element: <TracksPage /> },
      {path: "foods", element: <FoodsPage /> },
      {path: "answer", element: <AnswerUsersPage /> },
      ],
      },
      {path: "*", element: <NotFoundPage /> },
      ],
  },
      ]);

      export default routes;