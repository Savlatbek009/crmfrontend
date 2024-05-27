import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TOKEN } from "../../constant";
import Cookies from "js-cookie";
import { request } from "../../server";
import { Button, Form, Input, Modal } from "antd";
import { BiLogOut } from "react-icons/bi";

import "./style.scss";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";

const WorkControllerDashboard = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove(TOKEN);
    window.location.href = "/login";
  };

  const getData = async () => {
    const work_controller_id = Cookies.get("work_controller_id");
    try {
      const response = await request.get(
        "/auth/get-by-id-admin/" + work_controller_id
      );
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

  // const handleOk = async () => {
  //   try {
  //     let values = await form.validateFields();
  //     let user = {
  //       firstName: values.FirstName,
  //       lastName: values.LastName,
  //       userName: values.username,
  //       password: values.password,
  //     };
  //     if (selected) {
  //       await request.put(`/auth/update-admin/${selected.id}`, user);
  //       message.success(`O'zgartirildi`);
  //     } else {
  //       await request.post("auth/register", user);
  //       message.success(`Qo'shildi`);
  //     }
  //     form.resetFields();
  //     message.success(`Qo'shildi`);
  //     getData();
  //     setSelected(null);
  //     closeModal();
  //   } catch (error) {
  //     if (error.response) {
  //       console.error("Server Error:", error.response.data);
  //     } else if (error.request) {
  //       console.error("Network Error:", error.request);
  //     } else {
  //       console.error("Error:", error.message);
  //     }
  //   }
  // };

  // const deleteController = async (id) => {
  //   try {
  //     await request.delete(`/auth/delete-account/${id}`);
  //     getData();
  //     message.success(`Deleted successfully`);
  //   } catch (error) {
  //     console.error("Error deleting data:", error);
  //     message.error("Error deleting data");
  //   }
  // };

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
        title={"Ishchi qo'shish"}
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={closeModal}
        okText={"Qo'shish"}
      >
        <Form
          form={form}
          name="ishchi"
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
            label="Abyom"
            name="obyom"
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
            label="Vazifasi"
            name="password"
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
            label="Kungi to'lanadi"
            name="password"
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
            label="Ish boshlash vaqti"
            name="password"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <section className="wc">
        <div className="wc_header">
          <img src="/work-controller/wc.png" alt="" />
          <h1>
            {data.lastName} {data.firstname}
          </h1>
          <p>{`OOO "SAIDAZIMSHOH" firmasida ish boshqaruvchi`}</p>
        </div>
        <div style={{ height: "200px" }}></div>
        <hr style={{ marginBottom: "35px" }} />
        <div className="container">
          <div className="wc_work_controllers">
            <center>
              {" "}
              <h1>Ishchilar</h1>
            </center>
            <div className="wc_work_controllers_header">
              <input
                placeholder="Search..."
                autoComplete="false"
                type="search"
                name="search"
              />
              <button onClick={openModal}>{`Qo'shish`}</button>
            </div>
            <br />
            <div className="wc_work_controllers_row">
              <Accordion allowMultipleExpanded allowZeroExpanded>
                <AccordionItem>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <b>{`G'isht yetkazuvchi`}</b>
                      <b>{`Samarqand city obyetkida`}</b>
                      <b>Abdullayev Savlatbek</b>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "blue",
                        }}
                      >
                        <b>Ish Tarixi:</b> 20.11.2023 - 20.04.2024
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "green",
                        }}
                      >
                        <b>Pul berilgan:</b> 9,000,000 so'm
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "red",
                        }}
                      >
                        <b>Pul berilishi kerak:</b> 10,000,000 so'm
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "red",
                        }}
                      >
                        <b>Qarzimiz:</b> 1,000,000 so'm
                      </p>
                    </p>
                  </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <b>{`G'isht yetkazuvchi`}</b>
                      <b>{`Samarqand city obyetkida`}</b>
                      <b>Abdullayev Savlatbek</b>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "blue",
                        }}
                      >
                        <b>Ish Tarixi:</b> 20.11.2023 - 20.04.2024
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "green",
                        }}
                      >
                        <b>Pul berilgan:</b> 10,000,000 so'm
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "green",
                        }}
                      >
                        <b>Pul berilishi kerak:</b> 10,000,000 so'm
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "green",
                        }}
                      >
                        <b>Qarzimiz:</b> 0
                      </p>
                    </p>
                  </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <b>{`G'isht yetkazuvchi`}</b>
                      <b>{`Samarqand city obyetkida`}</b>
                      <b>Abdullayev Savlatbek</b>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "blue",
                        }}
                      >
                        <b>Ish Tarixi:</b> 20.11.2023 - Hozirgacha
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "green",
                        }}
                      >
                        <b>Pul berilgan:</b> 11,000,000 so'm
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "red",
                        }}
                      >
                        <b>Pul berilishi kerak:</b> 10,000,000 so'm
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          borderBottom: "1px solid #000",
                          paddingTop: "5px",
                          color: "red",
                        }}
                      >
                        <b>Qarzi:</b> 1,000,000 so'm
                      </p>
                    </p>
                  </AccordionItemPanel>
                </AccordionItem>
              </Accordion>
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

export default WorkControllerDashboard;
