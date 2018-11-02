import * as ActionConstants from '../../common/action_constants';

const authToken = (state = null, action) => {
	switch(action.type){
		case ActionConstants.SET_AUTH_TOKEN:
		case ActionConstants.SIGNIN_SUCCESS:
			return action.payload;
		case ActionConstants.SIGNOUT_SUCCESS:
		case ActionConstants.SIGNOUT_FAILED:
			return state;
		default:
			return state;
	}
};

export default authToken;