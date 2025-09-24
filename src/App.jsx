import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Productos from "./pages/Productos";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar solo si no estamos en login */}
      {!isLoginPage && <Sidebar />}

      <main className={`${!isLoginPage ? 'ml-60' : 'flex-1'} flex-1 p-6`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
