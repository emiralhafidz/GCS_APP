import React, { useEffect, useState } from "react";

import { BiFlag } from "react-icons/bi";
import { BiMapPin, BiMapAlt } from "react-icons/bi";
import Maps from '../components/maps'
import Pesawat from '../components/pesawat';


const gps = () => {
  const [data, setData] = useState({ latitude: -7.7743284, longitude: 110.3886447});

  useEffect(() => {
    const ws = new WebSocket('ws://34.69.22.201:8085');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.topic === "kafka-latitude") {
        setData(prevData => ({ ...prevData, latitude: message.value }));
      } else if (message.topic === "kafka-longitude") {
        setData(prevData => ({ ...prevData, longitude: message.value }));
      } 
    };

    return () => {
      ws.close();
    };
  }, []);


  return (
    <div className="positionPage">
      <h1 className="title">
        <BiFlag className="icon" />
        Halaman Maps
      </h1>
      <div className="box">
        <div className="item styleBox" style={{ height:"80px" }}>
          <BiMapPin className="icon"/>
          <div className="value">{data.latitude}</div>
        </div>
        <div className="item styleBox" style={{ height:"80px" }}>
          <BiMapAlt className="icon"/>
          <div className="value">{data.longitude}</div>
        </div>
      </div>
      <Maps/>
      <br />
      <Pesawat/>

    </div>
  );
};

export default gps;
