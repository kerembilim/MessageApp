import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
export default class DocumentListView extends Component {
    render() {
        return (
            <div className="connectList" style={{backgroundColor:'white',paddingLeft: 10,paddingTop:10}}>
                <p>textInComponent</p>
                <div style={{padding:5}}>
                    <ul>
                        <li>
                            Araç Belgeleri
                        </li>
                        <li>
                            Araç Belgeleri
                        </li>
                        <li>
                            Araç Belgeleri
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
