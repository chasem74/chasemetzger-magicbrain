import * as ActionContants from '../../common/action_constants';

const initialState = {
	id: '',
	name: '',
	email: '',
	pet: '',
	age: '',
	entries: 0,
	joined: ''
};

const user = (state = initialState, action) => {
	switch(action.type){
		case ActionContants.FETCH_USER_DATA_SUCCESS:
		case ActionContants.SET_USER_DATA_SUCCESS:
			return {
				...state,
				...action.payload
			}
		case ActionContants.INCREMENT_ENTRY_COUNT_FOR_CURRENT_USER:
			return {
				...state,
				entries: action.payload
			};
		case ActionContants.FETCH_USER_DATA_FAILED:
		case ActionContants.SET_USER_DATA_FAILED:
		case ActionContants.SIGNOUT_SUCCESS:
			return initialState;
		default:
			return state;
	}
};

export default user;