import { useState } from "react";
import Logo from "../assets/images/logo.png";
import { ModalsLogout } from "./modals";
import { logOut, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Header = ({ toggleSidebar }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [user] = useAuthState(auth);

  return (
    <div className="header">
      <ModalsLogout show={show} handleClose={handleClose} />
      <div className="left">
        <div className="hamburger" onClick={toggleSidebar}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
        <div className="icon">
          <img src={Logo} alt="Logo" />
        </div>
      </div>
      <h1 className="center">
        {user.displayName}
        {/* <img src={Search} alt="" />
        <input type="text" placeholder="   Masukkan Pencarian" /> */}
      </h1>
      <div className="right">
        <img onClick={handleShow} src={user.photoURL} alt="" />
      </div>
    </div>
  );
};

export default Header;
