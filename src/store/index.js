import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import user from './reducers/user';

const session = combineReducers({user});

const store = createStore(session, applyMiddleware(thunk));

export default store;