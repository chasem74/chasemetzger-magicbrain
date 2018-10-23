
const initialState = {
	id: '',
	name: '',
	email: '',
	pet: '',
	age: '',
	entries: 0,
	joined: ''
}

const user = (state = initialState, action) => {
	switch(action.type){
		default:
			return state;
	}
};

export default user;