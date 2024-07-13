import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useAuthState } from "react-firebase-hooks/auth";
import { logOut, auth } from "../firebase";
import { Link } from "react-router-dom";

export const ModalsLogout = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="sm">
      <Modal.Header closeButton  className="bg-warning ">
        <Modal.Title>Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body>Apakah anda ingin keluar ?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="primary" onClick={logOut}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
ModalsLogout.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
