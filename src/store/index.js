import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import user from './reducers/user';
import authToken from './reducers/auth_token';

const sessionReducers = combineReducers({user, authToken});

const rootReducers = combineReducers({session: sessionReducers});

const store = createStore(rootReducers, applyMiddleware(thunk));

export default store;