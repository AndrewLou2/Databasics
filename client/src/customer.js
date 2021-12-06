import React from "react";

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
      rmGroup: "",
      loggedIn: false,
      loggedInUser: "",
      loggedInPwd: "",
      loggedInAsCust: false,
      orderMaterial: "",
      orderQty: ""
    }
  }
  handleUserNameChange = event => {
    this.setState({ user: event.target.value });
  }

  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  }

  handleCheck = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({ customer: value })
  }

  handleCategoryChange = event => {
    this.setState({ category: event.target.value });
  }

  handleSubCategoryChange = event => {
    this.setState({ subCategory: event.target.value });
  }

  handleSizeChange = event => {
    this.setState({ size: event.target.value });
  }

  handleGaugeChange = event => {
    this.setState({ gauge: event.target.value });
  }

  handleRMGroupChange = event => {
    this.setState({ rmGroup: event.target.value });
  }

  handleOrderMaterialChange = event => {
    this.setState({ orderMaterial: event.target.value });
  }

  handleOrderQuantityChange = event => {
    this.setState({ orderQty: event.target.value });
  }

  login = async e => {

    e.preventDefault();
    const response = await fetch('/db/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "user": { "user": this.state.user, "password": this.state.password, "customer": this.state.customer } }),

    });

    const body = await response.text();
    if (body == "false") {
      alert("Wrong login information, please try again")
    }
    else {
      alert("You are now logged in as: " + body);
      this.setState({ loggedIn: true });
      this.setState({ loggedInUser: this.state.user });
      this.setState({ loggedInPwd: this.state.password });
      this.setState({ loggedInAsCust: this.state.customer });
    }

    this.setState({ responseToPost: body });
  };

  listProducts = async e => {
    e.preventDefault();
    const response = await fetch('/db/productlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "filter": {
          "category": "", "sub_category": "",
          "size": "", "gauge": "", "material": "", "uom": "", "groupID": ""
        }
      }),
    });

    const body = await response.text();
    alert(body);
    this.setState({ responseToPost: body });
  };

  listCategory = async e => {
    e.preventDefault();
    const response = await fetch('/db/listcategory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "filter": {
          "category": "", "sub_category": "",
          "size": "", "gauge": "", "material": "", "uom": "", "groupID": ""
        }
      }),
    });

    const body = await response.text();
    alert(body);
    this.setState({ responseToPost: body });
  };

  listSubCategory = async e => {
    e.preventDefault();
    const response = await fetch('/db/listsubcategory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "filter": {
          "category": "", "sub_category": "",
          "size": "", "gauge": "", "material": "", "uom": "", "groupID": ""
        }
      }),
    });

    const body = await response.text();
    alert(body);
    this.setState({ responseToPost: body });
  };

  listSize = async e => {
    e.preventDefault();
    const response = await fetch('/db/listsize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "filter": {
          "category": "", "sub_category": "",
          "size": "", "gauge": "", "material": "", "uom": "", "groupID": ""
        }
      }),
    });

    const body = await response.text();
    alert(body);
    this.setState({ responseToPost: body });
  };

  listGauge = async e => {
    e.preventDefault();
    const response = await fetch('/db/listgauge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "filter": {
          "category": "", "sub_category": "",
          "size": "", "gauge": "", "material": "", "uom": "", "groupID": ""
        }
      }),
    });

    const body = await response.text();
    alert(body);
    this.setState({ responseToPost: body });
  };

  listRM = async e => {
    e.preventDefault();
    const response = await fetch('/db/listproductrm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "filter": {
          "category": "", "sub_category": "",
          "size": "", "gauge": "", "material": "", "uom": "", "groupID": ""
        }
      }),
    });

    const body = await response.text();
    alert(body);
    this.setState({ responseToPost: body });
  };


  placeOrder = async e => {

    if (this.state.loggedIn) {
      e.preventDefault();
      const response = await fetch('/db/placeorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "user": { "user": this.state.loggedInUser, "password": this.state.loggedInPwd, "customer": this.state.loggedInAsCust },
          "materialid": this.state.orderMaterial, "qty": this.state.orderQty
        }),

      });

      const body = await response.text();
      if (body == "false") {
        alert("There was an error processing your order, please try again")
      }
      else if (body == "true") {
        alert("Thank you, your order has been placed.");
      }
      this.setState({ responseToPost: body });
    }
    else {
      alert("You are not logged in, please log in before placing an order")
    }


  };

  orderHistory = async e => {
    if (this.state.loggedIn) {
      e.preventDefault();
      const response = await fetch('/db/orderHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "user": { "user": this.state.loggedInUser, "password": this.state.loggedInPwd, "customer": this.state.loggedInAsCust }, "filter": {
            "category": "", "sub_category": "", "size": "", "gauge": "", "rmGroup": ""
          }
        }),
      });
      const body = await response.text();
      alert(body);
      this.setState({ responseToPost: body });
    }
    else {
      alert("You are not logged in, please log in to view your order history")
    }
  };

  signUp = async e => {
    alert("Go to registration page");

  };


  render() {
    return (
      <div className="main">
        <h3> Login </h3>
        <form onSubmit={this.login}>
          <div className="user">
            <label>Username: </label>
            <input
              type="text"
              value={this.state.user}
              onChange={this.handleUserNameChange}
            />
          </div>
          <br />
          <div className="password">
            <label>Password: </label>
            <input
              type="text"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </div>
          <br />
          <div className="customer">
            <label>Login as Customer: </label>
            <input
              type="checkbox"
              value={this.state.customer}
              onChange={this.handleCheck}
            />
          </div>
          <br />
          <button type="submit">Login</button>
        </form>
        <br />
        <div>
          <button className="listProducts" onClick={this.listProducts}>
            Get a List of Product
          </button><br />
          <button className="listCategory" onClick={this.listCategory}>
            Get a List of Category
          </button><br />
          <button className="listSubCategory" onClick={this.listSubCategory}>
            Get a List of Subcategory
          </button><br />
          <button className="listSize" onClick={this.listSize}>
            Get a List of Size
          </button><br />
          <button className="listGauge" onClick={this.listGauge}>
            Get a List of Gauge
          </button><br />
          <button className="listRM" onClick={this.listRM}>
            Get a List of Rare Metal
          </button><br />
        </div>
        <h4> Place An Order </h4>
        <form onSubmit={this.placeOrder}>
          <div className="material">
            <label>Material ID: </label>
            <input
              type="text"
              value={this.state.orderMaterial}
              onChange={this.handleOrderMaterialChange}
            />
          </div>
          <br />
          <div className="qty">
            <label>Quantity: </label>
            <input
              type="text"
              value={this.state.orderQty}
              onChange={this.handleOrderQuantityChange}
            />
          </div>
          <br />
          <button type="submit">Place Order</button>
        </form>
        <br />
        <br />
        <div>
          <button className="orderHistory" onClick={this.orderHistory}>
            View Order History
          </button>
        </div>
      </div>
    );
  }
}
