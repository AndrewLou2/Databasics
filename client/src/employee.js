import React from "react";
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
  render() {
    return (
      <div className="main">
        <h1>Employee Page</h1>
        <Form class="2">
          <Row form>
            <Col md={6}>
              <h3 for="Employee">Add a new employee</h3>
              <Input
                type="text"
                name="Playlist"
                id="exampleEmail"
                placeholder="Enter employee Name..."
                // value={this.state.value}
                onChange={this.handleChange}
              />
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
