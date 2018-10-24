import * as ActionConstants from '../../common/action_constants';

export const setAuthToken = (newToken) => {
	window.sessionStorage.setItem('token', newToken);

	return {
		type: ActionConstants.SET_AUTH_TOKEN,
		payload: newToken
	}
};