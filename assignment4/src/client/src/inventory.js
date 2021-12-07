import React from "react";

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      password: "",
      customer: false,
      loggedIn: false,
      loggedInUser: "",
      loggedInPwd: "",
      loggedInAsCust: false,
    };
  }

  handleUsernameChange = (event) => {
    this.setState({
      user: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };
  login = async e => {
       
    e.preventDefault();
    const response = await fetch('/db/login', {
      method: 'POST',      
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({"user":{ "user": this.state.user, "password": this.state.password, "customer": this.state.customer }}),

    });
    
    const body = await response.text();
    if(body == "false")
    {
      alert("Wrong login information, please try again")
    }
    else{
      alert ("You are now logged in as: " + body);
      this.setState({loggedIn: true});
      this.setState({loggedInUser: this.state.user});
      this.setState({loggedInPwd: this.state.password});
      this.setState({loggedInAsCust: this.state.customer});
    }
    
    this.setState({ responseToPost: body });    
  };

  topTenDemand = async e => {
    
    if(this.state.loggedIn)
    {
      e.preventDefault();
      const response = await fetch('/db/toptendemand', {
        method: 'POST',      
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"user":{ "user": this.state.loggedInUser, "password": this.state.loggedInPwd, 
        "customer": this.state.loggedInAsCust }}),

      });

      const body = await response.text();
      alert (body);
      this.setState({ responseToPost: body });  
    }
    else{
      alert ("You are not logged in, please log in first")
    }          
  };

  topTenDemandRevenue = async e => {
    
    if(this.state.loggedIn)
    {
      e.preventDefault();
      const response = await fetch('/db/toptendemand', {
        method: 'POST',      
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"user":{ "user": this.state.loggedInUser, "password": this.state.loggedInPwd, 
        "customer": this.state.loggedInAsCust }}),

      });

      const body = await response.text();
      alert (body);
      this.setState({ responseToPost: body });  
    }
    else{
      alert ("You are not logged in, please log in first")
    }          
  };
  
  totalByRM = async e => {
    
    if(this.state.loggedIn)
    {
      e.preventDefault();
      const response = await fetch('/db/totalbyrm', {
        method: 'POST',      
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"user":{ "user": this.state.loggedInUser, "password": this.state.loggedInPwd, 
        "customer": this.state.loggedInAsCust }}),

      });

      const body = await response.text();
      alert (body);
      this.setState({ responseToPost: body });  
    }
    else{
      alert ("You are not logged in, please log in first")
    }          
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/db/employeelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "user": {
          "user": this.state.loggedInUser,
          "password": this.state.loggedInPwd,
          "customer": this.state.loggedInAsCust,
        },
      }),
    });

    const body = await response.text();
    alert(body);
    this.setState({ responseToPost: body });
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
              onChange={this.handleUsernameChange}  
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
          <button type="submit">Login</button>          
        </form>
        <br /><br />
        <button className="topTenDemand" onClick={this.topTenDemand}>
            Top Ten Demand
        </button><br /><br />
        <button className="topTenDemandRevenue" onClick={this.topTenDemandRevenue}>
            Top Ten Demand by Revenue
        </button><br /><br />
        <button className="totalByRM" onClick={this.totalByRM}>
            Total By RM
        </button>
      </div>
    );
  }
}
