import React from 'react';
import './App.css';
import ReactModal from 'react-modal';
import messageBackground from './utilies/messageBackground.jpeg';

const io = require('socket.io-client');
const axios = require('axios');

class App extends React.Component {
  socket = null;
  list = [];

  constructor(props) {
    super(props);
    this.state = {value: '',password: '',showModal: true, username:'',contacts:[],messageTarget : {}, messages: []};
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePass = this.handleChangePass.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.loginControl = this.loginControl.bind(this);
    this.getContacts = this.getContacts.bind(this);
    this.getOldMessages = this.getOldMessages.bind(this);
    this.addMessageArea = this.addMessageArea.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount(){
    var self = this;
    axios.post('http://localhost:5000/users/getContacts', {
        username: this.state.username
    }).then(function (response) {
        self.setState({contacts:response.data});
      });
      this.getOldMessages();

    this.loginControl();
  }
  
  addMessageArea (message) {
    
    var css,head,style,node ;
    if(message.sender === this.state.userName){
      css = 'mymessage { background: #baecba; float:right; clear: both;padding:2%; margin:1%;max-width:300px; word-wrap:break-word;border-radius:5px; }';
      head = document.head || document.getElementsByTagName('head')[0];
      style = document.createElement('style');
      node = document.createElement("mymessage");
      
    }
    else{
      css = 'stranger { background: #fffdfa; float:left; clear: both;padding:2%; margin:1%;max-width:300px; word-wrap:break-word;border-radius:5px; }';
      head = document.head || document.getElementsByTagName('head')[0];
      style = document.createElement('style');
      node = document.createElement("stranger");
    } 
    head.appendChild(style);
    
    style.type = 'text/css';
    if (style.styleSheet){
      // This is required for IE8 and below.
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    var textnode = document.createTextNode(message.sender + ': '+ message.content);
    node.appendChild(textnode);
    document.getElementById("messageArea").appendChild(node);
    
  
  }


  sendMessage (message) {
    this.socket.emit('chatmessage',message);
    let messages = this.state.messages;
    messages.push(message);
    console.log(messages)
    this.setState({messages});
  }

  loginControl = () =>{
    var self = this;
    axios.post('http://localhost:5000/users/loginControl', {
  },{
    headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
}).then(function (response) {
    if(response.data.result === 'basarili'){
      self.setState({showModal:false});
      self.setState({username:response.data.username});
      self.initSocketConnection();
      self.getContacts = self.getContacts.bind(self);
      self.getContacts();
    }
    
  });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }

  login ()  {
    var self = this;
    axios.post('http://localhost:5000/users/login', {
        username: this.state.username,
        password: this.state.password
    }).then(function (response) {
    if(response.data.result === 'basarili'){
      self.setState({showModal:false});
      localStorage.setItem("userToken", response.data.token);
      self.setState({username:response.data.username});
      self.initSocketConnection();
      self.getContacts = self.getContacts.bind(self);
      self.getContacts();
    }
    
  })
  }
  
  getContacts() {
    var self = this;
    axios.post('http://localhost:5000/users/getContacts', {
        username: this.state.username
    },{
      headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }}).then(function (response) {
      self.setState({contacts:response.data});
      self.list = response.data;
    
    })
    
    
  }

  getOldMessages() {
    var self = this;
  axios.get('http://localhost:4000/getOldMessages', ).then(function (response) {
      self.setState({messages:response.data});
      console.log(self.state.messages)
    })
    
    
  }


  handleChange(event) {
    this.setState({value: event.target.value});
    document.getElementById('messageArea').innerHTML = "";
    
  }

  handleChangeUsername(event) {
    this.setState({username: event.target.value});
  }

  handleChangePass(event) {
    this.setState({password: event.target.value});
  }

  initSocketConnection() {
    var self = this;
    let messages = this.state.messages;
    this.socket = io.connect('http://localhost:4000');
    this.socket.on(this.state.username, (msg) => {
      
      messages.push(msg);
      document.getElementById('messageArea').innerHTML = ""; 
      self.setState({messages});
      
    });
    
  }

  

  render() {
    return (

      <div className="bg-dim full-bg-size" style={{backgroundImage: `url(${messageBackground})`}}>
        <ReactModal 
           ariaHideApp={false}
           isOpen={this.state.showModal}
           contentLabel="Minimal Modal Example"
           style={{
            content: {
              backgroundColor:'#708090',
              borderRadius: 15,
              width: 400,
              height:200,
              margin:'auto',
              paddingTop:0
            }
            
          }}
        >
          <p style={{fontSize:20 }}>Login</p>
          <hr/>
          <input type="text"  style={{width:250,height:30,borderRadius: 15 ,textIndent: 30,marginLeft:20}} value={this.state.username} onChange={this.handleChangeUsername} />
          <br/>
          <br/>
          <input type="password" style={{width:250,height:30,borderRadius: 15,textIndent: 30,marginLeft:20 }}  value={this.state.password} onChange={this.handleChangePass} />
          <br/>
           <input type="submit" style={{float:'right'}} value="GÖNDER"  onClick={ this.login } />
        </ReactModal>

        <div className="connectList" >
          {this.state.contacts.map(index => 
                <div key={index.username} className="connect" onClick = {()=>{this.setState({messageTarget:index}); document.getElementById('messageArea').innerHTML = "";}} >
                    <img src={index.image} style={{height:70,width:70,float:'left',borderRadius:50,marginTop:10,marginBottom:10,backgroundSize:'contain'}}/>
                    <div>
                    <p style={{marginLeft:120,fontSize:30,marginTop:5,marginBottom:0}} >{index.username}</p> 
                     <p style={{marginLeft:120,fontSize:15,marginTop:20,color:'green'}} >{index.statu}</p>
                    </div>
                     
                </div>)}
        </div>
        <div className="allMessageArea" id = '' >
          {
            this.state.messageTarget.username ? 
            <div className="messageTarget">
              <img src={this.state.messageTarget.image} style={{height:50,width:50,float:'left',borderRadius:50,marginTop:10,marginLeft:10,marginBottom:10,backgroundSize:'contain'}}/>
              <div style={{paddingTop:10,marginLeft:100,fontSize:30}}>{this.state.messageTarget.username}</div>
              <div style={{paddingTop:10, color:'green',marginLeft:110,fontSize:15}}>{this.state.messageTarget.statu}</div>
            </div>  : null
          }
          <div id ='messageArea' >
            {
              
              
              this.state.messages.map(index =>{
                if(index.target == this.state.messageTarget.username || index.sender == this.state.messageTarget.username){
                  this.addMessageArea(index);
                }
              })
            }
          </div>
         </div>
         {
           this.state.messageTarget.username ? 
           <div>
           <input type="text" className="message" value={this.state.value} onChange={this.handleChange} />
           <input type="submit" className="button" value="GÖNDER" onClick = {() =>{
             const message = {
                content:this.state.value,
                target:this.state.messageTarget.username,
                sender:this.state.username
             }
             this.sendMessage(message);
             this.setState({value:''});
             document.getElementById('messageArea').innerHTML = "";
           }} />
         </div> : null
         }
         
      </div>




    );
  }
  
}



  

export default App;
