import axios, { post } from 'axios';

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

                    const url = 'http://localhost:4010/fileupload/messagefileupload';
                    const config = {
                        headers: {
                            'content-type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                        }
                    }

                    axios( {
                        url: 'http://localhost:4010/fileupload/messagefileupload',
                        method: 'post',
                        data,
                        headers: {
                            'content-type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + localStorage.getItem('userToken')
                        },
                        withCredentials: false
                    } ).then( response => {
                        console.log(response.status)
                        if ( response.status == 200 ) {
                            console.log('asd');
                            resolve( {
                                default: 'https://i.insider.com/56dd5464dd08956d4b8b46ac?width=800&format=jpeg'//response.data.url
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