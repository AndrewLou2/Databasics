import React, { useState } from "react";
export default class Example extends React.Component {

  
  render() {
    return (
    <div>
      Login<br /><br />
      <div>
        Username<br />
        <input type="text" autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" autoComplete="new-password" />
      </div>
      {<><small style={{ color: 'red' }}></small><br /></>}<br />
      <input type="button" value={'Login'} /><br />
    </div>
  );
  }
}
