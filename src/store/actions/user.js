import * as ActionConstants from '../../common/action_constants'
import * as ApiConstants from '../../common/api_constants';

export const setUserData = (userData) => (dispatch, getState) => {
	const token = window.sessionStorage.getItem('token');
	if(token){
		fetch(ApiConstants.BASE_URL + `/profile/${userData.id}`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify({
				formInput: userData
			})
		})
		.then(response => response.json())
		.then(success => {
			dispatch({
				type: ActionConstants.SET_USER_DATA_SUCCESS,
				payload: userData
			});
		})
		.catch(error => {
			dispatch({
				type: ActionConstants.SET_USER_DATA_FAILED,
				payload: error
			});
		});
	}else{
		dispatch({
			type: ActionConstants.SET_USER_DATA_FAILED,
			payload: null
		});
	}
};

export const fetchUserById = (id) => (dispatch) => {
	const token = window.sessionStorage.getItem('token');
	if(token){
		fetch(ApiConstants.BASE_URL + `/profile/${id}`, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			}
		})
		.then(response => response.json())
		.then(user => {
			dispatch({
				type: ActionConstants.FETCH_USER_DATA_SUCCESS,
				payload: user
			});
		})
		.catch(error => {
			dispatch({
				type: ActionConstants.FETCH_USER_DATA_FAILED,
				payload: error
			});
		});
	}else{
		dispatch({
			type: ActionConstants.FETCH_USER_DATA_FAILED,
			payload: null
		})
	}
};

export const signinWithEmailAndPassword = (email, password, callback) => (dispatch) => {
	fetch(ApiConstants.BASE_URL + '/signin', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			password
		})
	})
	.then(response => response.json())
	.then(data => {
		if(data.success && data.userId){
			dispatch({
				type: ActionConstants.SIGNIN_SUCCESS,
				payload: data.token
			});
		}else{
			dispatch({
				type: ActionConstants.SIGNIN_FAILED,
				payload: data
			});
		}
		callback(data);
	})
	.catch(error => {
		dispatch({
			type: ActionConstants.SIGNIN_FAILED,
			payload: error
		});
	})
};

export const signinWithToken = (callback) => (dispatch) => {
	const token = window.sessionStorage.getItem('token');
	if(token){
		fetch(ApiConstants.BASE_URL + '/signin', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			}
		})
		.then(response => response.json())
		.then(data => {
			if(data && data.id){
				dispatch({
					type: ActionConstants.SIGNIN_SUCCESS,
					payload: token
				});
			}else{
				dispatch({
					type: ActionConstants.SIGNIN_FAILED,
					payload: token
				});
			}
			callback(data.id);
		});
	}else{
		callback(null);
	}
};

export const signout = (callback) => (dispatch) => {
	const token = window.sessionStorage.getItem('token');
	if(token){
			fetch(ApiConstants.BASE_URL + '/signout', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then(response => response.json())
			.then(success => {
				if(success){
					dispatch({
						type: ActionConstants.SIGNOUT_SUCCESS
					});
				}else{
					dispatch({
						type: ActionConstants.SIGNOUT_FAILED
					})
				}
				window.sessionStorage.removeItem('token');
				callback(success);
			})
			.catch(() => callback(false));
	}else{
		callback(true);
	}
};