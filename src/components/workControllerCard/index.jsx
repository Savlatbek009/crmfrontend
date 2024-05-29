import { Button } from "antd";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const WorkControllerCard = ({ data, onDelete, onEdit, onMoney }) => {
  console.log(data);
  return (
    <>
      <div className="owner_work_controllers_row_card">
        <div className="owner_work_controllers_row_card_header">
          <img src="/work-controller/wc.png" alt="" />
        </div>
        <div className="spacing_in_card" style={{ height: "50px" }}></div>
        <div className="owner_work_controllers_row_card_body">
          <h1>
            {data.lastName.slice(0, 1)}. {data.firstname}
          </h1>
          <p>Ish Boshqaruvchi</p>
          <p>Hisobi: {data.balance}so'm</p>
          <div className="owner_work_controllers_row_card_body_buttons">
            <center>
              <Button
                onClick={() => onEdit(data.id)}
                type="primary"
              >{`O'zgartirish`}</Button>

              <Button
                onClick={() => onMoney(data.id)}
                danger
              >{`Pul berish`}</Button>
            </center>
            <center>
              <Button
                onClick={() => onDelete(data.id)}
                danger
              >{`O'chirish`}</Button>
            </center>
          </div>
        </div>
        <center>
          <Link
            onClick={() => {
              Cookies.set("work_controller_id", data.id);
            }}
            to={"/work-controller-dashboard"}
          >
            <Button type="primary" style={{ width: "100%" }}>
              Kirish
            </Button>
          </Link>
        </center>
      </div>
      <br className="spacing_in_bottom" />
    </>
  );
};

export default WorkControllerCard;
