import axios from 'axios';

export const UPDATE_DOCUMENTFILTERTYPEDATA = 'UPDATE_DOCUMENTFILTERTYPEDATA';

export function updateDocumentFilterTypeData(filtertypedata) {
	return {
		type: UPDATE_DOCUMENTFILTERTYPEDATA,
		payload: {
			filterTypeData: filtertypedata
		}
	}
}

export function getDocumentFilterTypeData(filtertype) {
	return async dispatch => {
		try {
			if (localStorage.getItem('userToken') !== null && localStorage.getItem('userToken') !== '') {
				await axios.get('http://localhost:5000/users/getdocumentfiltertypedata/' + filtertype, {
					headers: { Authorization: "Bearer " + localStorage.getItem('userToken') }
				}).then(function (response) {
					dispatch(updateDocumentFilterTypeData(response.data));
				})
			}

		} catch (e) {
			
		}
	}
}