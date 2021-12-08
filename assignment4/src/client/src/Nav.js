import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import { Route, Routes } from "react-router-dom";

import Employee from "./employee";
import Home from "./home";
import Customer from "./customer";
import Register from "./register";
import Inventory from "./inventory";
import Quit from "./quit";
import { EmployeeOrders } from "./employeeOrders";

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
          <NavItem>
            <NavLink href="/register/">Register</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/inventory/">Inventory</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/quit/">Quit</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/employeeOrders/">EmployeeOrders</NavLink>
          </NavItem>
        </Nav>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/register" element={<Register />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/quit" element={<Quit />} />
          <Route path="/employeeOrders" element={<EmployeeOrders />} />
        </Routes>
      </div>
    );
  }
}
