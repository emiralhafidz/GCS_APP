import "./style.scss";
import { useState } from "react";
import Login from "./pages/login";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Dashboard from "./pages/dashboard";
import Position from "./pages/gps";
import Table from "./pages/table";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Router>
        {user ? (
          <div className="app-container">
            <Header toggleSidebar={toggleSidebar}/>
            <Sidebar isOpen={isOpen}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/table" element={<Table />} />
                <Route path="/position" element={<Position />} />
              </Routes>
            </Sidebar>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Router>
    </>
  );
};

export default App;
