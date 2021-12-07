import React from 'react';
import { Alert } from 'reactstrap';

export default class Example extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          visible: true
        };
    
        this.onDismiss = this.onDismiss.bind(this);
      }
    
      onDismiss() {
        this.setState({ visible: false });
      }
    
      render() {
        return (
          <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
            You're logged out!
                    
          </Alert>
        );
      }
}