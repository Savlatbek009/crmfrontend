import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const WorkControllerDashboard = () => {
  const { username, role } = useContext(AuthContext);

  return (
    <div>
      <h1>Work Controller Dashboard</h1>
      <p>
        Welcome, {username} ({role})!
      </p>
    </div>
  );
};

export default WorkControllerDashboard;
