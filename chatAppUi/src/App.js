import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';

//Project Components
import LoginModal from './components/LoginModal';
import NavBar from './components/NavBar';

//pages
import MessagePage from './pages/MessagePage';
import DocumentPage from './pages/DocumentPage';

import './App.css';
import messageBackground from './utilies/messageBackground.jpeg';


import { connect } from 'react-redux';
import { updateUser, getUsers } from '../src/actions/user-actions';


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
    this.onUpdateUser = this.onUpdateUser.bind(this);
  }

  async componentDidMount() {
    this.props.onGetUsers();
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

  onUpdateUser(){
		this.props.onUpdateUser('Ahmet');
	}


  myFunction() {
    var x = document.getElementById("mySelect").value;
    console.log(x);
  }

  render() {
    return (
      <Router>
        <div className="full-width-div">
          <NavBar />



          <LoginModal
            showModal={this.state.showModal}
            onChangeUserName={this.handleChangeUsername}
            onChangePassword={this.handleChangePass}
            login={this.login}
          />



          <div className="bg-dim full-bg-size" style={{ backgroundImage: `url(${messageBackground})` }}>


            
            <Route path="/message" exact strict component={MessagePage} />
            <Route path="/document" exact strict component={DocumentPage} />
            <Route path="/" exact render={
              () => {
                return (<div><h2>{this.props.user}</h2>
                  <button onClick={this.onUpdateUser}>Change the name</button></div>)
              }
            } />
          </div>


        </div>

      </Router>


    );
  }

}


const mapStateToProps = (state, props) => {
  return {
    ...state,
    myCount: props.count + 2
  };
};

const mapDispatchToProps = {
  onUpdateUser: updateUser,
  onGetUsers: getUsers
};






export default connect(mapStateToProps, mapDispatchToProps)(App);
