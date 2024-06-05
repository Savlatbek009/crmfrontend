import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { TOKEN } from "../../constant";
import Cookies from "js-cookie";
import { request } from "../../server";
import { Button, Form, Input, Modal, message } from "antd";
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
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState(false);
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
      console.log(response.data.workers);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPayments = async (id) => {
    try {
      const res = await request.get("worker/get-by-id-worker/" + id);
      setPayments({ ...payments, [id]: res.data.transactions });
    } catch (err) {
      message.error("Xatolik yuz berdi");
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

  const giveMoney = async (id) => {
    const moneyAnmount = prompt("Summani kiriting");
    const userId = Cookies.get("work_controller_id");
    try {
      const res = await request.post("money/give-money-to-worker", {
        toUserId: id,
        fromUserId: userId,
        amount: moneyAnmount,
      });
      getData();
      getPayments(id);
      console.log(res);
    } catch (err) {
      message.error(
        "Sizda mablag' yetarli emas yoki ishchi faoliyatini to'xtatgan"
      );
    }
  };

  const stopCareer = async (id) => {
    try {
      await request.patch("worker/endtime", {
        id,
        endTime: new Date().toISOString().slice(0, 10),
      });
      getData();
    } catch (error) {
      console.log(error);
    }
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
                        <b style={{ width: "33%" }}>{worker.position}</b>
                        <b style={{ width: "33%" }}>{worker.workPlace}da</b>
                        <b style={{ width: "33%" }}>
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
                            : worker.endTime}
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
                            worker.earnedMoney >
                          0
                            ? (
                                Math.floor(
                                  (new Date().getTime() -
                                    new Date(worker.startTime).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                ) *
                                  worker.salaryDaily -
                                worker.earnedMoney
                              ).toLocaleString()
                            : "0"}
                          {`so'm`}
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
                          <b>
                            {Math.floor(
                              (new Date().getTime() -
                                new Date(worker.startTime).getTime()) /
                                (1000 * 60 * 60 * 24)
                            ).toLocaleString() *
                              worker.salaryDaily -
                              worker.earnedMoney >
                            0
                              ? "Biz Qarzmiz"
                              : "Bizdan qarz"}
                          </b>
                          {(
                            Math.floor(
                              (new Date().getTime() -
                                new Date(worker.startTime).getTime()) /
                                (1000 * 60 * 60 * 24)
                            ) *
                              worker.salaryDaily -
                            worker.earnedMoney
                          ).toLocaleString()}
                          {`so'm`}
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
                          <b>Pul berilgan:</b>{" "}
                          {worker.earnedMoney.toLocaleString()}
                          {`so'm`}
                        </p>
                        <br />
                        {payments[worker.id] &&
                          payments[worker.id].length > 0 && (
                            <div>
                              <h3>O`tkazmalar tarixi</h3>
                              <hr />
                              {payments[worker.id].map((payment) => (
                                <>
                                  {" "}
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
                        <br />
                        <p>
                          <Button
                            onClick={() => giveMoney(worker.id)}
                            type="primary"
                          >
                            Pul berish
                          </Button>

                          <Button onClick={() => stopCareer(worker.id)} danger>
                            {`To'xtatish`}
                          </Button>
                          <Button onClick={() => getPayments(worker.id)} danger>
                            {`To'lovlarni ko'rish`}
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
          <h1>
            Mablag`: {Number(data.balance).toLocaleString()}
            {`so'm`}
          </h1>
        </center>
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
