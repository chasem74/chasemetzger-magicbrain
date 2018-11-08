import React from 'react';

import {
	Route,
	withRouter,
	Redirect,
	BrowserRouter as Router
} from 'react-router-dom';

import {connect} from 'react-redux';
import * as AuthActions from './store/actions/auth_token';
import * as UserActions from './store/actions/user';

import Particles from 'react-particles-js';

import * as RouteConstants from './common/route_constants';
import * as ApiConstants from './common/api_constants';

import Navigation from './components/Navigation/Navigation';

import Home from './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import SignOut from './components/SignOut/SignOut';
import Register from './components/Register/Register';

import ProfileModal from './components/Modal/ProfileModal';
import Profile from './components/Profile/Profile'

import './App.css';

const particleOptions = {
	particles: {
		number:{
			value: 100,
		
			density: {
				enable: true,
				value_area: 800
			}
		}
	}
};

const AuthenicatedRoute = ({component: Component, isSignedIn, componentProps, ...rest}) => {
	console.log(componentProps, isSignedIn);
	return (
		<Route
		{...rest}
		render={(props) => isSignedIn ? (
			<Component {...props} {...componentProps}/>
			) : (
				<Redirect to={{
					pathname: "/signin",
					state: {from: props.location}
				}}/> )
		}
		/>
	);
};

const Routing = ({isSignedIn}) => (
	<div>
		<AuthenicatedRoute exact path="/" component={Home} isSignedIn={isSignedIn} componentProps={{isSignedIn}}/>
		<Route path="/signin" component={SignIn} />
		<Route path="/register" component={Register} />
		<Route path="/signout" component={SignOut} />
	</div>
);

class App extends React.Component {
	
	constructor(props){
		super(props);

		this.state = {
			isProfileOpen: false
		};
	}

	componentDidMount(){
		console.log(window.sessionStorage.getItem('token'));
		const token = window.sessionStorage.getItem('token');
		if(token){
			this.props.setAuthToken(token);
		}
		//this.props.setAuthToken(window.sessionStorage.getItem('token'));
	}

	toggleProfileModal = () => {
		this.setState(prevState => ({
			isProfileOpen: !prevState.isProfileOpen
		}));
	}

	render() {
		const {isProfileOpen} = this.state;
		const isSignedIn = (this.props.authToken !== null && this.props.authToken !== undefined);
		return (
				<div className="App">
					<Particles className='particles' style={{width: '100%', height: '100%'}} params={particleOptions} />
					<Navigation history={this.props.history} isSignedIn={isSignedIn} signout={this.props.signout} toggleModal={this.toggleProfileModal}/>
					{isProfileOpen &&
							<ProfileModal>
								<Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleProfileModal}/>
							</ProfileModal>
						}

						<Routing isSignedIn={isSignedIn} />
				</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		authToken: state.session.authToken,
		user: state.session.user
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		signinWithToken: (callback) => dispatch(UserActions.signinWithToken(callback)),
		signout: (callback) => dispatch(UserActions.signout(callback)),
		setAuthToken: (newToken) => dispatch(AuthActions.setAuthToken(newToken)),
		fetchUserById: (id) => dispatch(UserActions.fetchUserById(id))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);