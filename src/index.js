import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {
	withRouter,
	BrowserRouter as Router
} from 'react-router-dom';

import App from './App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'tachyons';
import './index.css';

const RouterApp = withRouter(App);

const RoutingApp = (props) => <Router {...props} ><RouterApp /></Router>;

ReactDOM.render(<Provider store={store}><RoutingApp /></Provider>, document.getElementById('root'));
registerServiceWorker();
