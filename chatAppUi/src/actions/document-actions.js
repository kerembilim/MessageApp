import axios from 'axios';

export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT';
export const GET_DOCUMENT_ERROR = 'GET_DOCUMENT_ERROR';

export function updateDocument(newDocument){
	return {
		type: UPDATE_DOCUMENT,
		payload: {
			document: newDocument
		}
	}
}

export function showError(){
	return {
		type: GET_DOCUMENT_ERROR,
		payload: {
			error: 'ERROR!!'
		}
	}
}

export function getDocument(id){
	return async dispatch => {
		try{
			if (localStorage.getItem('userToken') !== null && localStorage.getItem('userToken') !== '') {
                await axios.get('http://localhost:4010/document/getdocumentdetail/' + id, {
                  headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
                }).then(function (response) {
                    dispatch(updateDocument(response.data.content));
                })
              }
			
		}catch (e) {
			dispatch(showError());
		}
	}
}