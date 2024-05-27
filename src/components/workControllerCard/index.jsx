import { Button } from "antd";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const WorkControllerCard = ({ data, onDelete }) => {
  console.log(data);
  return (
    <>
      {" "}
      <Link
        onClick={() => {
          Cookies.set("work_controller_id", data.id);
        }}
        to={"/work-controller-dashboard"}
        className="owner_work_controllers_row_card"
      >
        <div className="owner_work_controllers_row_card_header">
          <img src="/work-controller/wc.png" alt="" />
        </div>
        <div className="spacing_in_card" style={{ height: "50px" }}></div>
        <div className="owner_work_controllers_row_card_body">
          <h1>
            {data.lastName.slice(0, 1)}. {data.firstname}
          </h1>
          <p>Ish Boshqaruvchi</p>
          <div className="owner_work_controllers_row_card_body_buttons">
            <Button type="primary">{`O'zgartirish`}</Button>
            <Button
              onClick={() => onDelete(data.id)}
              danger
            >{`O'chirish`}</Button>
          </div>
        </div>
      </Link>
      <br className="spacing_in_bottom" />
    </>
  );
};

export default WorkControllerCard;
