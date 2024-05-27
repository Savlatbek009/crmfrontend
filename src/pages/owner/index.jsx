import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TOKEN } from "../../constant";
import Cookies from "js-cookie";
import { request } from "../../server";

import "./style.scss";
import { Button, Form, Input, Modal } from "antd";

const OwnerDashboard = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(1);
  const [form] = Form.useForm();

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

  const closeModal = () => {
    setIsModalOpen(false);

    form.resetFields();
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  async function editWorkController() {
    try {
      setSelected(null);
      setIsModalOpen(true);
      // const { data } = await getSkill(id);
      // form.setFieldsValue(data);
    } catch (err) {
      // console.log(err);
    }
  }

  const handleOk = async () => {
    // try {
    //   let values = await form.validateFields();
    //   if (selected === null) {
    //     await addSkill(values);
    //   } else {
    //     await updateSkill({ id: selected, body: values });
    //   }
    //   closeModal();
    //   form.resetFields();
    //   setSelected(null);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <>
      <Modal
        title={
          selected
            ? "Ish boshqaruvchi qo'shish"
            : "Ish boshqaruvchini o'zgartirish"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
        okText={selected ? "Qo'shish" : "O'zgartirish"}
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
              <button onClick={openModal}>{`Qo'shish`}</button>
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
                  <Button
                    onClick={editWorkController}
                    type="primary"
                  >{`O'zgartirish`}</Button>
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
                  <Button
                    onClick={editWorkController}
                    type="primary"
                  >{`O'zgartirish`}</Button>
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
                  <Button
                    onClick={editWorkController}
                    type="primary"
                  >{`O'zgartirish`}</Button>
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
                  <Button
                    onClick={editWorkController}
                    type="primary"
                  >{`O'zgartirish`}</Button>
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
    </>
  );
};

export default OwnerDashboard;
