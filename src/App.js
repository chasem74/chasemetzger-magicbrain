import React, { Component } from 'react';
import Particles from 'react-particles-js';

import Constants from './constants';

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
	route: Constants.SIGNIN_ROUTE,
	isSignedIn: false,
	isProfileOpen: false,
	user: {
		id: '',
		name: '',
		email: '',
		pet: '',
		age: '',
		entries: 0,
		joined: ''
	}
};

class App extends Component {
	
	constructor(){
		super();

		this.state = initialState;
	}

	componentDidMount(){
		const token = window.sessionStorage.getItem('token');
		if(token){
			fetch(Constants.BASE_URL + '/signin', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token
				}
			})
			.then(response => response.json())
			.then(data => {
				if(data && data.id){
					fetch(Constants.BASE_URL + `/profile/${data.id}`, {
						method: 'get',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': token
						}
					})
					.then(response => response.json())
					.then(user => {
						if(user && user.email){
							this.loadUser(user);
							this.onRouteChange('home');
						}
					})
				}
			})
			.catch(console.log);
		}
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
		
		fetch(Constants.BASE_URL + '/imageurl', {
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
				fetch(Constants.BASE_URL + '/image', {
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
		if(route === Constants.SIGNOUT_ROUTE){
			return this.setState(initialState);
		}else if(route === Constants.HOME_ROUTE){
			this.setState({isSignedIn: true});
		}
		
		this.setState({route: route});
	}

	toggleProfileModal = () => {
		this.setState(prevState => ({
			isProfileOpen: !prevState.isProfileOpen
		}));
	}

	loadUser = (newUser) => {
		this.setState({
			user: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				entries: newUser.entries,
				joined: newUser.joined
			}
		});
	}

	render() {
		const {isSignedIn, route, boxes, imageUrl, user, isProfileOpen} = this.state;
		return (
			<div className="App">
				<Particles className='particles' style={{width: '100%', height: '100%'}} params={particleOptions} />
				<Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} toggleModal={this.toggleProfileModal}/>
				{isProfileOpen &&
						<ProfileModal>
							<Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleProfileModal} user={user} loadUser={this.loadUser}/>
						</ProfileModal>
				}
				{route === Constants.HOME_ROUTE ?
					<div>
						<Logo />
						<Rank name={user.name} entries={user.entries}/>
						<ImageLinkForm onInputChange={this.onInputChange} onImageSubmit={this.onImageSubmit} />
						<FaceRecognitionResult boxes={boxes} imageUrl={imageUrl}/>
					</div>
					: (route === Constants.SIGNIN_ROUTE
					? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
					: <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
					)
				}
			</div>
		);
	}
}

export default App;