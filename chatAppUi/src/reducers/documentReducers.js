import { UPDATE_DOCUMENT, GET_DOCUMENT_ERROR } from '../actions/document-actions';

export default function userReducer(state = '', { type, payload }) {
	switch(type){
		case UPDATE_DOCUMENT:
			return payload.document;
		case GET_DOCUMENT_ERROR:
			return payload.error;
		default:
			return state;
	}
}