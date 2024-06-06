import WorkControllerCard from "../../components/workControllerCard";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TOKEN } from "../../constant";
import Cookies from "js-cookie";
import { request } from "../../server";
import { Button, Form, Input, Modal, message } from "antd";
import { BiLogOut } from "react-icons/bi";

import "./style.scss";

const OwnerDashboard = () => {
  const { setIsAuthenticated, isAuthenticated } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [payments, setPayments] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove(TOKEN);
  };

  const getData = async () => {
    try {
      setLoading(true);
      const response = await request.get("/auth/get-all-admins");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
    const getData = async () => {
      try {
        setLoading(true);
        const response = await request.get("/auth/get-all-admins");
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
        await request.put(`/auth/update-admin`, { ...user, id: selected });
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
        await request.delete(`/auth/delete-account/${id}`);
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
      const response = await request.get(`/auth/get-by-id-admin/${id}`);
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
    getPayments();
  };

  const getPayments = async () => {
    try {
      setLoading(true);
      const res = await request.get("money/get-all");
      setPayments(res.data);
    } finally {
      setLoading(false);
    }
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
                    <WorkControllerCard
                      onDelete={deleteController}
                      onEdit={editController}
                      onMoney={giveMoney}
                      key={element.id}
                      data={element}
                    />
                  ))}
            </div>
            <div>
              <center>
                <h1>Barcha o`tkazmalar</h1>
              </center>
              {loading
                ? "Loading..."
                : payments &&
                  payments.length > 0 && (
                    <div>
                      <hr />
                      {payments.map((payment) => (
                        <>
                          {" "}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              textAlign: "start !important",
                            }}
                            key={payment.id}
                          >
                            <b style={{ textAlign: "start" }}>
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
