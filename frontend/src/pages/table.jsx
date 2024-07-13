import React from "react";
import Tablempu from "../components/tablempu";
import Tableresponse from "../components/tableresponse";
import { BiFlag } from "react-icons/bi";
// import Line from "../components/line";

const table = () => {
  return (
    <div className="tablePage">
      <h1 className="title">
        <BiFlag className="icon" />
        Halaman Table
      </h1>
      <h1
        style={{ fontSize: "1.4rem", fontWeight: "300", textAlign: "center" }}
      >
        Table Data MPU6050
      </h1>
      <Tablempu />
      <br />
      <br />
      <h1
        style={{ fontSize: "1.4rem", fontWeight: "300", textAlign: "center" }}
      >
        Table Data Response
      </h1>
      <Tableresponse />
      {/* <div className="grafik" style={{ height: "400px" }}>
        <Line />
      </div> */}
    </div>
  );
};

export default table;
