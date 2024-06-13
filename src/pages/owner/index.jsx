import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TOKEN } from "../../constant";
import Cookies from "js-cookie";
import { request } from "../../server";
import { Button, Form, Input, Modal, message } from "antd";
import { BiLogOut } from "react-icons/bi";

import "./style.scss";
import { Link } from "react-router-dom";

const OwnerDashboard = () => {
  const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [payments, setPayments] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isShow, setIsShow] = useState(false)

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove(TOKEN);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await request.get("auth/get-all-admins");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await request.get("auth/get-all-admins");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [isAuthenticated]);

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelected(null);
    console.log(selected);
  };

  const openModal = () => {
    setIsModalOpen(true);
    console.log(selected);
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      let values = await form.validateFields();
      let user = {
        firstName: values.FirstName,
        lastName: values.LastName,
        userName: values.username,
        password: values.password,
      };
      if (selected) {
        await request.put(`auth/update-admin`, { ...user, id: selected });
        message.success(`O'zgartirildi`);
        console.log(user);
      } else {
        await request.post("auth/register", user);
        message.success(`Qo'shildi`);
      }
      form.resetFields();
      getData();
      setSelected(null);
      closeModal();
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
      } else if (error.request) {
        console.error("Network Error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteController = async (id) => {
    const canIDelete = confirm("O'chirishga ishongching komilmi?");
    if (canIDelete) {
      try {
        await request.delete(`auth/delete-account/${id}`);
        getData();
        message.success(`O'chirildi`);
      } catch (error) {
        console.error("Error deleting data:", error);
        message.error("Error deleting data");
      }
    } else {
      message.error("O'chirish bekor qilindi");
    }
    getPayments();
  };

  const editController = async (id) => {
    try {
      const response = await request.get(`auth/get-by-id-admin/${id}`);
      const controller = response.data;
      setSelected(controller.id);
      form.setFieldsValue({
        FirstName: controller.firstname,
        LastName: controller.lastName,
        username: controller.userName,
        password: "",
      });
      openModal();
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Error fetching data");
    }
  };

  const giveMoney = async (id) => {
    const moneyAnmount = prompt("Summani kiriting");
    try {
      const res = await request.post(
        `money/give-money-to-worker-controller?userId=${id}&amount=${moneyAnmount}`,
        {
          userId: id,
          amount: moneyAnmount,
        }
      );
      getData();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    getPayments(id);
  };

  const getPayments = async (id) => {
    if (!isShow) {

      try {
        const res = await request.get("auth/get-by-id-admin/" + id);
        setPayments({ ...payments, [id]: res.data.transactions });
      } catch (err) {
        message.error("Xatolik yuz berdi");
      }
    }
    setIsShow(!isShow)
  };

  return (
    <>
      <Modal
        title={
          selected
            ? "Ish boshqaruvchini o'zgartirish"
            : "Ish boshqaruvchi qo'shish"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
        okText={selected ? "O'zgartirish" : "Qo'shish"}
      >
        <Form
          form={form}
          name="skill"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Ism"
            name="FirstName"
            rules={[
              {
                required: true,
                message: "Please fill !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Familiya"
            name="LastName"
            rules={[
              {
                required: true,
                message: "Please fill !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Foydalanuvchi ismi"
            name="username"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Parol"
            name="password"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
      <section className="owner">
        <div className="owner_header">
          <div className="owner_header_container">
            <div className="container">
              <div className="owner_header_container_header">
                <div>
                  <p>{`Республика Узбекистан город Ташкент OOO "SAIDAZIMSHOH"`}</p>
                </div>

                <div>
                  <p>{`O'zbekiston Respublikasi Toshkent shahar MCHJ "SAIDAZIMSHOH"`}</p>
                </div>
              </div>
            </div>
            <img src="/owner/owner.png" alt="" />

            <div>
              <h1>ABDIJALIL XOLMAMATOV</h1>
              <p>{`OOO "SAIDAZIMSHOH" firmasini asoschisi`}</p>
            </div>
          </div>
        </div>
        <div style={{ height: "200px" }}></div>
        <hr style={{ marginBottom: "35px" }} />
        <div className="container">
          <div className="owner_work_controllers">
            <div className="owner_work_controllers_header">
              <center>
                {" "}
                <h1>Ish Boshqaruvchilar</h1>
              </center>
              <button onClick={openModal}>{`Qo'shish`}</button>
            </div>
            <div className="owner_work_controllers_row">
              {loading
                ? "loading..."
                : data.map((element) => (
                  <div key={element.id}>
                    <div className="owner_work_controllers_row_card">
                      <div className="owner_work_controllers_row_card_header">
                        <img src="/work-controller/wc.png" alt="" />
                      </div>
                      <div className="spacing_in_card" style={{ height: "50px" }}></div>
                      <div className="owner_work_controllers_row_card_body">
                        <h1>
                          {element.lastName.slice(0, 1)}. {element.firstname}
                        </h1>
                        <p>Ish Boshqaruvchi</p>
                        <p>Hisobi: {Number(element.balance).toLocaleString()}{`so'm`}</p>
                        {isShow && payments[element.id] &&
                          payments[element.id].length > 0 && (
                            <div>
                              <h3>O`tkazmalar tarixi</h3>
                              <hr />
                              {payments[element.id].map((payment) => (
                                <>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                    key={payment.id}
                                  >
                                    <b>
                                      {payment.time.slice(0, 10)} <br />{" "}
                                      {payment.time.slice(10, 16)}
                                    </b>
                                    <b>{payment.amount.toLocaleString()}so`m</b>
                                  </div>
                                  <hr />
                                </>

                              ))}
                            </div>
                          )}
                        <div className="owner_work_controllers_row_card_body_buttons">
                          <center>
                            <Button
                              onClick={() => editController(element.id)}
                              type="primary"
                            >{`O'zgartirish`}</Button>

                            <Button onClick={() => giveMoney(element.id)}>{`Pul berish`}</Button>
                          </center>
                          <center>
                            <Button
                              onClick={() => deleteController(element.id)}
                              danger
                            >{`O'chirish`}</Button>
                            <Button
                              onClick={() => getPayments(element.id)}
                              danger
                            >
                              {isShow ? `To'lovlarni yopish` : `To'lovlarni ochish`}
                            </Button>
                          </center>
                        </div>
                      </div>
                      <center>
                        <Link
                          onClick={() => {
                            Cookies.set("work_controller_id", element.id);
                          }}
                          to={"/work-controller-dashboard"}
                        >
                          <Button
                            style={{
                              width: "100%",
                              borderRadius: "0",
                              backgroundColor: "#000",
                              color: "#fff",
                              borderColor: "#000",
                              fontSize: "19px",
                              padding: "10px",
                              height: "auto",
                            }}
                          >
                            Kirish
                          </Button>
                        </Link>
                      </center>
                    </div>
                    <br className="spacing_in_bottom" />
                  </div>
                ))}
            </div>

          </div>
        </div>
        <br />
        <center>
          <Button
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
            danger
            onClick={logout}
          >
            Chiqish <BiLogOut />
          </Button>
        </center>
        <br />
      </section>
    </>
  );
};

export default OwnerDashboard;
