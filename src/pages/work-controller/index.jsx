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
import { PiPlusBold } from "react-icons/pi";


const WorkControllerDashboard = () => {
  const { Search } = Input;
  const { setIsAuthenticated } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [workPlaces, setWorkPlaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [payments, setPayments] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [loading, setLoading] = useState(false)
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

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPayments = async (id) => {
    if (!isShow) {
      try {
        const res = await request.get("worker/get-by-id-worker/" + id);
        const transactions = {};

        res.data.workPlaces.forEach(workPlace => {
          transactions[workPlace.id] = workPlace.transactions;
        });

        setPayments(transactions);


      } catch (err) {
        message.error("Xatolik yuz berdi");
      }
    }
    setIsShow(!isShow);

  };

  const getWorkPlaces = async (id) => {
    try {
      const res = await request.get("worker/get-by-id-worker/" + id);
      setWorkPlaces({ ...workPlaces, [id]: res.data.workPlaces })
      console.log(workPlaces);
    } catch (err) {
      message.error("Xatolik yuz berdi");
    }
  }

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

  const closeModal2 = () => {
    setIsModalOpen2(false);
    form.resetFields();
  };

  const openModal2 = (id) => {
    Cookies.set('worker_id', id)
    setIsModalOpen2(true);
  };

  const handleOk2 = async (e) => {
    const id = Cookies.get('worker_id')

    try {
      let user = {
        name: e.name,
        amount: e.amount,
        workerId: id
      }
      await request.post('place/create/', user);
      message.success(`Qo'shildi`);
      getWorkPlaces(id);
      closeModal2();
    } catch (err) {
      console.log('Nomalum xato, iltimos sahifani yangilang');
    }
  }
  const handleOk = async () => {
    const work_controller_id = Cookies.get("work_controller_id");

    try {
      let values = await form.validateFields();
      let user = {
        firstName: values.firstName,
        lastName: values.lastName,
        position: values.position,
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



  const giveMoney = async (id, id2) => {
    const moneyAnmount = prompt("Summani kiriting");
    const userId = Cookies.get("work_controller_id");
    try {
      await request.post("money/give-money-to-worker", {
        toUserId: id2,
        fromUserId: userId,
        placeId: id,
        amount: moneyAnmount,
      });
      getPayments(id2);
      getWorkPlaces(id2)
      getData()
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

  const onFilter = async (e) => {
    try {
      if (e) {
        setLoading(true)
        const res = await request.get('worker/filter-worker/' + e)
        const res2 = await request.get('place/filter-place/' + e)
        if (res.status === 200 && res2.status === 200) {
          setWorkers([...res.data, ...res2.data])
        } else if (res.status === 200) {
          setWorkers(res.data)
        } else if (res2.status === 200) {
          setWorkers(res2.data)
        } else {
          setWorkers([])
        }
      } else {
        getData()
      }

    } finally {
      setLoading(false)
    }
  }




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
          {/* <Form.Item
            label="Obyekt"
            name="workPlace"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input />
          </Form.Item> */}
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
          {/* <Form.Item
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
          </Form.Item> */}
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
      <Modal
        title={"Abyom qo'shish"}
        open={isModalOpen2}
        onCancel={closeModal2}
      >
        <Form
          name="ishchi"
          onFinish={handleOk2}
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
            label="Obyekt nomi"
            name="name"
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
            label="Kelishilgan summa"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please fill !",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button htmlType="submit">{`Qo'shish`}</Button>
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
            <center className="wc_work_controllers_header1" >
              <p>Ishchilar</p>
              <br />
              <Search placeholder="Qidirish..." onSearch={onFilter} size="large" enterButton /> <br /><br />
              <button className="add_new_admin_button" onClick={openModal}><PiPlusBold /> {`Qo'shish`}</button>
            </center>
            <br />
            <div className="wc_work_controllers_row">
              <Accordion allowMultipleExpanded allowZeroExpanded>
                {
                  loading ? <center style={{ marginTop: '9px', color: 'red' }}><h1>Yuklanmoqda...</h1></center> :
                    workers.length ? workers.map((worker) => (
                      <AccordionItem key={worker.id}>
                        <AccordionItemHeading>
                          <AccordionItemButton>
                            <b style={{ width: "40%" }}>{worker.position}</b>

                            <b style={{ width: "40%" }}>
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
                            {workPlaces[worker.id] &&
                              workPlaces[worker.id].length > 0 && (
                                <div >
                                  {workPlaces[worker.id].map((workPlace) => (
                                    <>
                                      <div style={{ background: '#ddd', padding: '10px' }}>
                                        <center><h2 style={{ color: 'blue' }}>{workPlace.name}</h2></center>
                                        <b style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>pul berilishi kerak: <b style={{ color: "green" }}>{workPlace.amount.toLocaleString()}so`m</b></b>
                                        <b style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>pul berildi: <b style={{ color: "green" }}>{workPlace.earnedMoney.toLocaleString()}so`m</b></b>
                                        <b>
                                          <b style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {workPlace.amount - workPlace.earnedMoney < 0 ? "Bizdan qarz" : "Biz qarzmiz"}
                                            <b style={{
                                              color: workPlace.amount - workPlace.earnedMoney < 0 ? "red" : "green"
                                            }}>{(workPlace.amount - workPlace.earnedMoney).toLocaleString()}so`m</b></b>
                                        </b>
                                      </div>
                                      {isShow ?
                                        payments[workPlace.id] && payments[workPlace.id].length > 0 && (
                                          <div style={{ background: '#f5f5f5', padding: '10px' }}>
                                            <hr />
                                            {payments[workPlace.id].map((payment) => (
                                              <>
                                                <div
                                                  key={payment.id}
                                                  style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <b>
                                                    {payment.time.slice(0, 10)} <br />{" "}
                                                    {payment.time.slice(11, 16)}
                                                  </b>
                                                  <b style={{ color: "green" }}>
                                                    {payment.amount.toLocaleString()} {`so'm`}
                                                  </b>
                                                </div>
                                                <hr />
                                              </>
                                            ))}
                                          </div>
                                        ) : null}
                                      <Button
                                        style={{ margin: '10px 0' }}
                                        onClick={() => giveMoney(workPlace.id, worker.id)}
                                        type="primary"
                                      >
                                        Pul berish
                                      </Button>
                                      <hr />
                                    </>
                                  ))}
                                </div>
                              )}

                            <div>

                            </div>
                            <br />
                            <center className="buttons_container">


                              <Button onClick={() => stopCareer(worker.id)} danger>
                                {`To'xtatish`}
                              </Button>
                              <Button onClick={() => getPayments(worker.id)} danger>
                                {isShow ? `To'lovlarni yopish` : `To'lovlarni ochish`}
                              </Button>
                              <Button
                                onClick={() => getWorkPlaces(worker.id)}
                                type="primary"
                              >
                                {`Ish joylarini ko'rish`}
                              </Button>
                              <Button
                                onClick={() => openModal2(worker.id)}
                                type="primary"
                              >
                                {`Abyom qo'shish`}
                              </Button>
                            </center>
                          </p>
                        </AccordionItemPanel>
                      </AccordionItem>)) : <center style={{ marginTop: '9px', color: 'red' }}><h1>Topilmadi :(</h1></center>}
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
      </section >
    </>
  );
}
export default WorkControllerDashboard;
