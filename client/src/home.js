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
        customer: false,
        category: "",
        subCategory: "",
        size: "",
        gauge: "",
        rmGroup: ""
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

  handleCategoryChange = event => {
    this.setState({category: event.target.value});
  }

  handleSubCategoryChange = event => {
    this.setState({subCategory: event.target.value});
  }

  handleSizeChange = event => {
    this.setState({size: event.target.value});
  }

  handleGaugeChange = event => {
    this.setState({gauge: event.target.value});
  }

  handleRMGroupChange = event => {
    this.setState({rmGroup: event.target.value});
  }  
  
  login = async e => {
    
    alert (this.state.user);
    alert (this.state.password);
    alert (this.state.customer);
    
    var cust = true;
    e.preventDefault();
    const response = await fetch('/db/login', {
      method: 'POST',      
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"user":{ "user": this.state.user, "password": this.state.password, "customer": this.state.customer }}),

    });
    
    const body = await response.text();
    alert (body);
    this.setState({ responseToPost: body });    
  };

  listCategory = async e => {
        
    e.preventDefault();
    const response = await fetch('/db/listcategory', {
      method: 'POST',      
      headers: { 'Content-Type': 'application/json' },   
      body: JSON.stringify({"filter":{ "category": this.state.category, 
      "sub_category": "", "size": "", "gauge": "", "material": "", "uom": "", "groupID": ""}}),   

    });
    
    const body = await response.text();
    alert (body);
    this.setState({ responseToPost: body });    
  };

  search = async e => {
        
    e.preventDefault();
    const response = await fetch('/db/orderHistory', {
      method: 'GET',      
      headers: { 'Content-Type': 'application/json' },      

    });    
    
    const body = await response.text();
    alert (body);
    this.setState({ responseToPost: body });    
  };

  placeOrder = async e => {
    
    alert (this.state.user);
    alert (this.state.password);
    alert (this.state.customer);
    
    var cust = true;
    e.preventDefault();
    const response = await fetch('/db/login', {
      method: 'POST',      
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"user":{ "user": this.state.user, "password": this.state.password, "customer": this.state.customer }}),

    });
    
    const body = await response.text();
    alert (body);
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
        <button className="register" onClick={this.listCategory}>
          Sign Up
        </button><br /><br />     

        <h4> Order History by Filter </h4>
        <form onSubmit ={this.listCategory}>
          <div className="category">
            <label>Category: </label>
            <input 
              type="text" 
              value = {this.state.category}
              onChange={this.handleCategoryChange}  
            />
          </div>
          <br />
          <div className="subCategory">
            <label>Sub_Category: </label>
            <input 
              type="text" 
              value = {this.state.subCategory}
              onChange={this.handleSubCategoryChange} 
            />
          </div>
          <br />
          <div className="size">
            <label>Size: </label>
            <input 
              type="text" 
              value = {this.state.size}
              onChange={this.handleSizeChange}
            />
          </div>
          <br />
          <div className="gauge">
            <label>Gauge: </label>
            <input 
              type="text" 
              value = {this.state.gauge}
              onChange={this.handleGaugeChange}
            />
          </div>
          <br />
          <div className="rmGroup">
            <label>RM_Group: </label>
            <input 
              type="text" 
              value = {this.state.rmGroup}
              onChange={this.handleRMGroupChange}
            />
          </div>
          <br />
          <button type="submit">Search</button>
        </form>
        <br />   
      </div>
    );
  }
}
