import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const { login } = useAuth();

  return (
    <div>
      <h1>Please log in</h1>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default LoginForm;
