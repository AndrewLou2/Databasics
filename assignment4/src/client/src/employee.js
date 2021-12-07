import React from "react";

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      salary: 0,
      bday: "",
      contact: "",
      userRights: 0,
    };
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  handleSalaryChange = (event) => {
    this.setState({
      salary: event.target.value,
    });
  };

  handleBdayChange = (event) => {
    this.setState({
      bday: event.target.value,
    });
  };

  handleContactChange = (event) => {
    this.setState({
      contact: event.target.value,
    });
  };

  handleRightsChange = (event) => {
    this.setState({
      userRights: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/db/employeelist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "user": {
          "user": this.state.username,
          "password": this.state.salary,
          "customer": false,
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
        <h3>Add a new employee</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="name">
            <label>Name: </label>
            <input
              type="text"
              value={this.state.username}
              onChange={this.handleUsernameChange}
              placeholder="Enter employee name"
            />
          </div>
          <br></br>
          <div className="name">
            <label>password: </label>
            <input
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <br></br>
          <div className="salary">
            <label>Salary: </label>
            <input
              type="text"
              value={this.state.salary}
              onChange={this.handleSalaryChange}
              placeholder="Enter employee's salary"
            />
          </div>
          <br></br>
          <div className="birthday">
            <label>Birthday: </label>
            <input
              type="date"
              value={this.state.bday}
              onChange={this.handleBdayChange}
              placeholder="Enter employee's birthday"
            />
          </div>
          <br></br>
          <div className="contact">
            <label>Contact: </label>
            <textarea
              type="date"
              value={this.state.contact}
              onChange={this.handleContactChange}
              placeholder="Enter contact information"
            />
          </div>
          <br></br>
          <div className="user rights">
            <label>user rights: </label>
            <input
              type="number"
              value={this.state.rights}
              onChange={this.handleRightsChange}
            />
          </div>
          <br></br>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
