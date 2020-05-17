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
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.onUpdateUser = this.onUpdateUser.bind(this);
  }

  async componentDidMount() {
    this.props.onGetUsers();
  }

  handleChangePass(event) {
    this.setState({ password: event.target.value });
  }


  

  handleCloseModal() {
    this.setState({ showModal: false });
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
