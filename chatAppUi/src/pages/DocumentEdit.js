import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
                    onInit={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    config={{
                        simpleUpload: {
                          uploadUrl: 'https://myserver.herokuapp.com/image-upload'
                        },
                        toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable',
                          'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo']
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
