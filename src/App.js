import React, { Component } from 'react';

import {connect} from 'react-redux';
import * as AuthActions from './store/actions/auth_token';
import * as UserActions from './store/actions/user';

import Particles from 'react-particles-js';

import * as RouteConstants from './common/route_constants';
import * as ApiConstants from './common/api_constants';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognitionResult from './components/FaceRecognitionResults/FaceRecognitionResults';
import SignIn from './components/SignIn/SignIn';
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

const initialState = {
	input: '',
	imageUrl: '',
	boxes: [],
	route: RouteConstants.SIGNIN,
	isSignedIn: false,
	isProfileOpen: false
};

class App extends Component {
	
	constructor(props){
		super(props);

		this.state = initialState;
	}

	componentDidMount(){
		this.props.signinWithToken((id) => {
			if(id){
				this.props.fetchUserById(id);
				this.onRouteChange('home');
			}else{
				this.onRouteChange('signin');
			}
		});
	}

	calculateFaceLocation = (data) => {
		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		const boxes = data.outputs[0].data.regions.map(region => {
			return {
				leftCol: region.region_info.bounding_box.left_col * width,
				topRow: region.region_info.bounding_box.top_row * height,
				rightCol: width - (region.region_info.bounding_box.right_col * width),
				bottomRow: height - (region.region_info.bounding_box.bottom_row * height)
			};
		});

		return boxes;
	}

	setBoxesState = (boxes) => {
		this.setState({boxes: boxes});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onImageSubmit = () => {
		this.setState({imageUrl: this.state.input});
		
		fetch(ApiConstants.BASE_URL + '/imageurl', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				input: this.state.input
			})
		})
		.then(response => response.json())
		.then(response => {
			if(response){
				fetch(ApiConstants.BASE_URL + '/image', {
					method: 'put',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						id: this.state.user.id
					})
				})
				.then(response => response.json())
				.then(count => {
					this.setState({
						user: {
							...this.state.user,
							entries: count
						}
					});
				});
			}
			this.setBoxesState(this.calculateFaceLocation(response))
		})
		.catch(error => console.log(error));
	}

	onRouteChange = (route) => {
		if(route === RouteConstants.SIGNOUT){
			this.props.signout(success => {
				this.setState(initialState);
			});
		}else if(route === RouteConstants.HOME){
			this.setState({isSignedIn: true});
		}
		
		this.setState({route: route});
	}

	toggleProfileModal = () => {
		this.setState(prevState => ({
			isProfileOpen: !prevState.isProfileOpen
		}));
	}

	render() {
		const {isSignedIn, route, boxes, imageUrl, isProfileOpen} = this.state;
		const {user} = this.props;
		return (
			<div className="App">
				<Particles className='particles' style={{width: '100%', height: '100%'}} params={particleOptions} />
				<Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} toggleModal={this.toggleProfileModal}/>
				{isProfileOpen &&
						<ProfileModal>
							<Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleProfileModal}/>
						</ProfileModal>
				}
				{route === RouteConstants.HOME ?
					<div>
						<Logo />
						<Rank name={user.name} entries={user.entries}/>
						<ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit} />
						<FaceRecognitionResult boxes={boxes} imageUrl={imageUrl}/>
					</div>
					: (route === RouteConstants.SIGNIN
					? <SignIn onRouteChange={this.onRouteChange}/>
					: <Register onRouteChange={this.onRouteChange} />
					)
				}
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