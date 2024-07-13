import { BiSolidDashboard, BiMap, BiData } from "react-icons/bi";

import { Link } from "react-router-dom";

const LinkItem = [
  {
    id: "/dashboard",
    icon: <BiSolidDashboard />,
    name: "Dashboard",
  },
  {
    id: "/table",
    icon: <BiData />,
    name: "Table",
  },
  {
    id: "/position",
    icon: <BiMap />,
    name: "Position",
  },
];

const AdminPage = ({ isOpen, children }) => {
  return (
    <div className="mainPage">
      {/* <Header toggleSidebar={toggleSidebar} /> */}
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        <ul>
          {LinkItem.map((item, index) => (
            <li key={index}>
              <Link to={item.id}>
                {/* <img src= alt={item.name} /> */}
                <div className="icon">{item.icon}</div>
                <div className="name">{item.name}</div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="pages">{children}</div>
    </div>
  );
};

export default AdminPage;
