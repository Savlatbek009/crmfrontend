import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import { AuthContext } from "./context/AuthContext";
import Cookies from "js-cookie";
import { ROLE } from "./constant";
import OwnerDashboard from "./pages/owner";

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const role = Cookies.get(ROLE);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {role == "SuperAdmin" ? (
            <>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/owner-dashboard" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/owner-dashboard"
                element={
                  isAuthenticated ? (
                    <OwnerDashboard />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </>
          ) : (
            ""
          )}
          <Route
            path="/"
            element={
              isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};
export default App;
