import Card from "../components/card";
import Tablempu from "../components/tablempu";

import { BiFlag } from "react-icons/bi";

const dashboard = () => {
  return (
    <div className="dashboardPage">
      <h1 className="title">
        <BiFlag className="icon" />
        Halaman Dashboard
      </h1>
      <Card />

      <Tablempu />
    </div>
  );
};

export default dashboard;
