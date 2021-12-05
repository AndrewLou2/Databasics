import React from "react";
import { Nav, NavItem, NavLink, Media } from "reactstrap";
import { Route, Routes } from "react-router-dom";

import Employee from "./employee";
import Home from "./home";
import Customer from "./customer";

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
          <NavItem>
            <NavLink href="/customer/">Customer</NavLink>
          </NavItem>
        </Nav>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/customer" element={<Customer />} />
        </Routes>
      </div>
    );
  }
}
