import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaThList } from "react-icons/fa";
import { IconContext } from "react-icons";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>Rinchher Darpan</h1>
      <IconContext.Provider value={{ className: "menu-icons" }}>
        <div className="navbar-menu">
          <div className="menu-item">
            <Link to="/">
              <FaHome />
            </Link>
          </div>
          <div className="menu-item">
            <Link to="/Services">
              <FaThList />
            </Link>
          </div>
          <div className="menu-item">
            <Link to="/profile">
              <FaUser />
            </Link>
          </div>
        </div>
      </IconContext.Provider>
    </nav>
  );
}
