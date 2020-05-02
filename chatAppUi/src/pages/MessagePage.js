import React, { Component } from 'react';
import '../App.css';
import axios, { post } from 'axios';

const io = require('socket.io-client');

export default class MessagePage extends Component {

  socket = null;
  list = [];



  constructor(props) {
    super(props);
    this.state = { value: '', password: '', showModal: true, username: '', contacts: [], messageTarget: {}, messages: [], file: null };
    this.handleChange = this.handleChange.bind(this);

    this.sendMessage = this.sendMessage.bind(this);
    this.getContacts = this.getContacts.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.addMessageArea = this.addMessageArea.bind(this);
    this.loginControl = this.loginControl.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  async componentDidMount() {
    //this.state.username = localStorage.get('');
    await this.loginControl();
    await this.getMessages();
    await this.initSocketConnection();
    await this.getContacts();
  }

  loginControl = async () => {

    if (localStorage.getItem('userToken') !== null && localStorage.getItem('userToken') !== '') {
      var self = this;
      await axios.post('http://localhost:5000/users/loginControl', {}, {
        headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
      }).then(async function (response) {
        if (response.data.result === 'basarili') {
          await self.setState({ username: response.data.username });
        }
      });
    }

  }


  getContacts() {
    if (localStorage.getItem('userToken') !== null && localStorage.getItem('userToken') !== '') {
      var self = this;
      axios.get('http://localhost:5000/users/getContacts' + '/' + this.state.username, {
        headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
      }).then(function (response) {
        self.setState({ contacts: response.data });
        self.list = response.data;
      })
    }
  }

  getMessages = async () => {
    var self = this;
    await axios.get('http://localhost:4000/getmessages', {
      params: {
        username: this.state.username
      }
    }).then(async function (response) {
      await self.setState({ messages: response.data });
    })
  }


  handleChange(event) {
    this.setState({ value: event.target.value });
    document.getElementById('messageArea').innerHTML = "";
  }


  initSocketConnection() {
    var self = this;

    this.socket = io.connect('http://localhost:4000');
    this.socket.on(this.state.username, async (msg) => {
      let newMessages = self.state.messages;
      newMessages.push(msg);
      document.getElementById('messageArea').innerHTML = "";
      self.setState({ messages: newMessages });
    });
  }

  onFormSubmit(e) {
    e.preventDefault() // Stop form submit
    this.fileUpload(this.state.file).then((response) => {
      console.log(response.data);
      const message = {
        content: response.data.originalname,
        target: this.state.messageTarget.username,
        sender: this.state.username,
        messageType: 'file'
      }
      document.getElementById('messageArea').innerHTML = "";
      this.sendMessage(message);

    })
  }
  onChange(e) {
    document.getElementById('messageArea').innerHTML = "";
    this.setState({ file: e.target.files[0] })
    this.fileUpload(this.state.file);
  }
  fileUpload(file) {
    const url = 'http://localhost:4010/fileupload/messagefileupload';
    const formData = new FormData();
    formData.append('file', file)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': 'Bearer ' + localStorage.getItem('userToken')
      }
    }
    return post(url, formData, config)
  }

  enterClick = (e) => {
    if (e.keyCode === 13 && this.state.value !== '') {
      const message = {
        content: this.state.value,
        target: this.state.messageTarget.username,
        sender: this.state.username,
        messageType: 'message'
      }
      this.sendMessage(message);
      this.setState({ value: '' });
      document.getElementById('messageArea').innerHTML = "";
    }

  }

  addMessageArea(message) {
    var css, head, style, node;
    if (message.sender === this.state.username) {
      css = 'mymessage { background: #baecba; float:right; clear: both;padding:2%; margin:1%;max-width:300px; word-wrap:break-word;border-radius:5px; }';
      head = document.head || document.getElementsByTagName('head')[0];
      style = document.createElement('style');
      node = document.createElement("mymessage");
      if (message.messageType === 'file') {
        node.onclick = function () {
          console.log('sdsssd');
        };
      }


    }
    else {
      css = 'stranger { background: #fffdfa; float:left; clear: both;padding:2%; margin:1%;max-width:300px; word-wrap:break-word;border-radius:5px; }';
      head = document.head || document.getElementsByTagName('head')[0];
      style = document.createElement('style');
      node = document.createElement("stranger");
      if (message.messageType === 'file') {
        node.onclick = function () {
          console.log('sdsssd');
        };
      }
    }
    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet) {
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    var textnode;
    textnode = document.createTextNode(message.sender + ': ' + message.content);

    node.appendChild(textnode);
    document.getElementById("messageArea").appendChild(node);
  }


  sendMessage(message) {
    this.socket.emit('chatmessage', message);
    let messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  }
  render() {
    return (
      <div className="bg-dim" >
        <div className="connectList" >
          {this.state.contacts.map(index =>
            <div key={index.username} className="connect" onClick={() => { this.setState({ messageTarget: index }); document.getElementById('messageArea').innerHTML = ""; }} >
              <img alt={index.username} src={index.image} style={{ height: 70, width: 70, float: 'left', borderRadius: 50, marginTop: 10, marginBottom: 10, backgroundSize: 'contain' }} />
              <div>
                <p style={{ marginLeft: 120, fontSize: 30, marginTop: 5, marginBottom: 0 }} >{index.username}</p>
                <p style={{ marginLeft: 120, fontSize: 15, marginTop: 20, color: 'green' }} >{index.statu}</p>
              </div>

            </div>)}
        </div>
        <div className="allMessageArea" id='' >
          {
            this.state.messageTarget.username ?
              <div className="messageTarget">
                <img src={this.state.messageTarget.image} style={{ height: 50, width: 50, float: 'left', borderRadius: 50, marginTop: 10, marginLeft: 10, marginBottom: 10, backgroundSize: 'contain' }} />
                <div style={{ paddingTop: 10, marginLeft: 100, fontSize: 30 }}>{this.state.messageTarget.username}</div>
                <div style={{ paddingTop: 10, color: 'green', marginLeft: 110, fontSize: 15 }}>{this.state.messageTarget.statu}</div>
              </div> : null
          }
          <div id='messageArea' >
            {
              this.state.messages.map(index => {
                if (index.target === this.state.messageTarget.username || index.sender === this.state.messageTarget.username) {
                  this.addMessageArea(index);
                }
              })
            }
          </div>
        </div>
        {
          this.state.messageTarget.username ?
            <div>
              <input type="text" onKeyUp={this.enterClick} id='messageText' className="message" value={this.state.value} onChange={this.handleChange} />
              <input id="btnSend" type="submit" className="button" value="GÖNDER" onClick={() => {
                if (this.state.value !== '') {
                  const message = {
                    content: this.state.value,
                    target: this.state.messageTarget.username,
                    sender: this.state.username,
                    messageType: 'message'
                  }
                  this.sendMessage(message);
                  this.setState({ value: '' });
                  document.getElementById('messageArea').innerHTML = "";
                }

              }} />


              <input type="file" onChange={this.onChange} className="button" />
              <button type="submit" className="button" onClick={this.onFormSubmit}>Upload</button>

            </div> : null
        } </div>
    );
  }
}
