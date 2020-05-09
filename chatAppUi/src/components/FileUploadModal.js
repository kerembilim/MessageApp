import React, { Component } from 'react';
import ReactModal from 'react-modal';

export default class FileUploadModal extends Component {
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
        <input type="file" onChange={this.onChange} className="form-control" />
                    <button type="submit" className="form-control" onClick={this.onFormSubmit}>Upload</button>
      </ReactModal>
    );
  }
}
