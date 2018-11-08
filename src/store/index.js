import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';

import user from './reducers/user';
import authToken from './reducers/auth_token';

const sessionReducers = combineReducers({user, authToken});

const rootReducers = combineReducers({session: sessionReducers});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducers, composeEnhancers(applyMiddleware(thunk)));

export default store;