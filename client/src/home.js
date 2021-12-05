import React, { Component, useState } from "react";
export default class Example extends React.Component {

  //when using form, could not introduce two submits
  //so use this value to compare to both customer and employee
  login = e => {
    alert(e.target.username.value);    
    alert(e.target.password.value);
    var username = e.target.username.value;
    var password = e.target.password.value;
  };
  signUp = e => {
    alert("Go to registration page");
  };
  
  render() {
    return (
      <div className="App">
        <form className="form" onSubmit={this.login}>
          <div className="input-group">
            <label htmlFor="username">Username </label>
            <input type="username" name="username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password </label>
            <input type="password" name="password" />
          </div>
          <br /><br />
          <button className="primary">Login</button>
        </form>
        <br />
        <button className="secondary" onClick={this.signUp}>
          Sign Up
        </button>
      </div>
    );
  }
}
