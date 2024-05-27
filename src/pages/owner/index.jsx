import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TOKEN } from "../../constant";
import Cookies from "js-cookie";
import { request } from "../../server";

import "./style.scss";
import { Button } from "antd";

const OwnerDashboard = () => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove(TOKEN);
  };

  const getData = async () => {
    const data = await request.get("/auth/login");
    console.log(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="owner">
      <div className="owner_header">
        <img src="/owner/owner.png" alt="" />
        <h1>ABDIJALIL XOLMAMATOV</h1>
        <p>{`OOO "SAIDAZIMSHOH"`}</p>
      </div>
      <div style={{ height: "200px" }}></div>
      <hr style={{ marginBottom: "35px" }} />
      <div className="container">
        <div className="owner_work_controllers">
          <center>
            <h1>Ish Boshqaruvchilar</h1>
          </center>
          <div className="owner_work_controllers_header">
            <input
              placeholder="Search..."
              autoComplete="false"
              type="search"
              name="search"
            />
            <button>{`Qo'shish`}</button>
          </div>
          <div className="owner_work_controllers_row">
            <div className="owner_work_controllers_row_card">
              <div className="owner_work_controllers_row_card_header">
                <img src="/work-controller/wc.png" alt="" />
              </div>
              <div style={{ height: "50px" }}></div>
              <div className="owner_work_controllers_row_card_body">
                <h1>A. Savlatbek</h1>
                <p>Ish Boshqaruvchi</p>
                <Button type="primary">{`O'zgartirish`}</Button>
                <Button danger>{`O'chirish`}</Button>
              </div>
            </div>
            <div className="owner_work_controllers_row_card">
              <div className="owner_work_controllers_row_card_header">
                <img src="/work-controller/wc.png" alt="" />
              </div>
              <div style={{ height: "50px" }}></div>
              <div className="owner_work_controllers_row_card_body">
                <h1>A. Savlatbek</h1>
                <p>Ish Boshqaruvchi</p>
                <Button type="primary">{`O'zgartirish`}</Button>
                <Button danger>{`O'chirish`}</Button>
              </div>
            </div>
            <div className="owner_work_controllers_row_card">
              <div className="owner_work_controllers_row_card_header">
                <img src="/work-controller/wc.png" alt="" />
              </div>
              <div style={{ height: "50px" }}></div>
              <div className="owner_work_controllers_row_card_body">
                <h1>A. Savlatbek</h1>
                <p>Ish Boshqaruvchi</p>
                <Button type="primary">{`O'zgartirish`}</Button>
                <Button danger>{`O'chirish`}</Button>
              </div>
            </div>
            <div className="owner_work_controllers_row_card">
              <div className="owner_work_controllers_row_card_header">
                <img src="/work-controller/wc.png" alt="" />
              </div>
              <div style={{ height: "50px" }}></div>
              <div className="owner_work_controllers_row_card_body">
                <h1>A. Savlatbek</h1>
                <p>Ish Boshqaruvchi</p>
                <Button type="primary">{`O'zgartirish`}</Button>
                <Button danger>{`O'chirish`}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <center>
        <Button danger onClick={logout}>
          Logout
        </Button>
      </center>
      <br />
    </section>
  );
};

export default OwnerDashboard;
