import React from 'react';
import './App.css';
import ReactModal from 'react-modal';
import messageBackground from './utilies/messageBackground.jpeg';
import DownloadFile from './components/DownloadFile';
import axios, { post } from 'axios';

//pages
import MessagePage from './pages/MessagePage'

const io = require('socket.io-client');


class App extends React.Component {
  socket = null;
  list = [];

  constructor(props) {
    super(props);
    this.state = { value: '', password: '', showModal: true, username: '', contacts: [], messageTarget: {}, messages: [], file: null };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.loginControl = this.loginControl.bind(this);
    this.login = this.login.bind(this);
  }

  async componentDidMount() {
    await this.loginControl();
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleChangePass(event) {
    this.setState({ password: event.target.value });
  }


  loginControl = async () => {
    if (localStorage.getItem('userToken') == null || localStorage.getItem('userToken') == '') {
      this.login()
    }
    else {
      console.log(localStorage.getItem('userToken'))
      var self = this;
      await axios.post('http://localhost:5000/users/loginControl', {
      }, {
          headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
        }).then(async function (response) {
          if (response.data.result === 'basarili') {
            await self.setState({ showModal: false });
            await self.setState({ username: response.data.username });
          }
        });
    }

  }

  handleCloseModal() {
    this.setState({ showModal: false });
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
        self.setState({ username: response.data.username });
         window.location.reload()
      }
    })
  }


  myFunction() {
    var x = document.getElementById("mySelect").value;
    console.log(x);
  }

  render() {
    return (
      <div >
        <header className="header">
          <div className="wrap">
            <h2 className="logo"><a href="">Website Logo</a></h2>
            <select id="mySelect" onChange={this.myFunction}>
              <option value="volvo">Volvo</option>
              <option value="saab">Saab</option>
            </select>
            <a id="menu-icon">&#9776; Menu</a>

            <nav className="navbar">
              <ul className="menu">
                <li><a href="#">Hesap işlemleri</a></li>
                <li><a href="#">Çıkış</a></li>
              </ul>
            </nav>

          </div>
        </header>
        
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
          <input type="password" style={{ width: 250, height: 30, borderRadius: 15, textIndent: 30, marginLeft: 20 }} value={this.state.password} onChange={this.handleChangePass} />
          <br />
          <input type="submit" style={{ float: 'right' }} value="GÖNDER" onClick={this.login} />
        </ReactModal>

        <div className="bg-dim full-bg-size" style={{ backgroundImage: `url(${messageBackground})` }}>
          <MessagePage
            username={this.state.username} />
        </div>


      </div>




    );
  }

}





export default App;
