import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Cookies from "js-cookie";
import { TOKEN } from "../../constant";

const HomePage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove(TOKEN);
  };
  return (
    <div>
      <h1>Welcome, you are logged in!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default HomePage;
