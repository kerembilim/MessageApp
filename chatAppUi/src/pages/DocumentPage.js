import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


import axios, { post } from 'axios';


import { connect } from 'react-redux';
import { updateUser, getUsers } from '../../src/actions/user-actions';
import { getDocumentFilterTypeData } from '../../src/actions/documentFilterDataAction';
import { saveNewDocument } from '../../src/actions/document-actions';

import UploadAdapter from './UploadAdapter';
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentListView from '../components/DocumentListView';
class DocumentPage extends Component {

    constructor(props) {
        super(props);
        this.FilterChange = this.FilterChange.bind(this);
        this.documentSubmit = this.documentSubmit.bind(this);
        this.input = React.createRef();
    }

    state = {
        contentData: null,
        documentList: [],
        descriptionText: '',
        filtertype: '',
        titleText: ''

    }

    handleChangeDesc = (event) => {
        this.setState({ descriptionText: event.target.value })
    }

    handleChangeTitle = (event) => {
        this.setState({ titleText: event.target.value })
    }

    FilterChange = () => {
        this.props.onFilterChange(document.getElementById('filtertype').value);
        this.setState({ filtertype: document.getElementById('filtertype').value });
        document.getElementById('choosingLane').style.display = 'block';
    }

    documentSubmit = () => {
        console.log(this.state.titleText);
        var elements = document.getElementsByClassName('documentfilterData');
        let documentFilterData = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].checked === true) {
                documentFilterData.push(Number(elements[i].id));
            }
        }
        if (this.props.document.id === -1) {
            let document = {
                "id": -1,
                "content": this.state.contentData,
                "description": this.state.descriptionText,
                "title": this.state.titleText,
                "filtertype": this.state.filtertype,
                "parenttitleid": this.props.document.parenttitleid,
                "documentFilterData": documentFilterData
            }
            this.props.saveNewDocument(document);

        }
        else {
            console.log(this.props.document.id);
            let document = {
                "id": this.props.document.id,
                "content": this.state.contentData,
                "description": this.state.descriptionText,
                "title": this.state.titleText,
                "filtertype": this.state.filtertype,
                "parenttitleid": this.props.document.parenttitleid,
                "documentFilterData": documentFilterData
            }
            this.props.saveNewDocument(document);

        }
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
                                    this.props.document.id === -1 || this.props.document.canedit ?
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="row">
                                                    <div className="col-md-3 ml-3">
                                                        <label>Title</label>

                                                        <br />
                                                        <label style={{ marginLeft: 2 }}>Description</label>

                                                    </div>
                                                    <div className="col-md-6">
                                                        <input type="text" id="documentTitle" onChange={this.handleChangeTitle} defaultValue={this.props.document.title} />
                                                        <br />
                                                        <input type="text" id="documentDesc" onChange={this.handleChangeDesc} defaultValue={this.props.document.description} />
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
                                                                            <input type="checkbox" id={index.id} className="documentfilterData" />
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
                                    document.getElementById('saveButton').disabled = !this.props.document.canedit;
                                }}


                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    this.setState({ contentData: data });
                                }}
                            />
                        </div>
                    </div>


                    <button id='saveButton' onClick={() => { this.documentSubmit() }}>Kaydet</button>
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
    onFilterChange: getDocumentFilterTypeData,
    saveNewDocument
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPage);
