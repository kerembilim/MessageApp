import React, { Component } from 'react';
import '../App.css';
import axios, { post } from 'axios';

const io = require('socket.io-client');

export default class MessagePage extends Component {

  socket = null;
  list = [];
  constructor(props) {
    super(props);
    this.state = { value: '', password: '', showModal: true, username: '', persons: [], departmants: [], workgroups: [], messageTarget: {}, messages: [], file: null };
    this.handleChange = this.handleChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getContacts = this.getContacts.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.addMessageArea = this.addMessageArea.bind(this);
    this.loginControl = this.loginControl.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.initSocketConnection = this.initSocketConnection.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  async componentDidMount() {
    //this.state.username = localStorage.get('');
    await this.loginControl();
    await this.getMessages();
    await this.getContacts();
    await this.initSocketConnection();
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


  getContacts = async () => {
    if (localStorage.getItem('userToken') !== null && localStorage.getItem('userToken') !== '') {
      var self = this;
      await axios.get('http://localhost:5000/users/getContacts' + '/' + this.state.username, {
        headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
      }).then(async function (response) {
        await self.setState({ persons: response.data.persons });
        await self.setState({ workgroups: response.data.workgroups });
        await self.setState({ departmants: response.data.departmants });
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

    for (var i = 0; i < this.state.departmants.length; i++) {
      this.socket.on(this.state.departmants[i].name, async (msg) => {
        if (msg.sender !== this.state.username) {
          let newMessages = self.state.messages;
          newMessages.push(msg);
          document.getElementById('messageArea').innerHTML = "";
          self.setState({ messages: newMessages });
        }
      });
    }

  }

  onFormSubmit(e) {
    e.preventDefault() // Stop form submit
    document.getElementById('myForm').style.display = "none";
    this.fileUpload(this.state.file).then((response) => {
      console.log(response.data);
      const message = {
        content: response.data.originalname,
        target: this.state.messageTarget.username,
        sender: this.state.username,
        messageType: 'file',
        filename: response.data.filename
      }
      document.getElementById('messageArea').innerHTML = "";
      this.sendMessage(message);

    })
  }


  onChange(e) {
    document.getElementById('messageArea').innerHTML = "";
    console.log(e.target.files[0]);
    document.getElementById('uploadbtn').style.display = 'block';
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
    console.log(message);
    if (message.sender === this.state.username) {
      css = 'mymessage { background: #baecba; float:right; clear: both;padding:2%; margin:1%;max-width:300px; word-wrap:break-word;border-radius:5px; }';
      head = document.head || document.getElementsByTagName('head')[0];
      style = document.createElement('style');
      node = document.createElement("mymessage");
      if (message.messageType === 'file') {
        node.onclick = function () {
          console.log(message);
          fetch('http://localhost:4010/fileupload/download/' + message.filename)
            .then(response => {
              response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = message.content;
                a.click();
              });
              //window.location.href = response.url;
            });


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
    if (message.messageType === 'file') {
      node.innerHTML = "<img style='height:80px;width:80px;' src='https://img.pngio.com/emoji-file-folders-directory-computer-icons-txt-file-png-png-file-folder-900_900.jpg' />" + node.innerHTML;
    }


    document.getElementById("messageArea").appendChild(node);
  }


  sendMessage(message) {
    this.socket.emit('chatmessage', message);
    let messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  }

  openForm() {
    document.getElementById("myForm").style.display = "block";
  }

  closeForm() {
    document.getElementById('myForm').style.display = "none";
  }
  render() {
    return (
      <div className="bg-dim row" >


        <div className="form-popup" id='myForm'>
          <form action="" className="form-container">
            <h2>File Upload</h2>
            <input type="file" onChange={this.onChange} className="btn" />
            <button id="uploadbtn" type="submit" style={{ display: 'none' }} className="btn" onClick={this.onFormSubmit}>Upload</button>
            <button type="button" className="btn cancel" onClick={() => { document.getElementById('myForm').style.display = "none"; }}>Close</button>
          </form>
        </div>




        <div className="col-md-3">
          <div className="connectList">
          </div>
          {this.state.persons.map(index =>
            <div key={index.username} className="connect" onClick={() => { this.setState({ messageTarget: index }); document.getElementById('messageArea').innerHTML = ""; }} >
              <img alt={index.username} src={index.image} style={{ height: 70, width: 70, float: 'left', borderRadius: 50, marginTop: 10, marginBottom: 10, backgroundSize: 'contain' }} />
              <div>
                <p style={{ marginLeft: 120, fontSize: 30, marginTop: 5, marginBottom: 0 }} >{index.username}</p>
                <p style={{ marginLeft: 120, fontSize: 15, marginTop: 20, color: 'green' }} >{index.statu}</p>
              </div>

            </div>)}
          <div style={{ color: 'white', fontSize: '40px' }}>
            <b>departmants</b>
          </div>
          {this.state.departmants.map(index =>
            <div key={index.name} className="connect" onClick={() => { this.setState({ messageTarget: index }); document.getElementById('messageArea').innerHTML = ""; }} >
              <img alt={index.name} src={index.photo} style={{ height: 70, width: 70, float: 'left', borderRadius: 50, marginTop: 10, marginBottom: 10, backgroundSize: 'contain' }} />
              <div>
                <p style={{ marginLeft: 120, fontSize: 30, marginTop: 5, marginBottom: 0 }} >{index.name}</p>
              </div>

            </div>)}
          <hr />
        </div>
        <div className="col-md-9">
          <div className="allMessageArea" id='' >



            {
              this.state.messageTarget.username || this.state.messageTarget.name ?
                <div className="row">
                  <div className="col-md-12">
                    <div className="" style={{ background: '#edeef1', }}>
                      <img src={this.state.messageTarget.image || this.state.messageTarget.photo} style={{ height: 50, width: 50, float: 'left', borderRadius: 50, marginTop: 10, marginLeft: 10, marginBottom: 10, backgroundSize: 'contain' }} />
                      <div style={{ paddingTop: 10, marginLeft: 100, fontSize: 30 }}>{this.state.messageTarget.username || this.state.messageTarget.name}</div>
                      <div style={{ paddingTop: 10, color: 'green', marginLeft: 110, fontSize: 15 }}>{this.state.messageTarget.statu || ''}</div>
                    </div>
                  </div>
                </div>
                : null
            }


            <div id='messageArea' >
              {
                this.state.messages.map(index => {
                  if (index.target === this.state.messageTarget.username || index.sender === this.state.messageTarget.username || index.target === this.state.messageTarget.name) {
                    this.addMessageArea(index);
                  }
                })
              }
            </div>


          </div>
          {
            this.state.messageTarget.username || this.state.messageTarget.name ?
              <div className="col-md-12">
                <div className="row" style={{ marginTop: '20px' }}>
                  <div className="col-md-10">
                    <input type="text" onKeyUp={this.enterClick} id='messageText' className="form-control" value={this.state.value} onChange={this.handleChange} />
                  </div>
                  <div className="col-md-2">
                    <div className="row">
                      <div className="col-md-4">
                        {
                          this.state.value === '' ?
                            <button className="btn btn-success" onClick={() => { document.getElementById('myForm').style.display = "block"; }}>+</button>
                            : <input id="btnSend" type="submit" className="btn btn-success" value="GÖNDER" onClick={() => {
                              if (this.state.value !== '') {
                                const message = {
                                  content: this.state.value,
                                  target: this.state.messageTarget.username || this.state.messageTarget.name,
                                  sender: this.state.username,
                                  messageType: 'message'
                                }
                                this.sendMessage(message);
                                this.setState({ value: '' });
                                document.getElementById('messageArea').innerHTML = "";
                              }

                            }} />
                        }

                      </div>
                      <div className="col-md-8">


                      </div>
                      {/*<div className="col-md-4">
                        <input type="file" onChange={this.onChange} className="form-control" />>
                      </div>
                      <div className="col-md-4">
                        <button type="submit" className="button" onClick={this.onFormSubmit}>Upload</button>
                      </div>*/}



                    </div>

                  </div>
                </div>
              </div> : null
          }
        </div>
      </div>

    );
  }
}
