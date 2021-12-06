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
        user: "",
        password: "",
        customer: false
    }
}
  handleUserNameChange = event => {
    this.setState({user: event.target.value});
  }

  handlePasswordChange = event => {
    this.setState({password: event.target.value});
  }
  handleCheck = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({customer: value})
  }
  
  
  login = async e => {
    
    alert (this.state.user);
    alert (this.state.password);
    alert (this.state.customer);
    
    var cust = true;
    e.preventDefault();
    const response = await fetch('/db/login', {
      method: 'POST',      
      body: JSON.stringify({ "user": this.state.user, "password": this.state.password, "customer": this.state.customer  }),
      
    });
    
    const body = await response.text();
    
    this.setState({ responseToPost: body });
    
  };
  signUp = async e => {
    alert("Go to registration page");    
    
  };
  
  render() {
    return (
      <div className="main">
        <h3> Login </h3>
        <form onSubmit ={this.login}>
          <div className="user">
            <label>Username: </label>
            <input 
              type="text" 
              value = {this.state.user}
              onChange={this.handleUserNameChange}  
            />
          </div>
          <br />
          <div className="password">
            <label>Password: </label>
            <input 
              type="text" 
              value = {this.state.password}
              onChange={this.handlePasswordChange} 
            />
          </div>
          <br />
          <div className="customer">
            <label>Login as Customer: </label>
            <input 
              type ="checkbox" 
              value = {this.state.customer} 
              onChange={this.handleCheck} 
            />
          </div>
          <br />
          <button type="submit">Login</button>
        </form>
        <br />
        <button className="register" onClick={this.signUp}>
          Sign Up
        </button><br /><br />        
      </div>
    );
  }
}
