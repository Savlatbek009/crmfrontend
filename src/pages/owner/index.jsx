import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TOKEN } from "../../constant";
import Cookies from "js-cookie";
import { request } from "../../server";
import { Button, Form, Input, Modal, message } from "antd";
import WorkControllerCard from "../../components/workControllerCard";

import "./style.scss";
import { BiLogOut } from "react-icons/bi";

const OwnerDashboard = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove(TOKEN);
  };

  const getData = async () => {
    try {
      const response = await request.get("/auth/get-all-admins");
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

  // async function editWorkController() {
  //   try {
  //     setSelected(null);
  //     setIsModalOpen(true);
  //     // const { data } = await getSkill(id);
  //     // form.setFieldsValue(data);
  //   } catch (err) {
  //     // console.log(err);
  //   }
  // }

  const handleOk = async () => {
    try {
      let values = await form.validateFields();
      let user = {
        firstName: values.FirstName,
        lastName: values.LastName,
        userName: values.username,
        password: values.password,
      };
      if (selected) {
        await request.put(`/auth/update-admin/${selected.id}`, user);
        message.success(`O'zgartirildi`);
      } else {
        await request.post("auth/register", user);
        message.success(`Qo'shildi`);
      }
      form.resetFields();
      message.success(`Qo'shildi`);
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
    }
  };

  const deleteController = async (id) => {
    try {
      await request.delete(`/auth/delete-account/${id}`);
      getData();
      message.success(`Deleted successfully`);
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("Error deleting data");
    }
  };

  // const editController = async (id) => {
  //   try {
  //     const response = await request.get(`/auth/get-by-id-admin/${id}`);
  //     const controller = response.data;
  //     setSelected(controller);
  //     form.setFieldsValue({
  //       FirstName: controller.firstname,
  //       LastName: controller.lastName,
  //       username: controller.userName,
  //       password: "",
  //     });
  //     openModal();
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     message.error("Error fetching data");
  //   }
  // };

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
          <img src="/owner/owner.png" alt="" />
          <h1>ABDIJALIL XOLMAMATOV</h1>
          <p>{`OOO "SAIDAZIMSHOH" firmasini asoschisi`}</p>
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
              {data.map((element) => (
                <WorkControllerCard
                  onDelete={deleteController}
                  key={element.id}
                  data={element}
                />
              ))}
            </div>
          </div>
        </div>
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
