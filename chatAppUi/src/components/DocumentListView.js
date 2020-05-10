import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
export default class DocumentListView extends Component {
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
                                       <a style={{cursor:'pointer'}}>{index2.title}</a> 
                                    </li>
                                )}
                            </ul>
                        </div>

                    </div>)}

            </div>
        );
    }
}
