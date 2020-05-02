import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import UploadAdapter from './UploadAdapter';
export default class componentName extends Component {

    state = {
        contentData : null
    }
    render() {
        return (
            <div>
                <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Hello from CKEditor 5!</p>"
                    onInit={editor => {
                        editor.plugins.get( 'FileRepository' ).createUploadAdapter = function ( loader ) {
                            console.log(loader.file);
                         return new UploadAdapter( loader );
                        };
                       }}
                    
                    onChange={ ( event, editor ) => {
                        
                        const data = editor.getData();
                        this.setState({contentData:data});
                        console.log( { event, editor, data } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />

                <button onClick={()=>{console.log(this.state.contentData);}}>sdasda</button>
            </div>
        );
    }
}
