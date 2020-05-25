import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { connect } from 'react-redux';
import { getDocument,createDocument } from '../../src/actions/document-actions';


class DocumentListView extends Component {

    constructor(props) {
        super(props);
        this.onGetDocument = this.onGetDocument.bind(this);
    }

    onGetDocument(id,parenttitleId) {
        if (id === -1) {
            this.props.createDocument(parenttitleId);
        }
        else {
            this.props.onGetDocument(id);
        }

    }
    render() {

        return (
            <div className="connectList" style={{ backgroundColor: 'white', paddingLeft: 10, paddingTop: 10 }}>
                {this.props.documentList.map(index =>
                    <div key={index.id} >
                        <div className="row">
                            <div className="col-md-8">
                                {index[0].parenttitle}
                            </div>
                            <div className="col-md-4">
                                <button onClick={() => { this.onGetDocument(-1,index[0].id); }}>+</button>
                            </div>
                        </div>

                        <div style={{ padding: 5 }}>
                            <ul>
                                {index.map(index2 =>
                                    <li key={index2.id}>
                                        <a onClick={() => { this.onGetDocument(index2.id) }} style={{ cursor: 'pointer' }}>{index2.title}</a>
                                    </li>
                                )}
                            </ul>
                        </div>

                    </div>)}

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
    onGetDocument: getDocument,
    createDocument:createDocument,
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentListView);