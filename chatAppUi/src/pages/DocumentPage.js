import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


import axios, { post } from 'axios';


import { connect } from 'react-redux';
import { updateUser, getUsers } from '../../src/actions/user-actions';
import { getDocumentFilterTypeData } from '../../src/actions/documentFilterDataAction';

import UploadAdapter from './UploadAdapter';
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentListView from '../components/DocumentListView';
class DocumentPage extends Component {

    constructor(props) {
        super(props);
        this.FilterChange = this.FilterChange.bind(this);
    }

    state = {
        contentData: null,
        documentList: []
    }

    FilterChange = () => {
        this.props.onFilterChange(document.getElementById('filtertype').value);
        document.getElementById('choosingLane').style.display = 'block';
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

                    <div className="row" style={{ padding: '2%' }}>
                        <div className="col-md-12 connectList" style={{ backgroundColor: 'white', paddingLeft: 10, paddingTop: 10 }}>
                            {/* doküman bilgileri eklenecek*/}
                            <div style={{ fontSize: '17px', color: 'black' }}>
                                <ul>
                                    {
                                        typeof this.props.document.canedit === 'undefined' ? <li style={{ color: 'red' }}>Choose a document for edit or create</li> : <li style={{ color: 'red' }}>Your changes will not save because you don\'t have edit permission.</li>

                                    }


                                </ul>
                                {
                                    this.props.document.id === -1 ?
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-3 ml-3">
                                                        <label>Title</label>

                                                        <br />
                                                        <label style={{ marginLeft: 2 }}>Description</label>

                                                    </div>
                                                    <div className="col-md-6">
                                                        <input type="text" id="lname" name="lname" />
                                                        <br />
                                                        <input type="text" id="ln0ame" name="lnasdame" />
                                                    </div>


                                                </div>


                                                <br />

                                            </div>
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label style={{ marginLeft: 2 }}>Filter Type</label>
                                                    </div>
                                                    <div className="col-md-9">
                                                        <select id="filtertype" onChange={() => { this.FilterChange() }}>
                                                            <option value="user">User</option>
                                                            <option value="department">Department</option>
                                                            <option value="workgroup">workgroup</option>
                                                        </select>
                                                        <div style={{ display: 'none' }} id="choosingLane">
                                                            {
                                                                 this.props.documentFilterData !== '' ?
                                                                this.props.documentFilterData.map(index =>
                                                                    <div>
                                                                        <label >{index.name || index.username}</label>
                                                                        <input type="checkbox" id={index.id} value={index.id} />
                                                                    </div>
                                                                ) : null
                                                            }

                                                        </div>


                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                        </div>
                                                        <div className="col-md-9">

                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </div> : ''
                                }

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <CKEditor
                                editor={ClassicEditor}
                                data={this.props.document.content}
                                onInit={editor => {
                                    editor.plugins.get('FileRepository').createUploadAdapter = function (loader) {
                                        return new UploadAdapter(loader);
                                    };
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
    onGetUsers: getUsers,
    onFilterChange: getDocumentFilterTypeData
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPage);
