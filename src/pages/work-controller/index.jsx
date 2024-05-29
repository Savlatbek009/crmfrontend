import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TOKEN } from "../../constant";
import Cookies from "js-cookie";
import { request } from "../../server";
import { Button, Form, Input, Modal, message } from "antd";
import { BiLogOut, BiLogoAirbnb } from "react-icons/bi";

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
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenMoney, setIsModalOpenMoney] = useState(false);
  const [moneyInput, setMoneyInput] = useState(0);
  const [form] = Form.useForm();

  const logout = () => {
    setIsAuthenticated(false);
    Cookies.remove(TOKEN);
    window.location.href = "/";
  };

  const getData = async () => {
    const work_controller_id = Cookies.get("work_controller_id");
    try {
      const response = await request.get(
        "/auth/get-by-id-admin/" + work_controller_id
      );
      setData(response.data);
      setWorkers(response.data.workers);
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

  const openModalMoney = async (id) => {
    setIsModalOpenMoney(true);
    const res = await request.put("worker/update", {
      id,
      earnedMoney: moneyInput,
    });
    console.log(res);
    // try {
    //   await request.post("worker/create", user);
    //   message.success(`Qo'shildi`);
    //   form.resetFields();
    //   getData();
    //   closeModal();
    // } catch (error) {
    //   if (error.response) {
    //     console.error("Server Error:", error.response.data);
    //   } else if (error.request) {
    //     console.error("Network Error:", error.request);
    //   } else {
    //     console.error("Error:", error.message);
    //   }
    // }
  };

  const handleOk = async () => {
    const work_controller_id = Cookies.get("work_controller_id");

    try {
      let values = await form.validateFields();
      let user = {
        firstName: values.firstName,
        lastName: values.lastName,
        position: values.position,
        salaryDaily: values.salaryDaily,
        workPlace: values.workPlace,
        startTime: values.startTime,
        userId: work_controller_id,
      };

      await request.post("worker/create", user);
      message.success(`Qo'shildi`);
      form.resetFields();
      getData();
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

  const stopCareer = async (id) => {
    const work_controller_id = Cookies.get("work_controller_id");
    console.log(id, work_controller_id);
    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const readyDate = formattedDate.split("/").reverse().join("-");
    const res1 = await request.get("/worker/get-all");
    console.log(res1);
    const res = await request.put("/worker/update", {
      id,
      userId: work_controller_id,
      endTime: readyDate + "T00:00:00",
      firstName: "Savlatbek",
      lastName: "Abdullayev",
      position: "yuk tashuvchi",
      salaryDaily: 100000,
      earnedMoney: 0,
      workPlace: "Sxf",
      startTime: "2024-04-29T00:00:00",
    });
    console.log(res);
  };

  return (
    <>
      <Modal
        title={"Ishchi qo'shish"}
        open={isModalOpen}
        onOk={handleOk}
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
            name="firstName"
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
            name="lastName"
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
            name="workPlace"
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
            name="position"
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
            name="salaryDaily"
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
            name="startTime"
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
                {workers.map((worker) => (
                  <AccordionItem key={worker.id}>
                    <AccordionItemHeading>
                      <AccordionItemButton>
                        <b>{worker.position}</b>
                        <b>{worker.workPlace}da</b>
                        <b>
                          {worker.firstName} {worker.lastName}
                        </b>
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
                          <b>Ish Tarixi:</b> {worker.startTime.slice(0, 10)} -
                          {worker.endTime.startsWith("000")
                            ? " Hozirgacha"
                            : " 20.04.2024"}
                        </p>
                        <p
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #000",
                            paddingTop: "5px",
                            color: worker.earnedMoney ? "green" : "red",
                          }}
                        >
                          <b>Pul berilgan:</b> {worker.earnedMoney}
                        </p>
                        <p
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #000",
                            paddingTop: "5px",
                          }}
                        >
                          <b>Pul berilishi kerak:</b>{" "}
                          {Math.floor(
                            (new Date().getTime() -
                              new Date(worker.startTime).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) *
                            worker.salaryDaily -
                            worker.earnedMoney}
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
                          <b>Qarzimiz:</b>
                          {Math.floor(
                            (new Date().getTime() -
                              new Date(worker.startTime).getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) *
                            worker.salaryDaily -
                            worker.earnedMoney}
                        </p>
                        <br />
                        <p>
                          {isModalOpenMoney ? (
                            <>
                              <br />
                              <Input
                                onChange={(e) => setMoneyInput(e.target.value)}
                                style={{ width: "200px" }}
                                value={moneyInput}
                                type="text"
                              />
                              <br />
                              <br />
                            </>
                          ) : (
                            ""
                          )}
                          <Button
                            onClick={() => openModalMoney(worker.id)}
                            type="primary"
                          >
                            Pul berish
                          </Button>
                          {isModalOpenMoney ? (
                            <>
                              <Button
                                onClick={() => setIsModalOpenMoney(false)}
                                danger
                                style={{ marginLeft: "10px" }}
                              >
                                Yopish
                              </Button>
                            </>
                          ) : (
                            ""
                          )}
                          <Button onClick={() => stopCareer(worker.id)} danger>
                            To'xtatish
                          </Button>
                        </p>
                      </p>
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
        <br />
        <center>
          <h1>Balance: {data.balance}so'm</h1>
        </center>
        <center>
          <Button
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
            danger
            onClick={logout}
          >
            Chiqish <BiLogOut />
          </Button>
        </center>
        <center></center>
        <br />
      </section>
    </>
  );
};

export default WorkControllerDashboard;
