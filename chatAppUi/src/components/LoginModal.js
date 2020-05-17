import React, { Component } from 'react';
import axios from 'axios';

import '../App.css';
import ReactModal from 'react-modal';

export default class componentName extends Component {
  constructor(props) {
    super(props);
    this.state = { password: '', username: '', showModal: true };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    this.loginControl();
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
    console.log(this.state.password)
  }

  loginControl = async () => {

    var self = this;
    await axios.post('http://localhost:5000/users/loginControl', {
    }, {
      headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
    }).then(async function (response) {
      if (response.data.result === 'basarili') {
        await self.setState({ showModal: false });
      }
    });
  }

  login() {
    var self = this;
    axios.post('http://localhost:5000/users/login', {
      username: this.state.username,
      password: this.state.password
    }).then(function (response) {
      if (response.data.result === 'basarili') {
        self.setState({ showModal: false });
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userName", response.data.username);
        window.location.reload();
      }
    })
  }


  render() {
    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={this.state.showModal}
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
        <input type="text" style={{ width: 250, height: 30, borderRadius: 15, textIndent: 30, marginLeft: 20 }} value={this.state.username} onChange={this.handleChangeUsername} />
        <br />
        <br />
        <input type="password" style={{ width: 250, height: 30, borderRadius: 15, textIndent: 30, marginLeft: 20 }} value={this.state.password} onChange={this.handleChangePassword} />
        <br />
        <input type="submit" style={{ float: 'right' }} value="GÖNDER" onClick={this.login} />
      </ReactModal>
    );
  }
}
