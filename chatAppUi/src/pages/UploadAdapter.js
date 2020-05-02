import axios from 'axios';

export default class UploadAdapter {
    constructor(loader) {
        // Save Loader instance to update upload progress.
        this.loader = loader;
    }

    upload() {
        return this.loader.file
            .then(uploadedFile => {
                return new Promise((resolve, reject) => {
                    const data = new FormData();
                    data.append('file', uploadedFile);

                    axios( {
                        url: 'http://localhost:4010/fileupload/imageupload',
                        method: 'post',
                        data,
                        headers: {
                            'content-type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                        },
                        withCredentials: false
                    } ).then( response => {
                        if ( response.status == 200 ) {
                            console.log('asd');
                            console.log(response.data);
                            resolve( {
                                default: response.data.url
                            } );
                        } else {
                            reject( response.data.message );
                        }
                    } ).catch( response => {
                        reject( 'Upload failed' );
                    } );
                    //return post(url, data, config)

                });
            });
    }

    abort() {
        // Reject promise returned from upload() method.
    }
}