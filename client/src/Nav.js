import React from "react";
import { Nav, NavItem, NavLink, Media } from "reactstrap";
import { Route, Routes } from "react-router-dom";

import Employee from "./employee";
import Home from "./home";

export default class Example extends React.Component {
  render() {
    return (
      <div>
        <Nav>
          <NavItem>
            <NavLink href="/home/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/employee/">Employee</NavLink>
          </NavItem>
        </Nav>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/employee" element={<Employee />} />
        </Routes>
      </div>
    );
  }
}
