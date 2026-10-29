import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/header";
import { UserContext } from "./context/userContext";

function App() {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <main className="public">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="shell">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
