import { UPDATE_DOCUMENTFILTERTYPEDATA } from '../actions/documentFilterDataAction';

export default function documentFilterDataReducer(state = '', { type, payload }) {
	switch (type) {
		case UPDATE_DOCUMENTFILTERTYPEDATA:
			return payload.filterTypeData;
		default:
			return state;
	}
}