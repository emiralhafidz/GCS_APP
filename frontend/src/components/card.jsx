import {
  BiChevronDownCircle,
  BiChevronLeftCircle,
  BiChevronUpCircle,
} from "react-icons/bi";
import React, { useEffect, useState } from "react";


const card = () => {
  const [data, setData] = useState({ roll: 0, pitch: 0, yaw: 0, heading: 0 });

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8085");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.topic === "kafka-roll") {
        setData((prevData) => ({ ...prevData, roll: message.value }));
      } else if (message.topic === "kafka-pitch") {
        setData((prevData) => ({ ...prevData, pitch: message.value }));
      } else if (message.topic === "kafka-yaw") {
        setData((prevData) => ({ ...prevData, yaw: message.value }));
      } else if (message.topic === "kafka-heading") {
        setData((prevData) => ({ ...prevData, heading: message.value }));
      }
    };

    return () => {
      ws.close();
    };
  }, []);
  return (
    <div className="cardComponent">
      <div className="parents">
        <div className="child">
          <div className="head">Roll</div>
          <div className="body styleBox">
            <BiChevronDownCircle className="icon" />
            <div className="nilai">{data.roll}</div>
          </div>
        </div>
        <div className="child">
          <div className="head">Pitch</div>
          <div className="body styleBox">
            <BiChevronLeftCircle className="icon" />
            <div className="nilai">{data.pitch}</div>
          </div>
        </div>
        <div className="child">
          <div className="head">Yaw</div>
          <div className="body styleBox">
            <BiChevronUpCircle className="icon" />
            <div className="nilai">{data.yaw}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default card;
