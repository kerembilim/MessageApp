import React, { Component } from 'react';

import '../App.css';
import ReactModal from 'react-modal';

export default class componentName extends Component {
    constructor(props) {
        super(props);
        this.state = { password: '', username: '' };
      }

  render() {
    return (
        <ReactModal
        ariaHideApp={false}
        isOpen={this.props.showModal}
        contentLabel="Minimal Modal Example"
        style={{
          content: {
            backgroundColor: '#708090',
            borderRadius: 15,
            width: 400,
            height: 200,
            margin: 'auto',
            paddingTop: 0
          }
        }}
      >
        <p style={{ fontSize: 20 }}>Login</p>
        <hr />
        <input type="text" style={{ width: 250, height: 30, borderRadius: 15, textIndent: 30, marginLeft: 20 }} value={this.state.username} onChange={this.props.onChangeUserName} />
        <br />
        <br />
        <input type="password" style={{ width: 250, height: 30, borderRadius: 15, textIndent: 30, marginLeft: 20 }} value={this.state.password} onChange={this.props.onChangePassword} />
        <br />
        <input type="submit" style={{ float: 'right' }} value="GÖNDER" onClick={this.props.login} />
      </ReactModal>
    );
  }
}
