import { useContext, useState } from "react";
import { Button, Form, Input, message } from "antd";
import Cookies from "js-cookie";
import { request } from "../../server";
import { ROLE, TOKEN } from "../../constant";
import { AuthContext } from "../../context/AuthContext";

import "./style.scss";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const res = await request.post("auth/login", {
        UserName: username,
        password,
      });
      Cookies.set(TOKEN, res.data.token);
      Cookies.set(ROLE, res.data.role);
      Cookies.set("work_controller_id", res.data.id);
      message.success("Siz muvafaqiyatli kirdingiz!");
      setIsAuthenticated(true);
      window.location.href = "/";
    } catch (error) {
      message.error("Foydalanuvchi ismi yoki Parol xato!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="login">
      <div className="container">
        <h1>Login</h1>
        <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <center>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </center>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default LoginPage;
