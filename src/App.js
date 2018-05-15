import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognitionResult from './components/FaceRecognitionResults/FaceRecognitionResults';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

import './App.css';

const CLARIFAI_API_KEY = "f032556c971b4b29ba83f3a6dad2d904";

const clarifaiApp = new Clarifai.App({
	apiKey: CLARIFAI_API_KEY
});

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

const SIGNIN_ROUTE = 'signin';
const SIGNOUT_ROUTE = 'signout';
const HOME_ROUTE = 'home';
const REGISTER_ROUTE = 'register';

class App extends Component {
	constructor(){
		super();

		this.state = {
			input: '',
			imageUrl: '',
			boxes: [],
			route: SIGNIN_ROUTE,
			isSignedIn: false
		};
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

	onButtonSubmit = () => {
		this.setState({imageUrl: this.state.input});
		
		clarifaiApp.models
		.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
		.then(response => this.setBoxesState(this.calculateFaceLocation(response)))
		.catch(error => console.log(error));
	}

	onRouteChange = (route) => {
		if(route === SIGNOUT_ROUTE){
			this.setState({isSignedIn: false});
		}else if(route === HOME_ROUTE){
			this.setState({isSignedIn: true});
		}
		
		this.setState({route: route});
	}

	render() {
		const {isSignedIn, route, boxes, imageUrl} = this.state;
		return (
			<div className="App">
				<Particles className='particles' style={{width: '100%', height: '100%'}} params={particleOptions} />
				<Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
				
				{route === HOME_ROUTE ?
					<div>
						<Logo />
						<Rank />
						<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
						<FaceRecognitionResult boxes={boxes} imageUrl={imageUrl} />
					</div>
					: (route === SIGNIN_ROUTE
					? <SignIn onRouteChange={this.onRouteChange} />
					: <Register onRouteChange={this.onRouteChange} />
					)
				}
			</div>
		);
	}
}

export default App;