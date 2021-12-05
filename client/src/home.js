import React, { Component, useState } from "react";
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  ListGroup,
  Table,
  ListGroupItem,
  ButtonGroup,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
export default class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        username: "",
        password: "",
        customer: false
    }
}
  handleUserNameChange = event => {
    this.setState({username: event.target.value});
  }

  handlePasswordChange = event => {
    this.setState({password: event.target.value});
  }
  handleCheck = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({customer: value})
  }
  //when using form, could not introduce two submits
  login = async e => {
    
    alert (this.state.username);
    alert (this.state.password);
    alert (this.state.customer);
    
    var cust = true;
    e.preventDefault();
    const response = await fetch('/db/login', {
      method: 'POST',      
      body: JSON.stringify({ "user": this.state.username, "password": this.state.password, "customer": this.state.customer  }),
      
    });
    
    const body = await response.text();
    
    this.setState({ responseToPost: body });
    
  };
  signUp = async e => {
    alert("Go to registration page");
    
  };
  
  render() {
    return (
      <div className="App">
        <form onSubmit ={this.login}>
          <div className="input-group">
            <label htmlFor="username">Username </label>
            <input type="text" name="username" onChange={this.handleUserNameChange} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password </label>
            <input type="text" name="password" onChange={this.handlePasswordChange} />
          </div>
          <br />
          <div className="input-group">
            <label htmlFor="customer">Login as Customer </label>
            <input type="checkbox" name="customer" onChange={this.handleCheck} />
          </div>
          <br />
          <button className="primary">Login</button>
        </form>
        <br />
        <button className="secondary" onClick={this.signUp}>
          Sign Up
        </button><br /><br />
      </div>
    );
  }
}
