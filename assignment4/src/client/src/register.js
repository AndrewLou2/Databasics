import React from "react";
export default class Example extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
        name: "",
        username: "",
        password: "",
        address: "",
        contact: ""
    }
}

  handleNameChange = event => {
    this.setState({name: event.target.value});
  }

  handleUserNameChange = event => {
    this.setState({username: event.target.value});
  }

  handlePasswordChange = event => {
    this.setState({password: event.target.value});
  }
  handleAddressChange = event => {
    this.setState({address: event.target.value});
  }
  handleContactChange = event => {
    this.setState({contact: event.target.value});
  } 
  
  register = async e => {

    alert (this.state.name);
    alert (this.state.username);
    alert (this.state.password);
    alert (this.state.address);
    alert (this.state.contact);
    
    e.preventDefault();
    const response = await fetch('/db/register', {
      method: 'POST',      
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"user":{ "name": this.state.name, 
      "username": this.state.username, "password": this.state.password, 
      "address": this.state.address, "contact": this.state.contact, "customer":true }}),      
    });
    
    const body = await response.text();
    alert(body);
    this.setState({ responseToPost: body });
    
  };
  
  render() {
    return (
      <div className="main">
        <h3> Register as a New Customer </h3>
        <form onSubmit={this.register}>
           <div className="name">
            <label>Name: </label>
            <input 
              type="text" 
              value = {this.state.name}
              onChange={this.handleNameChange}  
            />
          </div>
          <br />
          <div className="username">
            <label>Username: </label>
            <input 
              type="text" 
              value = {this.state.username}
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
          <div className="address">
            <label>Address: </label>
            <input 
              type ="text" 
              value = {this.state.address} 
              onChange={this.handleAddressChange} 
            />
          </div>
          <br />
          <div className="contact">
            <label>Contact: </label>
            <input 
              type ="text" 
              value = {this.state.contact} 
              onChange={this.handleContactChange} 
            />
          </div>
          <br />
          <button type="submit">Register</button>
        </form>
        <br />       
      </div>
    );
  }
}
