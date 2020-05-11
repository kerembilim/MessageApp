import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { connect } from 'react-redux';
import { getDocument } from '../../src/actions/document-actions';


class DocumentListView extends Component {

    constructor(props){
        super(props);
        this.onGetDocument = this.onGetDocument.bind(this);
    }

    onGetDocument(id){
        console.log(id);
		this.props.onGetDocument(id);
	}
    render() {
        
        return (
            <div className="connectList" style={{ backgroundColor: 'white', paddingLeft: 10, paddingTop: 10 }}>
                {this.props.documentList.map(index =>
                    <div>
                        {index[0].parenttitle}
                        <div style={{ padding: 5 }}>
                            <ul>
                                {index.map(index2 => 
                                    <li>
                                       <a onClick={ ()=>{this.onGetDocument(index2.id)}  } style={{cursor:'pointer'}}>{index2.title}</a> 
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
    onGetDocument: getDocument
  };

  export default connect(mapStateToProps, mapDispatchToProps)(DocumentListView);