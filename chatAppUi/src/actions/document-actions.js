import axios from 'axios';

export const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT';
export const GET_DOCUMENT_ERROR = 'GET_DOCUMENT_ERROR';

export function updateDocument(newDocument) {
	return {
		type: UPDATE_DOCUMENT,
		payload: {
			document: newDocument
		}
	}
}

export function showError() {
	return {
		type: GET_DOCUMENT_ERROR,
		payload: {
			error: 'ERROR!!'
		}
	}
}

export function getDocument(id) {
	return async dispatch => {
		try {
			if (localStorage.getItem('userToken') !== null && localStorage.getItem('userToken') !== '') {
				await axios.get('http://localhost:4010/document/getdocumentdetail/' + id, {
					headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
				}).then(function (response) {
					dispatch(updateDocument(response.data));
				})
			}

		} catch (e) {
			dispatch(showError());
		}
	}
}

export function createDocument(parenttitleid) {
	return async dispatch => {
		let document = {
			"id": -1,
			"content": "3310",
			"description": "",
			"title": "",
			"filtertype": null,
			"createruserid": null,
			"parenttitleid": parenttitleid,
			"canedit": true
		}
		dispatch(updateDocument(document));
	}
}

export function saveNewDocument(document) {
	return async dispatch => {
		try {
			if (localStorage.getItem('userToken') !== null && localStorage.getItem('userToken') !== '') {
				await axios.post('http://localhost:4010/document/documentcreate/',document, {
					headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
				}).then(function (response) {
					dispatch(updateDocument(document));
					console.log(response)
				})
			}
		} catch (e) {
			dispatch(showError());
		}
	}
}