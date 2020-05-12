import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


import axios, { post } from 'axios';


import { connect } from 'react-redux';
import { updateUser, getUsers } from '../../src/actions/user-actions';

import UploadAdapter from './UploadAdapter';
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentListView from '../components/DocumentListView';
class DocumentPage extends Component {

    state = {
        contentData: null,
        documentList: []
    }



    componentDidMount() {
        var self = this;
        axios.get('http://localhost:4010/document/getdocumentstitle/', {
            headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
        }).then(function (response) {
            self.setState({ documentList: response.data })
        })
    }
    render() {
        return (
            <div className="row" style={{ padding: '1%' }}>
                <div className="col-md-2">
                    <DocumentListView
                        documentList={this.state.documentList}
                    />
                </div>
                <div className="col-md-9" style={{ padding: 0, height: '80vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                    <div style={{display:this.props.document.canedit == true ? 'none' : 'block',fontSize:'30px',color:'white'}}>
                    Your changes will not save because you don\'t have edit permission.
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <CKEditor
                                editor={ClassicEditor}
                                data={this.props.document.content + '  ' + this.props.document.canedit }
                                onInit={editor => {
                                    editor.plugins.get('FileRepository').createUploadAdapter = function (loader) {
                                        return new UploadAdapter(loader);
                                    };
                                    //if(this.props.document.canedit == true){
                                    //    editor.isReadOnly = false
                                    //}
                                    //else{
                                    //    editor.isReadOnly = true
                                    //}
                                    
                                }}


                                onFocus={(event, editor) => {
                                        document.getElementById('saveButton').disabled = this.props.document.canedit;
                                }}


                                onChange={(event, editor) => {

                                    const data = editor.getData();
                                    this.setState({ contentData: data });
                                }}
                            />
                        </div>
                    </div>


                    <button id='saveButton' onClick={() => { console.log(this.state.contentData); }}>sdasda</button>
                </div>
            </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPage);
